"""
MBA Skill Inference Engine
Maps quiz answers to skill levels across core business competencies

NEW APPROACH: Direct answer → score mapping
- Each answer gets a score (1-5) based on quality of thinking
- Skill levels calculated as average of all relevant question scores
- No more "default to 3" nonsense
"""
from typing import Dict, List, Any
from enum import Enum
from src.services.mba_skill_scoring_maps import QUESTION_SKILL_MAP, ANSWER_SCORES


class SkillCategory(str, Enum):
    """Core MBA skill categories"""
    BUSINESS_ACUMEN = "business_acumen"
    DATA_ANALYTICS = "data_analytics"
    AI_LITERACY = "ai_literacy"
    STRATEGIC_THINKING = "strategic_thinking"
    LEADERSHIP = "leadership"
    PROBLEM_SOLVING = "problem_solving"


SKILL_LEVEL_LABELS = {
    1: "Weak",
    2: "Needs Improvement",
    3: "Proficient"
}

# Map internal 1-5 scores to external 1-3 levels
# Nobody is an "Expert" - everyone has room for growth
def _map_score_to_level(score: int) -> int:
    """
    Map internal 1-5 scoring to simplified 1-3 levels:
    - 1-2 → Level 1 (Weak)
    - 3 → Level 2 (Needs Improvement)
    - 4-5 → Level 3 (Proficient)
    """
    if score <= 2:
        return 1
    elif score == 3:
        return 2
    else:  # 4-5
        return 3


# Role-specific skill maps (3 universal + 3 role-specific per role)
ROLE_SKILL_MAPS = {
    'pm': [
        'product_strategy', 'data_driven_pm', 'user_centricity',
        'ai_literacy', 'leadership', 'strategic_thinking', 'capital_allocation'
    ],
    'finance': [
        'financial_modeling', 'business_partnering', 'data_integrity',
        'ai_literacy', 'leadership', 'strategic_thinking'
    ],
    'sales': [
        'revenue_operations', 'deal_execution', 'sales_strategy',
        'ai_literacy', 'leadership', 'strategic_thinking'
    ],
    'marketing': [
        'growth_marketing', 'marketing_analytics', 'campaign_optimization',
        'ai_literacy', 'leadership', 'strategic_thinking'
    ],
    'operations': [
        'operations_excellence', 'supply_chain', 'process_automation',
        'ai_literacy', 'leadership', 'strategic_thinking'
    ],
    'founder': [
        'venture_building', 'business_fundamentals', 'founder_resourcefulness',
        'ai_literacy', 'leadership', 'strategic_thinking'
    ],
    'tech': [
        'product_thinking', 'business_impact_awareness', 'execution',
        'ai_literacy', 'leadership', 'strategic_thinking'
    ]
}


# Skill metadata for frontend display (21 total skills)
SKILL_METADATA = {
    # Universal Skills (3)
    'ai_literacy': {
        'title': 'AI Literacy',
        'description': 'Your proficiency in understanding and applying AI tools, from tactical automation to strategic decision-making.'
    },
    'leadership': {
        'title': 'Leadership',
        'description': 'Your ability to drive outcomes through teams, influence stakeholders, and take ownership of results.'
    },
    'strategic_thinking': {
        'title': 'Strategic Thinking',
        'description': 'Your capacity to see systems, connect long-term outcomes, and identify root causes beyond surface symptoms.'
    },

    # Product Manager Skills (3)
    'product_strategy': {
        'title': 'Product Strategy',
        'description': 'Your ability to define product vision, prioritize ruthlessly, and connect features to business outcomes.'
    },
    'data_driven_pm': {
        'title': 'Data-Driven PM',
        'description': 'Your skill in using metrics, cohort analysis, and experimentation to validate hypotheses and drive product decisions.'
    },
    'user_centricity': {
        'title': 'User Centricity',
        'description': 'Your commitment to understanding user problems deeply and solving for real pain points, not just feature requests.'
    },

    # Finance Skills (3)
    'financial_modeling': {
        'title': 'Financial Modeling',
        'description': 'Your expertise in building forecasts, scenario models, and financial plans that guide business decisions.'
    },
    'business_partnering': {
        'title': 'Business Partnering',
        'description': 'Your ability to translate financial insights into strategic recommendations that influence leadership decisions.'
    },
    'data_integrity': {
        'title': 'Data Integrity',
        'description': 'Your rigor in ensuring financial data accuracy, investigating anomalies, and building trust in the numbers.'
    },

    # Sales Skills (3)
    'revenue_operations': {
        'title': 'Revenue Operations',
        'description': 'Your skill in optimizing sales processes, forecasting accurately, and connecting sales motions to revenue outcomes.'
    },
    'deal_execution': {
        'title': 'Deal Execution',
        'description': 'Your ability to move deals forward, navigate blockers, and structure agreements that maximize value.'
    },
    'sales_strategy': {
        'title': 'Sales Strategy',
        'description': 'Your understanding of ICP fit, pricing optimization, and aligning sales motions with business strategy.'
    },

    # Marketing Skills (3)
    'growth_marketing': {
        'title': 'Growth Marketing',
        'description': 'Your ability to drive scalable acquisition, optimize conversion funnels, and connect marketing to revenue.'
    },
    'marketing_analytics': {
        'title': 'Marketing Analytics',
        'description': 'Your skill in measuring attribution, understanding cohort economics, and using data to optimize campaigns.'
    },
    'campaign_optimization': {
        'title': 'Campaign Optimization',
        'description': 'Your expertise in testing creatives, channels, and messaging to maximize ROI on marketing spend.'
    },

    # Operations Skills (3)
    'operations_excellence': {
        'title': 'Operations Excellence',
        'description': 'Your ability to build scalable processes, identify bottlenecks, and drive operational efficiency.'
    },
    'supply_chain': {
        'title': 'Supply Chain',
        'description': 'Your understanding of inventory management, logistics optimization, and managing operational constraints.'
    },
    'process_automation': {
        'title': 'Process Automation',
        'description': 'Your skill in identifying automation opportunities and leveraging AI tools to scale operations without headcount.'
    },

    # Founder Skills (3)
    'venture_building': {
        'title': 'Venture Building',
        'description': 'Your ability to identify opportunities, validate product-market fit, and build sustainable business models.'
    },
    'business_fundamentals': {
        'title': 'Business Fundamentals',
        'description': 'Your understanding of unit economics, pricing strategy, and the financial levers that drive profitable growth.'
    },
    'founder_resourcefulness': {
        'title': 'Founder Resourcefulness',
        'description': 'Your ability to move fast with limited resources, prioritize ruthlessly, and find creative solutions to constraints.'
    },

    # Tech/Engineering Skills (3)
    'product_thinking': {
        'title': 'Product Thinking',
        'description': 'Your ability to connect engineering work to user value, understand product impact, and think beyond code.'
    },
    'business_impact_awareness': {
        'title': 'Business Impact Awareness',
        'description': 'Your understanding of how technical decisions affect business outcomes, costs, and user experience.'
    },
    'execution': {
        'title': 'Execution & Accountability',
        'description': 'Your ability to deliver reliably, communicate trade-offs transparently, and take ownership of outcomes.'
    },
    'prioritization': {
        'title': 'Prioritization Thinking',
        'description': 'Your skill in balancing technical quality, business needs, and technical debt to maximize impact.'
    },
    'capital_allocation': {
        'title': 'Capital Allocation Thinking',
        'description': 'Your ability to allocate resources, budget, and time across products/initiatives based on ROI, strategic fit, and opportunity cost.'
    }
}


def infer_skills_from_responses(role: str, responses: Dict[str, Any]) -> Dict[str, Any]:
    """
    Infer role-specific skill levels based on quiz responses

    NEW APPROACH: Direct answer → score mapping
    - Each question tests one or more skills
    - Each answer gets a score (1-5)
    - Skill level = average of all relevant question scores
    - DEFAULT = 3 ONLY if no relevant questions were answered

    Returns:
        {
            'skills': {
                'product_strategy': {
                    'level': 3,
                    'label': 'Proficient',
                    'title': 'Product Strategy',
                    'description': '...'
                },
                ...
            },
            'strengths': ['skill1', 'skill2'],
            'gaps': ['skill3', 'skill4']
        }
    """
    # Get skill list for this role (fallback to 'pm' if role not found)
    skill_names = ROLE_SKILL_MAPS.get(role, ROLE_SKILL_MAPS['pm'])

    # Build reverse index: skill → [questions that test it]
    skill_to_questions = {skill: [] for skill in skill_names}
    for question_key, tested_skills in QUESTION_SKILL_MAP.items():
        for skill in tested_skills:
            if skill in skill_to_questions:
                skill_to_questions[skill].append(question_key)

    # Calculate skill levels
    skills = {}
    for skill_name in skill_names:
        # Find all questions that test this skill
        relevant_questions = skill_to_questions[skill_name]

        # Collect scores from answered questions
        scores = []
        for question_key in relevant_questions:
            user_answer = responses.get(question_key)
            if user_answer and question_key in ANSWER_SCORES:
                score = ANSWER_SCORES[question_key].get(user_answer)
                if score:
                    scores.append(score)

        # Calculate skill level
        if scores:
            # Average of all relevant question scores
            avg_score = sum(scores) / len(scores)
            internal_score = round(avg_score)  # Round to nearest integer (1-5)
            internal_score = max(1, min(5, internal_score))  # Clamp to 1-5

            # Map to simplified 3-level system
            level = _map_score_to_level(internal_score)
        else:
            # Default to 2 (Needs Improvement) ONLY if no relevant questions answered
            level = 2

        # Attach metadata for frontend
        metadata = SKILL_METADATA.get(skill_name, {})
        skills[skill_name] = {
            'level': level,
            'label': SKILL_LEVEL_LABELS[level],
            'title': metadata.get('title', skill_name.replace('_', ' ').title()),
            'description': metadata.get('description', '')
        }

    # Identify strengths (level >= 3 = Proficient) and gaps (level <= 1 = Weak)
    strengths = [name for name, data in skills.items() if data['level'] >= 3]
    gaps = [name for name, data in skills.items() if data['level'] <= 1]

    return {
        'skills': skills,
        'strengths': strengths,
        'gaps': gaps
    }


def get_skill_recommendations(gaps: List[str]) -> List[Dict[str, str]]:
    """Get learning recommendations for skill gaps"""
    recommendations = {
        SkillCategory.BUSINESS_ACUMEN: {
            'title': 'Business Acumen',
            'description': 'Understanding revenue models, unit economics, and P&L',
            'actions': ['Learn unit economics', 'Study business models', 'Practice P&L analysis']
        },
        SkillCategory.DATA_ANALYTICS: {
            'title': 'Data Analytics',
            'description': 'Using data to drive decisions and measure impact',
            'actions': ['Learn Excel/SQL', 'Study A/B testing', 'Master dashboards']
        },
        SkillCategory.AI_LITERACY: {
            'title': 'AI & Automation',
            'description': 'Leveraging AI tools for productivity and insights',
            'actions': ['Master ChatGPT', 'Learn AI prompting', 'Explore AI tools']
        },
        SkillCategory.STRATEGIC_THINKING: {
            'title': 'Strategic Thinking',
            'description': 'Systems view and long-term planning',
            'actions': ['Study frameworks', 'Practice case studies', 'Learn strategy']
        },
        SkillCategory.LEADERSHIP: {
            'title': 'Leadership & Influence',
            'description': 'Driving results through teams and stakeholders',
            'actions': ['Develop soft skills', 'Practice delegation', 'Learn negotiation']
        },
        SkillCategory.PROBLEM_SOLVING: {
            'title': 'Problem Solving',
            'description': 'Analytical and structured approach to challenges',
            'actions': ['Learn frameworks', 'Practice case interviews', 'Study root cause analysis']
        }
    }

    return [recommendations[gap] for gap in gaps if gap in recommendations]

