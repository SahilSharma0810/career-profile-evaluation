"""
Pydantic models for MBA Readiness API
"""
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field


class MBAQuizRequest(BaseModel):
    """Request model for MBA evaluation"""
    # Required fields
    role: str = Field(..., description="User's selected role (pm, finance, sales, marketing, operations, founder, tech)")
    experience: str = Field(..., description="Years of experience (0-2, 2-5, 5-8, 8-12, 12+)")
    career_goal: str = Field(..., description="Career goal (career-growth, skill-development, role-transition, entrepreneurship)")

    # Role-specific responses (all optional since different roles have different questions)
    # Product Manager - Experience-based questions
    # 0-3 years (Entry level)
    pm_e1: Optional[str] = Field(None, alias="pm-e1")  # Feature Adoption Drop
    pm_e2: Optional[str] = Field(None, alias="pm-e2")  # Problem Discovery
    pm_e3: Optional[str] = Field(None, alias="pm-e3")  # Prioritization Conflict
    pm_e4: Optional[str] = Field(None, alias="pm-e4")  # Success Measurement (Ownership)
    pm_e5: Optional[str] = Field(None, alias="pm-e5")  # AI in Workflow (AI Fluency)
    pm_e6: Optional[str] = Field(None, alias="pm-e6")  # Data vs User Emotion
    
    # 3-8 years (Mid level)
    pm_m1: Optional[str] = Field(None, alias="pm-m1")  # Growth vs Monetization Tradeoff
    pm_m2: Optional[str] = Field(None, alias="pm-m2")  # Cross-Functional Conflict
    pm_m3: Optional[str] = Field(None, alias="pm-m3")  # North Star Alignment (AI Fluency)
    pm_m4: Optional[str] = Field(None, alias="pm-m4")  # AI Feature Pressure (Ownership)
    pm_m5: Optional[str] = Field(None, alias="pm-m5")  # Retention Plateau
    pm_m6: Optional[str] = Field(None, alias="pm-m6")  # Failed Launch Reflection
    
    # 8+ years (Senior level)
    pm_s1: Optional[str] = Field(None, alias="pm-s1")  # Revenue Doubling Mandate (AI Fluency)
    pm_s2: Optional[str] = Field(None, alias="pm-s2")  # Portfolio Kill Decision
    pm_s3: Optional[str] = Field(None, alias="pm-s3")  # AI as Moat (Ownership)
    pm_s4: Optional[str] = Field(None, alias="pm-s4")  # Organizational Scale
    pm_s5: Optional[str] = Field(None, alias="pm-s5")  # Expansion vs Focus
    pm_s6: Optional[str] = Field(None, alias="pm-s6")  # Biggest Strategic Failure

    # Finance - 0-3 years (Entry level)
    fm_e1: Optional[str] = Field(None, alias="fm-e1")  # Revenue Forecast Variance
    fm_e2: Optional[str] = Field(None, alias="fm-e2")  # Sales Team Wants Higher Targets
    fm_e3: Optional[str] = Field(None, alias="fm-e3")  # Data Discrepancy
    fm_e4: Optional[str] = Field(None, alias="fm-e4")  # Automating Reporting (AI Fluency)
    fm_e5: Optional[str] = Field(None, alias="fm-e5")  # Budget Cuts Required
    fm_e6: Optional[str] = Field(None, alias="fm-e6")  # Cross-functional Planning Meeting (Ownership)
    
    # Finance - 3-8 years (Mid level)
    fm_m1: Optional[str] = Field(None, alias="fm-m1")  # Building a 3-Year Financial Model
    fm_m2: Optional[str] = Field(None, alias="fm-m2")  # Partnering with Product Team
    fm_m3: Optional[str] = Field(None, alias="fm-m3")  # Forecasting in Uncertainty
    fm_m4: Optional[str] = Field(None, alias="fm-m4")  # Ensuring Data Reliability
    fm_m5: Optional[str] = Field(None, alias="fm-m5")  # Leveraging AI in Finance (AI Fluency)
    fm_m6: Optional[str] = Field(None, alias="fm-m6")  # Influencing Senior Leaders (Ownership)
    
    # Finance - 8+ years (Senior level)
    fm_s1: Optional[str] = Field(None, alias="fm-s1")  # Capital Allocation Decision
    fm_s2: Optional[str] = Field(None, alias="fm-s2")  # M&A Evaluation
    fm_s3: Optional[str] = Field(None, alias="fm-s3")  # Leading Finance Transformation (AI Fluency)
    fm_s4: Optional[str] = Field(None, alias="fm-s4")  # Managing Board-Level Reporting (Ownership)
    fm_s5: Optional[str] = Field(None, alias="fm-s5")  # Enterprise Risk Exposure
    fm_s6: Optional[str] = Field(None, alias="fm-s6")  # Building High-Performance Finance Team

    # Sales - 0-3 years (Entry level)
    sm_e1: Optional[str] = Field(None, alias="sm-e1")  # CRM Data Is Inconsistent
    sm_e2: Optional[str] = Field(None, alias="sm-e2")  # A Large Deal Is Stuck
    sm_e3: Optional[str] = Field(None, alias="sm-e3")  # Monthly Target Missed
    sm_e4: Optional[str] = Field(None, alias="sm-e4")  # Repetitive Manual Reporting (AI Fluency)
    sm_e5: Optional[str] = Field(None, alias="sm-e5")  # Pricing Pushback (Ownership)
    sm_e6: Optional[str] = Field(None, alias="sm-e6")  # Cross-Team Alignment
    
    # Sales - 3-8 years (Mid level)
    sm_m1: Optional[str] = Field(None, alias="sm-m1")  # Scaling Revenue Predictability
    sm_m2: Optional[str] = Field(None, alias="sm-m2")  # Complex Enterprise Deal
    sm_m3: Optional[str] = Field(None, alias="sm-m3")  # Entering a New Segment
    sm_m4: Optional[str] = Field(None, alias="sm-m4")  # AI in Prospecting (AI Fluency)
    sm_m5: Optional[str] = Field(None, alias="sm-m5")  # Declining Win Rate (Ownership)
    sm_m6: Optional[str] = Field(None, alias="sm-m6")  # Managing Sales Team Performance
    
    # Sales - 8+ years (Senior level)
    sm_s1: Optional[str] = Field(None, alias="sm-s1")  # Long-Term Revenue Strategy
    sm_s2: Optional[str] = Field(None, alias="sm-s2")  # Portfolio Revenue Allocation
    sm_s3: Optional[str] = Field(None, alias="sm-s3")  # Enterprise Risk Exposure
    sm_s4: Optional[str] = Field(None, alias="sm-s4")  # AI-Driven Sales Transformation (AI Fluency)
    sm_s5: Optional[str] = Field(None, alias="sm-s5")  # Board-Level Revenue Forecast (Ownership)
    sm_s6: Optional[str] = Field(None, alias="sm-s6")  # Building High-Performance Revenue Org

    # Marketing - 0-3 years (Entry level)
    mm_e1: Optional[str] = Field(None, alias="mm-e1")  # Campaign CAC Suddenly Increases
    mm_e2: Optional[str] = Field(None, alias="mm-e2")  # Low Conversion Landing Page
    mm_e3: Optional[str] = Field(None, alias="mm-e3")  # Planning a New Growth Campaign
    mm_e4: Optional[str] = Field(None, alias="mm-e4")  # Manual Performance Reporting (AI Fluency)
    mm_e5: Optional[str] = Field(None, alias="mm-e5")  # Brand vs Performance Debate
    mm_e6: Optional[str] = Field(None, alias="mm-e6")  # Marketing-Sales Misalignment (Ownership)
    
    # Marketing - 3-8 years (Mid level)
    mm_m1: Optional[str] = Field(None, alias="mm-m1")  # Scaling Growth Efficiently
    mm_m2: Optional[str] = Field(None, alias="mm-m2")  # Multi-Channel Attribution Challenge
    mm_m3: Optional[str] = Field(None, alias="mm-m3")  # Launching a New Market Segment
    mm_m4: Optional[str] = Field(None, alias="mm-m4")  # AI in Creative Optimization (AI Fluency)
    mm_m5: Optional[str] = Field(None, alias="mm-m5")  # Campaign Underperformance
    mm_m6: Optional[str] = Field(None, alias="mm-m6")  # Leading a Performance Team (Ownership)
    
    # Marketing - 8+ years (Senior level)
    mm_s1: Optional[str] = Field(None, alias="mm-s1")  # Long-Term Brand vs Performance Balance
    mm_s2: Optional[str] = Field(None, alias="mm-s2")  # Portfolio Channel Allocation
    mm_s3: Optional[str] = Field(None, alias="mm-s3")  # Enterprise-Level Attribution Redesign
    mm_s4: Optional[str] = Field(None, alias="mm-s4")  # AI-Led Marketing Transformation (AI Fluency)
    mm_s5: Optional[str] = Field(None, alias="mm-s5")  # Entering New Geography
    mm_s6: Optional[str] = Field(None, alias="mm-s6")  # Building a High-Performance Marketing Org (Ownership)

    # Operations - 0-3 years (Entry level)
    om_e1: Optional[str] = Field(None, alias="om-e1")  # Order Fulfillment Delays
    om_e2: Optional[str] = Field(None, alias="om-e2")  # Inventory Mismatch
    om_e3: Optional[str] = Field(None, alias="om-e3")  # Repetitive Manual Reporting
    om_e4: Optional[str] = Field(None, alias="om-e4")  # Vendor Delays
    om_e5: Optional[str] = Field(None, alias="om-e5")  # Using AI in Operations (AI Fluency)
    om_e6: Optional[str] = Field(None, alias="om-e6")  # Cross-Team Process Breakdown (Ownership)
    
    # Operations - 3-8 years (Mid level)
    om_m1: Optional[str] = Field(None, alias="om-m1")  # Rising Operational Costs
    om_m2: Optional[str] = Field(None, alias="om-m2")  # Supply Chain Disruption
    om_m3: Optional[str] = Field(None, alias="om-m3")  # Scaling Operations
    om_m4: Optional[str] = Field(None, alias="om-m4")  # Automation Opportunity (AI Fluency)
    om_m5: Optional[str] = Field(None, alias="om-m5")  # Data-Driven Decision Making
    om_m6: Optional[str] = Field(None, alias="om-m6")  # Managing Cross-Functional Execution (Ownership)
    
    # Operations - 8+ years (Senior level)
    om_s1: Optional[str] = Field(None, alias="om-s1")  # Long-Term Operations Strategy
    om_s2: Optional[str] = Field(None, alias="om-s2")  # Supply Chain Risk Concentration
    om_s3: Optional[str] = Field(None, alias="om-s3")  # Enterprise Automation Roadmap (AI Fluency)
    om_s4: Optional[str] = Field(None, alias="om-s4")  # Board-Level Performance Challenge (Ownership)
    om_s5: Optional[str] = Field(None, alias="om-s5")  # Expansion into New Geography
    om_s6: Optional[str] = Field(None, alias="om-s6")  # Building High-Performance Ops Team

    # Founder - 0-3 years (Entry level)
    sf_e1: Optional[str] = Field(None, alias="sf-e1")  # Validating a Startup Idea
    sf_e2: Optional[str] = Field(None, alias="sf-e2")  # Early Revenue Challenge
    sf_e3: Optional[str] = Field(None, alias="sf-e3")  # Limited Budget, Big Goals
    sf_e4: Optional[str] = Field(None, alias="sf-e4")  # Wearing Multiple Hats
    sf_e5: Optional[str] = Field(None, alias="sf-e5")  # Using AI in Early Startup (AI Fluency)
    sf_e6: Optional[str] = Field(None, alias="sf-e6")  # Co-Founder Conflict (Ownership)
    
    # Founder - 3-8 years (Mid level)
    sf_m1: Optional[str] = Field(None, alias="sf-m1")  # Scaling After Product-Market Fit
    sf_m2: Optional[str] = Field(None, alias="sf-m2")  # Unit Economics Under Pressure
    sf_m3: Optional[str] = Field(None, alias="sf-m3")  # Hiring Leadership Team (Ownership)
    sf_m4: Optional[str] = Field(None, alias="sf-m4")  # Competitive Pressure
    sf_m5: Optional[str] = Field(None, alias="sf-m5")  # Leveraging AI for Scale (AI Fluency)
    sf_m6: Optional[str] = Field(None, alias="sf-m6")  # Investor Alignment
    
    # Founder - 8+ years (Senior level)
    sf_s1: Optional[str] = Field(None, alias="sf-s1")  # Building Multi-Product Portfolio
    sf_s2: Optional[str] = Field(None, alias="sf-s2")  # Long-Term Vision Recalibration
    sf_s3: Optional[str] = Field(None, alias="sf-s3")  # Enterprise Governance & Scale (Ownership)
    sf_s4: Optional[str] = Field(None, alias="sf-s4")  # Capital Allocation Discipline
    sf_s5: Optional[str] = Field(None, alias="sf-s5")  # AI-Driven Business Reinvention (AI Fluency)
    sf_s6: Optional[str] = Field(None, alias="sf-s6")  # Founder Legacy & Culture

    # Tech/Engineering (0-3 years)
    tm_e1: Optional[str] = Field(None, alias="tm-e1")  # Product Thinking
    tm_e2: Optional[str] = Field(None, alias="tm-e2")  # Business Impact Awareness
    tm_e3: Optional[str] = Field(None, alias="tm-e3")  # Execution & Accountability
    tm_e4: Optional[str] = Field(None, alias="tm-e4")  # Prioritization Thinking
    tm_e5: Optional[str] = Field(None, alias="tm-e5")  # AI Literacy (Business Context) - Used for AI Fluency
    tm_e6: Optional[str] = Field(None, alias="tm-e6")  # Ownership Mindset - Used for Ownership

    # Tech/Engineering (3-8 years)
    tm_m1: Optional[str] = Field(None, alias="tm-m1")  # Feature ROI Evaluation
    tm_m2: Optional[str] = Field(None, alias="tm-m2")  # Cost Escalation
    tm_m3: Optional[str] = Field(None, alias="tm-m3")  # Sales vs Product Conflict
    tm_m4: Optional[str] = Field(None, alias="tm-m4")  # Tech Debt vs Speed - Used for Ownership
    tm_m5: Optional[str] = Field(None, alias="tm-m5")  # AI Investment Decision - Used for AI Fluency
    tm_m6: Optional[str] = Field(None, alias="tm-m6")  # Resource Allocation

    # Tech/Engineering (8+ years)
    tm_s1: Optional[str] = Field(None, alias="tm-s1")  # Strategic Trade-off
    tm_s2: Optional[str] = Field(None, alias="tm-s2")  # Capital Allocation
    tm_s3: Optional[str] = Field(None, alias="tm-s3")  # Engineering as Competitive Advantage
    tm_s4: Optional[str] = Field(None, alias="tm-s4")  # Long-Term Scalability - Used for Ownership
    tm_s5: Optional[str] = Field(None, alias="tm-s5")  # AI as Strategy - Used for AI Fluency
    tm_s6: Optional[str] = Field(None, alias="tm-s6")  # Portfolio Balancing

    class Config:
        populate_by_name = True  # Allow both alias and field name


class CategoryScore(BaseModel):
    """Category breakdown of readiness score"""
    experience: int
    role_maturity: int
    ai_fluency: int
    ownership: int


class ReadinessScore(BaseModel):
    """MBA Readiness Score"""
    overall_score: int = Field(..., ge=0, le=100)
    category_scores: CategoryScore
    maturity_level: str
    percentile: int
    readiness_tags: List[str]


class SkillLevel(BaseModel):
    """Individual skill level (simplified 3-level system)"""
    level: int = Field(..., ge=1, le=3)
    label: str
    title: str = ""  # Display name for frontend
    description: str = ""  # Tooltip text for frontend


class SkillsAnalysis(BaseModel):
    """Skills analysis"""
    skills: Dict[str, SkillLevel]
    strengths: List[str]
    gaps: List[str]


class QuickWin(BaseModel):
    """Single quick win action item"""
    title: str
    description: str
    impact: str
    timeframe: str


class AITool(BaseModel):
    """AI tool recommendation"""
    name: str
    category: str
    use_case: str
    impact: str
    priority: str
    url: Optional[str] = None


class IndustryStat(BaseModel):
    """Industry statistic"""
    stat: str
    description: str
    source: str
    impact: str


class TransformationInsight(BaseModel):
    """Industry transformation insight"""
    title: str
    description: str
    example: str
    takeaway: str


class PeerComparison(BaseModel):
    """Peer comparison data"""
    percentile: int
    message: str
    comparison_text: str
    badge: str
    cohort_size: str


class MetaData(BaseModel):
    """Evaluation metadata"""
    role: str
    experience: str
    career_goal: str


class PersonaInfo(BaseModel):
    """Role-based persona information"""
    persona_id: str
    persona_label: str
    role_context: str
    maturity_variant: str
    badge_label: str
    variant_description: str
    persona_tags: List[str]
    key_strengths: List[str]
    mba_fit: str
    ideal_profile: str = ""


class OpenAIQuickWin(BaseModel):
    """OpenAI-generated personalized quick win"""
    title: str
    description: str
    impact: str
    timeframe: str
    reasoning: str  # Why this matters for this user


class OpenAITransformationStory(BaseModel):
    """OpenAI-generated transformation story"""
    company: str
    industry: str
    transformation_narrative: str
    relevance_to_user: str
    skill_connection: List[str]


class OpenAIToolDescription(BaseModel):
    """OpenAI-generated personalized tool description"""
    name: str
    category: str
    priority: str
    personalized_use_case: str
    personalized_impact: str
    learning_path: str


class OpenAIContent(BaseModel):
    """Container for all OpenAI-generated content"""
    quick_wins: List[OpenAIQuickWin]
    transformation_stories: List[OpenAITransformationStory]
    tool_descriptions: List[OpenAIToolDescription]
    generation_metadata: Dict[str, Any]


class CareerTransition(BaseModel):
    """Career transition/journey recommendation"""
    title: str = Field(..., description="Target role title")
    description: str = Field(..., description="Brief role description")
    action_items: List[str] = Field(..., description="Milestones/steps to achieve this role")
    card_type: str = Field(..., description="'target' for recommended, 'alternate' for alternative paths")
    timeline: Optional[str] = Field(None, description="Timeline to achieve (e.g., '6-12 months')")
    salary: Optional[str] = Field(None, description="Salary range (e.g., '$120k-$180k')")
    goal: Optional[str] = Field(None, description="Career goal for this role")
    key_focus: Optional[str] = Field(None, description="Main focus area")


class MBAEvaluationResponse(BaseModel):
    """Complete MBA evaluation response"""
    readiness: ReadinessScore
    persona: PersonaInfo  # NEW: Role-based persona information
    skills: SkillsAnalysis
    quick_wins: List[QuickWin]
    ai_tools: List[AITool]
    industry_stats: List[IndustryStat]
    transformation_insights: List[TransformationInsight]
    peer_comparison: PeerComparison
    career_transitions: List[CareerTransition]  # NEW: Career journey recommendations
    openai_content: Optional[OpenAIContent] = None  # NEW: OpenAI-generated personalized content
    cache_status: Optional[str] = None  # NEW: 'mock' | 'hit' | 'miss' | 'disabled'
    meta: MetaData

