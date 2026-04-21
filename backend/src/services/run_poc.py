import hashlib
import asyncio
import json
import logging
import os
import sys
from typing import Any, Dict, Optional

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.runnables import Runnable
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI

from src.repositories.cache_repository import get_cache_repository
from src.models import FullProfileEvaluationResponse, enrich_full_profile_evaluation
from src.models.models_raw import FullProfileEvaluationResponseRaw
from src.services.quick_wins_logic import generate_quick_wins
from src.services.job_descriptions import generate_job_opportunities, generate_recommended_roles
from src.services.scoring_logic import calculate_profile_strength
from src.services.interview_readiness_logic import calculate_interview_readiness
from src.services.tools_logic import generate_tool_recommendations
from src.services.profile_notes_logic import generate_profile_strength_notes
from src.services.current_profile_summary import generate_current_profile_summary
from src.services.peer_comparison_logic import generate_peer_group_description, calculate_potential_percentile
from src.utils.label_mappings import get_role_label, get_company_label
from src.config.settings import settings
from src.config.telemetry import get_tracer

load_dotenv()

logger = logging.getLogger(__name__)
_tracer = get_tracer(__name__)


DEFAULT_INPUT: Dict[str, Any] = {
    "background": "tech",
    "quizResponses": {
        "currentRole": "swe-product",
        "experience": "3-5",
        "targetRole": "faang-sde",
        "problemSolving": "51-100",
        "systemDesign": "once",
        "portfolio": "active-5+",
        "mockInterviews": "monthly",
        "currentCompany": "Google",
        "currentSkill": "51-100",
        "requirementType": "upskilling",
        "targetCompany": "faang",
    },
    "goals": {
        "requirementType": [],
        "targetCompany": "Google",
        "topicOfInterest": [],
    },
}


def _normalise_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    return json.loads(json.dumps(payload, sort_keys=True))


def _filter_and_rerank_roles(
    recommended_roles: list,
    current_role: str,
    target_role: str,
    experience: str
) -> list:
    """
    Filter and rerank recommended roles based on:
    1. Current role domain (DevOps users should see DevOps-relevant roles)
    2. Target role (Data Analytics users should see data-focused roles)
    3. Experience level (8+ years should see Staff/Principal/EM roles)
    """
    if not recommended_roles:
        return recommended_roles

    # Score each role based on how well it matches user profile
    scored_roles = []

    for role in recommended_roles:
        score = 0
        title_lower = role.get("title", "").lower()
        seniority_raw = role.get("seniority", "")
        # Convert Enum to string if needed
        seniority = str(seniority_raw).lower() if seniority_raw else ""

        # 1. TARGET ROLE MATCHING (HIGHEST PRIORITY - user's explicit choice)
        if target_role:
            target_lower = target_role.lower()

            # Data Analytics/ML target → Data Engineer, Data Analyst, ML Engineer (NOT generic engineer roles)
            if "data" in target_lower or "ml" in target_lower or "analytics" in target_lower:
                if any(x in title_lower for x in ["data engineer", "data analyst", "ml engineer", "machine learning", "analytics engineer"]):
                    score += 30  # HIGHEST - user's explicit target

            # Backend target → Backend, Full-Stack, Senior Backend
            if "backend" in target_lower:
                if any(x in title_lower for x in ["backend", "api", "full-stack"]):
                    score += 25  # HIGHEST - user's explicit target

            # Frontend target → Frontend, Full-Stack
            if "frontend" in target_lower:
                if any(x in title_lower for x in ["frontend", "full-stack", "react", "angular", "vue"]):
                    score += 25  # HIGHEST - user's explicit target

            # DevOps/SRE target → DevOps, SRE, Cloud, Infrastructure
            if "devops" in target_lower or "sre" in target_lower or "infrastructure" in target_lower:
                if any(x in title_lower for x in ["devops", "sre", "cloud", "infrastructure", "platform", "reliability engineer", "site reliability"]):
                    score += 30  # HIGHEST - user's explicit target

            # Tech Lead/Manager target → Tech Lead, Manager, Director
            if "tech-lead" in target_lower or "lead" in target_lower or "manager" in target_lower:
                if any(x in title_lower for x in ["tech lead", "engineering manager", "director", "manager"]):
                    score += 30  # HIGHEST - user's explicit target

            # Staff/Principal target → Staff, Principal, Architect
            if "staff" in target_lower or "principal" in target_lower or "architect" in target_lower:
                if any(x in title_lower for x in ["staff", "principal", "architect"]):
                    score += 30  # HIGHEST - user's explicit target

        # 2. CURRENT ROLE DOMAIN MATCHING (secondary priority)
        if current_role:
            current_lower = current_role.lower()

            # DevOps users → DevOps/SRE/Platform/Infrastructure roles
            if "devops" in current_lower or "infra" in current_lower or "cloud" in current_lower:
                if any(x in title_lower for x in ["devops", "sre", "cloud", "infrastructure", "platform", "reliability engineer", "site reliability"]):
                    score += 15  # Good match (but lower than target role)

            # QA/Support users → QA Automation, Test Engineer, Backend roles
            if "qa" in current_lower or "support" in current_lower:
                if any(x in title_lower for x in ["qa", "automation", "test", "backend", "engineer"]):
                    score += 12  # Good match

            # SWE-Product users → Backend, Full-Stack, Senior roles (stay in product world)
            if "product" in current_lower:
                if any(x in title_lower for x in ["backend", "fullstack", "full-stack", "senior", "staff"]):
                    score += 12  # Good match

            # SWE-Service users → can transition to Product roles
            if "service" in current_lower:
                if any(x in title_lower for x in ["backend", "fullstack", "senior"]):
                    score += 10  # Moderate match

        # 3. EXPERIENCE LEVEL MATCHING (third priority)
        if experience:
            # 8+ years → Staff, Principal, Engineering Manager, Architect, Tech Lead
            if experience == "8+":
                if any(x in title_lower for x in ["staff", "principal", "engineering manager", "architect", "tech lead", "director"]) or \
                   any(x in seniority for x in ["staff", "principal", "principal engineer", "engineering manager", "director"]):
                    score += 18  # Strong match for senior roles
                # Regular engineer roles should be lower priority
                elif any(x in title_lower for x in ["senior", "lead"]) or \
                     "senior" in seniority or "principal" in seniority:
                    score += 10

            # 5-8 years → Senior, Tech Lead, Staff (if strong coding)
            elif experience == "5-8":
                if any(x in title_lower for x in ["senior", "tech lead", "staff", "architect"]) or \
                   any(x in seniority for x in ["senior", "staff", "architect", "tech lead"]):
                    score += 15

            # 3-5 years → Mid-level, Senior (lower-bound)
            elif experience == "3-5":
                if any(x in title_lower for x in ["senior", "mid-level", "sde-2"]) or \
                   any(x in seniority for x in ["mid-senior", "senior", "mid-level"]):
                    score += 10

            # 0-2 years → Junior, Entry-level, SDE-1
            elif experience in ["0-2", "0"]:
                if any(x in title_lower for x in ["junior", "entry", "sde-1", "graduate", "intern"]) or \
                   any(x in seniority for x in ["junior", "entry-level"]):
                    score += 12

        # 4. GENERAL RELEVANCE BOOST (baseline for all roles)
        if any(x in title_lower for x in ["engineer", "developer", "architect", "lead"]):
            score += 5  # All technical roles get small boost

        scored_roles.append((role, score))

    # Sort by score (descending) and return just the roles
    sorted_roles = sorted(scored_roles, key=lambda x: x[1], reverse=True)
    return [role for role, score in sorted_roles]


def _build_openai_structured_llm(
    api_key: Optional[str],
    openai_model: str,
) -> Optional[Runnable]:
    """Build a LangChain structured-output runnable for OpenAI, or None if no key."""
    key = api_key or settings.openai_api_key or os.environ.get("OPENAI_API_KEY")
    if not key:
        return None
    chat = ChatOpenAI(
        model=openai_model,
        api_key=key,
        timeout=settings.openai_timeout,
        max_retries=settings.openai_max_retries,
    )
    return chat.with_structured_output(
        FullProfileEvaluationResponseRaw,
        method="json_schema",
        strict=True,
    )


def _build_gemini_structured_llm() -> Optional[Runnable]:
    """Build a LangChain structured-output runnable for Gemini, or None if no key."""
    key = settings.google_api_key or os.environ.get("GOOGLE_API_KEY")
    if not key:
        return None
    chat = ChatGoogleGenerativeAI(
        model=settings.gemini_model,
        google_api_key=key,
        timeout=settings.gemini_timeout,
        max_retries=settings.gemini_max_retries,
    )
    return chat.with_structured_output(FullProfileEvaluationResponseRaw)


async def call_openai_structured(
    *,
    api_key: Optional[str],
    openai_model: str,
    input_payload: Dict[str, Any],
    calculated_profile_score: int,
    calculated_interview_readiness: Dict[str, Any],
    target_company_label: str,
) -> FullProfileEvaluationResponse:
    system_instruction = (
        "You are a career advisor specializing in the Indian tech market. Given the candidate's background, quiz responses, and goals, "
        "produce a structured FullProfileEvaluationResponse focusing on prospects, role fit, gaps, and a roadmap.\n\n"
        "CONTEXT: The user is based in India and looking for opportunities in the Indian tech ecosystem (Bangalore, Hyderabad, Pune, NCR) "
        "or remote roles with Indian/global companies. Tailor all recommendations to be realistic and relevant for the Indian market.\n\n"
        f"CRITICAL: SCORE CONSISTENCY RULES\n"
        f"The user's profile_strength_score has been calculated as {calculated_profile_score}/100.\n"
        f"The user's interview readiness has been independently calculated based on their practice, experience, and preparation.\n"
        f"ALL percentage scores MUST be consistent with these calculated baselines:\n\n"
        f"1. peer_comparison.metrics.profile_strength_percent: MUST be {calculated_profile_score} (exact match)\n"
        f"2. interview_readiness.technical_interview_percent: MUST be {calculated_interview_readiness['technical_interview_percent']} (calculated independently, NOT dependent on profile_strength_score)\n"
        f"3. interview_readiness.hr_behavioral_percent: MUST be {calculated_interview_readiness['hr_behavioral_percent']} (based on soft skills and experience)\n"
        f"   NOTE: Interview readiness is based on quiz responses (problemSolving, systemDesign, portfolio, experience)\n"
        f"   It can be higher or lower than profile_strength_score - they measure different things!\n\n"
        f"4. peer_comparison.percentile: {max(0, calculated_profile_score - 5)} to {min(100, calculated_profile_score + 5)}\n"
        f"5. success_likelihood.score_percent: {max(0, calculated_profile_score - 10)} to {min(100, calculated_profile_score + 5)}\n"
        f"   - Should be reasonable given profile_strength_score\n\n"
        f"IMPORTANT DISTINCTION:\n"
        f"- profile_strength_score ({calculated_profile_score}%): Overall career strength (experience, skills, track record)\n"
        f"- interview_readiness ({calculated_interview_readiness['technical_interview_percent']}%): Specifically how prepared they are for technical interviews\n"
        f"- A person can have high interview readiness but lower profile strength (new grad who practices hard)\n"
        f"- A person can have strong profile but lower interview readiness (experienced but not interview-prepped)\n\n"
        f"CRITICAL: USE ACTUAL TARGET COMPANY IN ALL TEXT\n"
        f"The user selected target company: '{target_company_label}'\n\n"
        f"When generating ANY text field (areas_to_develop, technical_notes, success_likelihood.notes, peer_comparison.summary):\n"
        f"- Use the ACTUAL company label: '{target_company_label}'\n"
        f"- DO NOT default to 'FAANG' or 'Big Tech' unless that's what they selected\n\n"
        f"Examples:\n"
        f"- If target is 'High Growth Startups' → 'startup interview preparation' NOT 'FAANG interview preparation'\n"
        f"- If target is 'Product Unicorns' → 'product company interview preparation'\n"
        f"- If target is 'Service Companies' → 'service company interview preparation'\n"
        f"- If target is 'FAANG / Big Tech' → 'FAANG / Big Tech interview preparation' (only if selected!)\n\n"
        "Field guide for the input JSON:\n"
        "- background: 'tech' = already works/studies in software; 'non-tech' = transitioning from another domain\n"
        "- quizResponses.currentRole:\n"
        "  * Tech roles: swe-product (Product Company SDE), swe-service (Service Company SDE), devops (DevOps/Cloud/Infra), qa-support (QA/Support/Other Technical)\n"
        "  * Non-tech roles: non-tech-role, support-qa, other-engineering, student (Non-CS background)\n"
        "  * Legacy: career-switcher (treat as non-tech)\n"
        "- quizResponses.experience: '0-2', '3-5', '5-8', or '8+' years (NEW: 4 tiers instead of 3)\n"
        "- quizResponses.targetRole:\n"
        "  * Tech: backend-sde, fullstack-sde, frontend-sde, data-ml, devops-sre, ai-ml-engineer, mobile-dev, tech-lead\n"
        "  * Non-tech: backend-dev, fullstack-dev, data-analyst, automation-qa, exploring\n"
        "  * Legacy: faang-sde, backend, fullstack (still valid)\n"
        "- quizResponses.problemSolving: 0-10, 11-50, 51-100, 100+ (coding practice intensity - DERIVED from codingActivity/learningActivity)\n"
        "- quizResponses.systemDesign: multiple, once, not-yet (CRITICAL: 'multiple' indicates senior-level expertise - DERIVED from systemDesign comfort)\n"
        "- quizResponses.portfolio: active-5+, limited-1-5, inactive, none (DEPRECATED: not collected in new flow)\n"
        "- quizResponses.mockInterviews: weekly+, monthly, rarely, never (DEPRECATED: not collected in new flow)\n"
        "- quizResponses.requirementType: Maps to primaryGoal (better-company, level-up, higher-comp, switch-domain, upskilling, career-switch, job-security, personal-interest)\n"
        "- goals.topicOfInterest: ai-ml, web-development, mobile-development, data-science, cybersecurity, cloud-computing, blockchain, etc.\n\n"
        "⚠️ CRITICAL: LOGICAL CONSISTENCY CHECK (Evaluate FIRST before making recommendations):\n"
        "INPUT CONTRADICTIONS - Real-world skill progression rules:\n\n"
        "1. SYSTEM DESIGN vs CODING CONTRADICTION:\n"
        "   🚨 IMPOSSIBLE COMBINATION: systemDesign='multiple' + problemSolving < '51-100'\n"
        "   Reality: You CANNOT have deep system design expertise without extensive coding practice.\n"
        "   System design requires years of building production systems, which means 100s of problems solved.\n\n"
        "   Resolution Rules:\n"
        "   - If systemDesign='multiple' + problemSolving='0-10' or '11-50' + experience <= '3-5':\n"
        "     → User likely misunderstood questions or is being aspirational\n"
        "     → OVERRIDE: Treat as systemDesign='once' or 'not-yet'\n"
        "     → Recommend Junior/Mid roles (NOT senior)\n"
        "     → In profile_strength_notes: 'Strong interest in system design, but limited coding practice. Focus on solving 100+ problems first.'\n\n"
        "   - If systemDesign='multiple' + problemSolving < '51-100' + experience in ['5-8', '8+'] + currentRole contains 'manager'/'architect':\n"
        "     → Rare case: Transitioned to management/architecture, coding skills atrophied\n"
        "     → Can recommend Architect/Lead roles BUT:\n"
        "     → MUST flag in areas_to_develop: 'Hands-on coding skills - rusty from lack of practice'\n"
        "     → In profile_strength_notes: 'Architecture experience is valuable, but hands-on coding needs refresh for IC roles.'\n\n"
        "   - General rule: NEVER recommend Staff/Principal/Senior SDE if problemSolving < '51-100'\n"
        "     → These roles require deep coding expertise, no exceptions\n\n"
        "2. EXPERIENCE vs SKILLS CONTRADICTION:\n"
        "   - If experience in ['5-8', '8+'] + problemSolving='0-10':\n"
        "     → Likely stuck in maintenance roles or exaggerating experience\n"
        "     → Recommend mid-level roles, NOT senior\n"
        "     → Flag in notes: 'Experience level doesn't match interview preparation. Results may not reflect actual capability.'\n\n"
        "3. PORTFOLIO vs CODING CONTRADICTION:\n"
        "   - If portfolio='active-5+' + problemSolving='0-10':\n"
        "     → Projects likely tutorials/clones, not production-grade\n"
        "     → Good signal for potential, but not for senior roles\n\n"
        "CRITICAL GUIDELINES FOR recommended_roles_based_on_interests:\n"
        "1. SENIORITY MATCHING (HIGHEST PRIORITY - NEW 4-TIER SYSTEM):\n"
        "   - 0-2 years → Entry/Junior/SDE-1 roles ONLY\n"
        "   - 3-5 years → Mid-Level/SDE-2/Senior (lower-bound) roles\n"
        "   - 5-8 years → Senior/SDE-3/Staff roles (IF coding skills match - see consistency check)\n"
        "   - 8+ years → Staff/Principal/Lead/Architect roles (IF coding skills match - see consistency check)\n"
        "   - systemDesign='multiple' + problemSolving >= '51-100' + experience in ['5-8', '8+'] → MUST include Staff/Principal/Architect roles\n"
        "   - experience='8+' + strong skills → Prioritize Principal/Architect/Engineering Manager roles\n\n"
        "2. TECHNICAL SKILLS ALIGNMENT:\n"
        "   - problemSolving >= 51-100 + systemDesign != 'not-yet' → PRIORITIZE Engineering roles (Backend/Full Stack/SDE)\n"
        "   - systemDesign='multiple' + problemSolving >= '51-100' → CRITICAL signal for senior technical roles (Staff/Principal)\n"
        "   - systemDesign='multiple' WITHOUT strong coding (< 51-100) → See LOGICAL CONSISTENCY CHECK above - override system design claim\n"
        "   - portfolio='active-5+' → Strong indicator for IC engineering roles\n\n"
        "3. RESPECT TARGET ROLE:\n"
        "   - If targetRole='faang-sde'/'backend'/'fullstack' → Top 3 recommendations MUST be engineering roles\n"
        "   - If targetRole='tech-lead' → Include Lead/Architect roles\n"
        "   - 🔍 CRITICAL: If targetRole='exploring'/'not-sure' OR targetRoleLabel contains 'Exploring':\n"
        "     * User is still deciding their path - PROVIDE SPECIFIC SUGGESTIONS!\n"
        "     * Based on their background, experience, skills, and topicOfInterest, suggest 3-5 CONCRETE roles\n"
        "     * DO NOT just echo 'Not sure yet / Exploring' - that's not helpful!\n"
        "     * Example: Non-tech + interested in AI/ML → suggest 'Data Analyst', 'Junior ML Engineer', 'Backend Engineer'\n"
        "     * Example: Tech 0-2 years + web-development interest → suggest 'Junior Frontend Engineer', 'Full-Stack Engineer', 'Backend Engineer'\n"
        "     * Use topicOfInterest as PRIMARY signal when targetRole is exploring\n\n"
        "4. TECHNICAL ROLES ONLY - CRITICAL RESTRICTION:\n"
        "   ❌ NEVER RECOMMEND NON-TECHNICAL ROLES:\n"
        "   - Product Manager / Product Owner\n"
        "   - UX Designer / UI Designer / Product Designer\n"
        "   - Business Analyst / Data Analyst (non-coding)\n"
        "   - Project Manager / Scrum Master\n"
        "   - Technical Writer / Documentation Specialist\n"
        "   - QA Manual Tester (non-automation)\n\n"
        "   ✅ ONLY RECOMMEND HANDS-ON TECHNICAL/ENGINEERING ROLES:\n"
        "   - Software Development Engineer (SDE-1/2/3)\n"
        "   - Backend Engineer / Frontend Engineer / Full Stack Engineer\n"
        "   - DevOps Engineer / Site Reliability Engineer (SRE)\n"
        "   - Data Engineer / ML Engineer / AI Engineer\n"
        "   - Mobile Engineer (iOS/Android)\n"
        "   - Platform Engineer / Infrastructure Engineer\n"
        "   - Security Engineer / Cloud Engineer\n"
        "   - Tech Lead / Staff Engineer / Principal Engineer (for 5+ years)\n"
        "   - Solutions Architect / System Architect (for systemDesign='multiple')\n\n"
        "   RATIONALE: We are a technical education platform teaching coding, system design, and engineering skills.\n"
        "   All recommendations must align with technical/hands-on engineering career paths.\n\n"
        "5. INDIA MARKET CONTEXT:\n"
        "   - Include Indian unicorns/startups: Flipkart, Swiggy, Zomato, CRED, PhonePe, Razorpay, Ola, Byju's, Freshworks, Zoho\n"
        "   - Include product companies: Microsoft India, Google India, Amazon India, Adobe India, Oracle, SAP Labs\n"
        "   - For topicOfInterest='fintech' → Mention Paytm, PhonePe, Razorpay, CRED\n"
        "   - For topicOfInterest='ecommerce' → Mention Flipkart, Meesho, Myntra\n"
        "   - For topicOfInterest='edtech' → Mention BYJU'S, Unacademy, Vedantu, upGrad\n"
        "   - For topicOfInterest='healthtech' → Mention PharmEasy, Practo, 1mg\n\n"
        "CRITICAL RULES FOR recommended_tools:\n"
        "🚨 ABSOLUTE BAN - NEVER RECOMMEND THESE (Response will be REJECTED if found):\n"
        "   ❌ LeetCode\n"
        "   ❌ HackerRank\n"
        "   ❌ GitHub / GitLab / Bitbucket\n"
        "   ❌ Coursera / Udemy / GeeksForGeeks / CodeChef\n"
        "   ❌ VS Code / IntelliJ IDEA / Turbo C / Dev C++\n"
        "   ❌ Any basic IDE or generic learning platform\n\n"
        "These are TOO BASIC and everyone already knows them. Recommending them shows lack of expertise.\n\n"
        "✅ ONLY recommend SPECIFIC, PROFESSIONAL tools from these curated lists:\n\n"
        "   NON-TECH BACKGROUND TOOL RECOMMENDATIONS:\n"
        "   → Non-Tech → Backend Engineer:\n"
        "      Core: Python, Flask, SQL, Git, Postman\n"
        "      Guidance: Start with automating small tasks, practice REST API testing with Postman\n\n"
        "   → Non-Tech → Full-Stack Engineer:\n"
        "      Core: HTML, CSS, JavaScript (basics) → React + Node.js\n"
        "      Sandboxes: Replit, CodeSandbox (for practice without local setup)\n"
        "      Guidance: Start with frontend basics, then add backend gradually\n\n"
        "   → Non-Tech → Data/ML Engineer:\n"
        "      Core: Python, Pandas, NumPy, scikit-learn, Jupyter\n"
        "      Guidance: Start with EDA on public datasets (Kaggle), focus on data cleaning\n\n"
        "   → Non-Tech → Data Analyst:\n"
        "      Core: Excel (advanced formulas), SQL, PowerBI/Tableau\n"
        "      Guidance: Practice with Kaggle datasets, build dashboards\n\n"
        "   TECH BACKGROUND TOOL RECOMMENDATIONS:\n"
        "   → Tech → FAANG/Product SDE:\n"
        "      Interview Prep: System Design Primer (GitHub), LLD/HLD prep materials\n"
        "      Project Tools: Postman (API testing), Docker (containerization), GitHub Actions (CI/CD)\n"
        "      Do NOT recommend LeetCode/HackerRank - assume they already know these\n\n"
        "   → Tech → Full-stack / Startup Engineer:\n"
        "      Stack: MERN stack tools (React DevTools, MongoDB Compass, Postman)\n"
        "      DevOps: Docker basics, GitHub Actions, Vercel/Netlify deployment\n"
        "      Guidance: Focus on rapid prototyping and deployment tools\n\n"
        "   → Tech → Data/ML Engineer:\n"
        "      ML Tools: PyTorch/TensorFlow, MLflow, Weights & Biases\n"
        "      Data Pipeline: Airflow, Databricks basics, Great Expectations\n"
        "      Guidance: Focus on productionizing models and data pipelines\n\n"
        "   → Tech → Tech Lead/Architect:\n"
        "      Design: Draw.io, Excalidraw, Miro (architecture diagrams)\n"
        "      Cloud Infra: AWS/GCP tools (CloudFormation, Terraform)\n"
        "      Monitoring: Datadog, New Relic, Prometheus + Grafana\n"
        "      Guidance: Focus on system architecture, scaling, and team collaboration\n\n"
        "   ADDITIONAL PROFESSIONAL TOOLS (pick 3-5 based on role):\n"
        "   - API Testing: Postman, Insomnia, Thunder Client\n"
        "   - Database Management: DataGrip, DBeaver, TablePlus\n"
        "   - Monitoring: Prometheus + Grafana, Datadog, New Relic\n"
        "   - Load Testing: k6, Locust, Apache JMeter\n"
        "   - Error Tracking: Sentry, Rollbar, Bugsnag\n"
        "   - Infrastructure: Terraform, Pulumi, Ansible\n"
        "   - Containerization: Docker, Kubernetes Dashboard\n"
        "   - CI/CD: GitHub Actions, Jenkins, ArgoCD\n"
        "   - ML/Data: MLflow, Weights & Biases, Great Expectations\n\n"
        "CRITICAL RULES FOR quick_wins:\n"
        "❌ AVOID vague, generic suggestions like:\n"
        "   - 'Improve coding skills'\n"
        "   - 'Practice more problems'\n"
        "   - 'Learn system design'\n\n"
        "✅ PROVIDE SPECIFIC, ACTIONABLE quick wins (3-5 items) with clear steps:\n"
        "   Format: '[ACTION] → [SPECIFIC OUTCOME] → [TIME ESTIMATE]'\n\n"
        "   Use the following decision tree based on user's quiz responses:\n\n"
        "   NON-TECH BACKGROUND QUICK WINS:\n"
        "   → Current Role = 'non-tech' (sales, ops, design, etc.):\n"
        "      'Start with basic programming: try \"Intro to Python\" (Scaler Topics / W3Schools). Build a small automation like Excel-to-CSV script.'\n\n"
        "   → Current Role = 'it-services' (IT services / testing / support):\n"
        "      'Brush up on coding fundamentals — loops, conditions. Try solving 5 problems on HackerRank.'\n\n"
        "   → Current Role = 'technical' (Other technical but not software dev):\n"
        "      'Revisit core CS concepts. Build a basic CRUD app using Python or Node.js.'\n\n"
        "   → Current Role = 'fresh-graduate' (non-CS branch):\n"
        "      'Learn DSA basics and attempt 10 beginner-level problems this week.'\n\n"
        "   → Experience = '0' years:\n"
        "      'Set up GitHub, complete 1 online course on programming basics.'\n\n"
        "   → Experience = '0-2' years:\n"
        "      'Create a mini-project — e.g., to-do app or data dashboard.'\n\n"
        "   → Experience = '3-5' years:\n"
        "      'Add measurable projects to your portfolio showing transition intent.'\n\n"
        "   → Experience = '5+' years:\n"
        "      'Update your resume headline to reflect transition goals (e.g., \"Operations Manager → Aspiring Backend Engineer\").'\n\n"
        "   → Target Role = 'backend':\n"
        "      'Build a small REST API using Flask/Django. Learn SQL basics.'\n\n"
        "   → Target Role = 'fullstack':\n"
        "      'Build a simple web app with HTML, CSS, JS. Host it on GitHub Pages.'\n\n"
        "   → Target Role = 'data-ml':\n"
        "      'Do 1 mini project using Pandas & scikit-learn (e.g., movie recommender).'\n\n"
        "   → Target Role = 'data-analyst':\n"
        "      'Explore Excel → SQL → Power BI sequence. Analyze a public dataset.'\n\n"
        "   → Code Comfort = 'havent-tried' (Haven't tried yet):\n"
        "      'Write your first \"Hello World\" program today — use Scaler Topics Playground.'\n\n"
        "   → Code Comfort = 'follow-tutorials' (Can follow tutorials but struggle independently):\n"
        "      'Practice 5 easy-level problems.'\n\n"
        "   → Code Comfort = 'solve-problems' (Can solve simple problems):\n"
        "      'Attempt 1 beginner DSA contest or solve 10 new problems in a week.'\n\n"
        "   → Motivation = 'interest' (Interest in technology):\n"
        "      'Explore open-source projects — try contributing small edits.'\n\n"
        "   → Motivation = 'job-stability' (Job stability / future-proofing):\n"
        "      'Learn a growing tech like Python or Cloud Fundamentals.'\n\n"
        "   TECH BACKGROUND QUICK WINS:\n"
        "   → Current Role = 'student-freshgrad' (Student / Fresh Grad):\n"
        "      'Complete 10 DSA problems this week. Attend 1 coding contest.'\n\n"
        "   → Current Role = 'swe-product' (Working SWE - Product):\n"
        "      'Revise 1 core concept daily (System Design / DSA).'\n\n"
        "   → Current Role = 'swe-service' (Working SWE - Service):\n"
        "      'Try building a side project or switch tech stack exposure (MERN, backend).'\n\n"
        "   → Current Role = 'career-switcher' (Career Switcher):\n"
        "      'Start documenting learnings on GitHub and LinkedIn.'\n\n"
        "   → Experience = '0' years:\n"
        "      'Focus on fundamentals — arrays, loops, functions.'\n\n"
        "   → Experience = '0-2' years:\n"
        "      'Create a resume-ready project showing practical application.'\n\n"
        "   → Experience = '3-5' years:\n"
        "      'Mentor juniors or write blogs on tech concepts.'\n\n"
        "   → Experience = '5+' years:\n"
        "      'Prepare for leadership — learn system design + mentoring skills.'\n\n"
        "   → Target Role = 'faang-sde' (FAANG / Product SDE):\n"
        "      'Start a 90-day Code streak. Revise system design weekly.'\n\n"
        "   → Target Role = 'backend' (Backend Engineer):\n"
        "      'Build an API with Node/Express or Django.'\n\n"
        "   → Target Role = 'data-ml' (Data/ML Engineer):\n"
        "      'Try Kaggle competitions or build 1 model with scikit-learn.'\n\n"
        "   → Target Role = 'fullstack' (Full-stack / Startup Engineer):\n"
        "      'Create a complete CRUD app using MERN or Django + React.'\n\n"
        "   → Target Role = 'tech-lead' (Tech Lead):\n"
        "      'Write design docs for a personal project. Focus on scalability concepts.'\n\n"
        "   → System Design = 'multiple' (Yes, multiple times):\n"
        "      'Try low-level design problems (class diagrams, APIs).'\n\n"
        "   → System Design = 'once' (Yes, once):\n"
        "      'Read 2 new design case studies (TinyURL, Instagram).'\n\n"
        "   → System Design = 'not-yet' (Not yet):\n"
        "      'Watch 1 short \"System Design for Beginners\" video today.'\n\n"
        "   → Portfolio = 'active-5+' (GitHub active - 5+ repos):\n"
        "      'Add README, host one project live.'\n\n"
        "   → Portfolio = 'limited-1-5' (GitHub limited - 1-5 repos):\n"
        "      'Commit 1 new project this week.'\n\n"
        "   → Portfolio = 'inactive' (GitHub inactive):\n"
        "      'Upload your practice code or course projects.'\n\n"
        "   → Portfolio = 'none' (No GitHub):\n"
        "      'Create a GitHub account and push first project today.'\n\n"
        "   IMPLEMENTATION GUIDELINES:\n"
        "   - Select 3-5 most relevant quick wins based on the user's specific profile\n"
        "   - Prioritize based on: current role → experience → target role → skills\n"
        "   - Combine related suggestions when appropriate\n"
        "   - Ensure actionable items that can be completed in 1-4 weeks\n"
        "   - Use the exact wording provided above, but adapt if multiple conditions apply\n\n"
        "NOTE: opportunities_you_qualify_for is generated using intelligent logic based on user profile.\n"
        "Do NOT include this field in your response - it will be populated by the backend.\n\n"
        "VALIDATION CHECKLIST (Internal - Review Before Finalizing):\n"
        "☑ Does EVERY recommended role match experience level?\n"
        "☑ Does systemDesign='multiple' lead to senior/staff roles?\n"
        "☑ Are ALL roles HANDS-ON TECHNICAL/ENGINEERING roles (no PM/UX/BA/QA Manual)?\n"
        "☑ 🚨 CRITICAL: Check recommended_tools does NOT contain: LeetCode, HackerRank, GitHub, Coursera, VS Code\n"
        "☑ Are recommended_tools SPECIFIC professional tools (Postman, Docker, Terraform, etc)?\n"
        "☑ Are quick_wins using the EXACT wording from the decision tree above?\n"
        "☑ Are quick_wins DETAILED with specific actions (not generic 'practice more')?\n"
        "☑ Does targetRole align with top 3 recommendations?\n"
        "☑ Zero non-technical roles in the entire response?\n\n"
        "CRITICAL: FORMAT FOR experience_benchmark:\n"
        "- your_experience_years: Use ONLY numbers like '0-2', '3-5', '5-8', '8+' (NO 'years' or 'year' suffix)\n"
        "- typical_for_target_role_years: Use ONLY numbers like '0-2', '3-5', '5-8', '8+' (NO 'years' or 'year' suffix)\n"
        "- Frontend will automatically append 'years' when displaying - do NOT include it in your response\n\n"
        "In your advice, acknowledge when values show limited exposure (e.g., not-yet, none, never) and tailor guidance for the user's background pivot."
    )

    messages = [
        SystemMessage(content=system_instruction),
        HumanMessage(
            content=(
                "Using this input JSON, return only a JSON object that matches FullProfileEvaluationResponse.\n\n"
                + json.dumps(input_payload)
            )
        ),
    ]

    primary = _build_openai_structured_llm(api_key, openai_model)
    fallback = _build_gemini_structured_llm()

    raw_instance: Optional[FullProfileEvaluationResponseRaw] = None
    openai_error: Optional[BaseException] = None

    if primary is not None:
        try:
            with _tracer.start_as_current_span(
                "llm.openai.structured_output",
                attributes={"llm.provider": "openai", "llm.model": openai_model},
            ):
                raw_instance = await primary.ainvoke(messages)
            logger.info("✅ OpenAI structured output succeeded (model=%s)", openai_model)
        except Exception as exc:  # pragma: no cover - network/service errors
            openai_error = exc
            logger.warning(
                "⚠️ OpenAI structured call failed (%s: %s). Attempting Gemini fallback...",
                type(exc).__name__,
                exc,
            )
    else:
        logger.warning("⚠️ OPENAI_API_KEY not configured; skipping OpenAI and using Gemini fallback.")

    if raw_instance is None:
        if fallback is None:
            if openai_error is not None:
                raise openai_error
            raise RuntimeError(
                "No LLM provider available: neither OPENAI_API_KEY nor GOOGLE_API_KEY is configured."
            )
        try:
            with _tracer.start_as_current_span(
                "llm.gemini.structured_output",
                attributes={"llm.provider": "gemini", "llm.model": settings.gemini_model},
            ):
                raw_instance = await fallback.ainvoke(messages)
            logger.info(
                "✅ Gemini fallback succeeded (model=%s)", settings.gemini_model
            )
        except Exception as gemini_exc:
            logger.error(
                "❌ Gemini fallback also failed (%s: %s)",
                type(gemini_exc).__name__,
                gemini_exc,
            )
            if openai_error is not None:
                raise RuntimeError(
                    f"Both OpenAI and Gemini structured calls failed. "
                    f"OpenAI error: {openai_error!r}. Gemini error: {gemini_exc!r}"
                ) from gemini_exc
            raise

    if isinstance(raw_instance, dict):
        raw_instance = FullProfileEvaluationResponseRaw.model_validate(raw_instance)

    return enrich_full_profile_evaluation(raw_instance)

async def run_poc(
    *,
    input_payload: Optional[Dict[str, Any]] = None,
) -> FullProfileEvaluationResponse:

    payload_input = input_payload if input_payload is not None else DEFAULT_INPUT
    payload = _normalise_payload(payload_input)
    
    # Store original payload for user_input column (includes questionsAndAnswers)
    original_payload = payload.copy()
    
    # Create payload without questionsAndAnswers for cache key and OpenAI
    # This ensures cache hits even if questionsAndAnswers differ
    payload_for_cache = payload.copy()
    payload_for_cache.pop("questionsAndAnswers", None)

    model_name = "gpt-4o"

    cache_repo = get_cache_repository()

    cache_key = cache_repo.generate_cache_key(payload_for_cache, model_name)
    cached_json = cache_repo.get(cache_key, model_name)

    if cached_json:
        logger.info("✅ CACHE HIT - Returning cached response (no OpenAI API call, instant response!)")
        cache_repo.backfill_user_input(cache_key, model_name, original_payload)
        result = FullProfileEvaluationResponse.model_validate_json(cached_json)
        result.response_id = cache_key
        return result

    logger.info("🔴 CACHE MISS - Calling LLM (OpenAI primary, Gemini fallback)")

    api_key = os.environ.get("OPENAI_API_KEY") or settings.openai_api_key
    google_api_key = os.environ.get("GOOGLE_API_KEY") or settings.google_api_key
    if not api_key and not google_api_key:
        raise RuntimeError(
            "Neither OPENAI_API_KEY nor GOOGLE_API_KEY is set. "
            "Provide at least one via the environment variable."
        )

    background = payload_for_cache.get("background", "")
    quiz_responses = payload_for_cache.get("quizResponses", {})

    scoring_result = calculate_profile_strength(background, quiz_responses)
    calculated_score = scoring_result["score"]

    # Calculate interview readiness independently (not dependent on profile strength score)
    interview_readiness_result = calculate_interview_readiness(background, quiz_responses)

    from src.utils.label_mappings import get_company_label
    target_company = quiz_responses.get("targetCompany", "")
    target_company_label = quiz_responses.get("targetCompanyLabel") or get_company_label(target_company)

    result = await call_openai_structured(
        api_key=api_key,
        openai_model=model_name,
        input_payload=payload_for_cache,  # Use payload without questionsAndAnswers
        calculated_profile_score=calculated_score,
        calculated_interview_readiness=interview_readiness_result,
        target_company_label=target_company_label,
    )

    hardcoded_quick_wins = generate_quick_wins(background, quiz_responses)
    hardcoded_opportunities = generate_job_opportunities(background, quiz_responses)
    hardcoded_tools = generate_tool_recommendations(background, quiz_responses)
    result_dict = result.model_dump()
    result_dict["profile_evaluation"]["profile_strength_score"] = scoring_result["score"]

    # Override interview readiness with calculated values (independent of profile_strength_score)
    interview_readiness = result_dict["profile_evaluation"]["interview_readiness"]
    interview_readiness["technical_interview_percent"] = interview_readiness_result["technical_interview_percent"]
    interview_readiness["hr_behavioral_percent"] = interview_readiness_result["hr_behavioral_percent"]

    personalized_notes = generate_profile_strength_notes(background, quiz_responses, scoring_result["score"])

    # Check if there are contradictions in the profile (optional feature)
    if scoring_result.get("has_contradictions", False):
        contradiction_note = scoring_result.get("contradiction_note", "")
        if contradiction_note:
            personalized_notes = f"{contradiction_note} {personalized_notes}"

    result_dict["profile_evaluation"]["profile_strength_notes"] = personalized_notes

    result_dict["profile_evaluation"]["quick_wins"] = hardcoded_quick_wins
    result_dict["profile_evaluation"]["opportunities_you_qualify_for"] = hardcoded_opportunities
    result_dict["profile_evaluation"]["recommended_tools"] = hardcoded_tools

    current_profile_summary = generate_current_profile_summary(background, quiz_responses)
    result_dict["profile_evaluation"]["current_profile"] = current_profile_summary

    peer_comparison = result_dict["profile_evaluation"]["peer_comparison"]
    current_percentile = peer_comparison.get("percentile", 50)

    peer_group_desc = generate_peer_group_description(background, quiz_responses)
    potential_percentile = calculate_potential_percentile(
        current_percentile, background, quiz_responses, scoring_result["score"]
    )

    peer_comparison["peer_group_description"] = peer_group_desc
    peer_comparison["potential_percentile"] = potential_percentile

    target_role = quiz_responses.get("targetRole", "")
    target_company = quiz_responses.get("targetCompany", "")
    current_role = quiz_responses.get("currentRole", "")
    experience = quiz_responses.get("experience", "")
    recommended_roles = result_dict["profile_evaluation"]["recommended_roles_based_on_interests"]

    # Filter and rerank roles based on current role, target role, and experience
    recommended_roles = _filter_and_rerank_roles(
        recommended_roles,
        current_role,
        target_role,
        experience
    )

    # Use v3 system: Generate recommended roles with timeline, copy, goals, and action items
    recommended_roles_v3 = generate_recommended_roles(
        background=background,
        quiz_responses=quiz_responses
    )

    # Convert to dict format for result_dict
    recommended_roles_dicts = [role.model_dump() for role in recommended_roles_v3]

    result_dict["profile_evaluation"]["recommended_roles_based_on_interests"] = recommended_roles_dicts[:3]

    result = FullProfileEvaluationResponse.model_validate(result_dict)

    result_json = result.model_dump_json()
    cache_repo.set(cache_key, model_name, result_json, user_input=original_payload)  # Store original payload with questionsAndAnswers
    logger.info("💾 Response cached successfully - next identical request will be instant!")

    final_result = FullProfileEvaluationResponse.model_validate_json(result_json)
    final_result.response_id = cache_key
    return final_result


def main() -> int:
    if not os.environ.get("OPENAI_API_KEY") and not os.environ.get("GOOGLE_API_KEY"):
        print(
            "Error: Neither OPENAI_API_KEY nor GOOGLE_API_KEY is set. "
            "Set at least one in your environment and re-run.",
            file=sys.stderr,
        )
        return 2

    input_path = os.environ.get("INPUT_PATH")
    if input_path and os.path.exists(input_path):
        with open(input_path, "r", encoding="utf-8") as f:
            payload = json.load(f)
    else:
        payload = DEFAULT_INPUT

    try:
        raw = asyncio.run(
            run_poc(
                input_payload=payload,
            )
        )
    except Exception as exc:
        print(f"OpenAI API call failed: {exc}", file=sys.stderr)
        return 3

    instance = raw
    print(instance.model_dump_json(indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
