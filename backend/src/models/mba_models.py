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

    # Marketing
    marketing_conflicting_signals: Optional[str] = Field(None, alias="marketing-conflicting-signals")
    marketing_budget_shock: Optional[str] = Field(None, alias="marketing-budget-shock")
    marketing_ai_application: Optional[str] = Field(None, alias="marketing-ai-application")
    marketing_attribution_reality: Optional[str] = Field(None, alias="marketing-attribution-reality")
    marketing_scale_failure: Optional[str] = Field(None, alias="marketing-scale-failure")
    marketing_leadership_metric: Optional[str] = Field(None, alias="marketing-leadership-metric")

    # Operations
    operations_scale_stress: Optional[str] = Field(None, alias="operations-scale-stress")
    operations_cost_sla: Optional[str] = Field(None, alias="operations-cost-sla")
    operations_ai_leverage: Optional[str] = Field(None, alias="operations-ai-leverage")
    operations_ownership: Optional[str] = Field(None, alias="operations-ownership")
    operations_data_constraint: Optional[str] = Field(None, alias="operations-data-constraint")
    operations_strategic_role: Optional[str] = Field(None, alias="operations-strategic-role")

    # Founder
    founder_mvp_failure: Optional[str] = Field(None, alias="founder-mvp-failure")
    founder_ai_dependency: Optional[str] = Field(None, alias="founder-ai-dependency")
    founder_scale_pain: Optional[str] = Field(None, alias="founder-scale-pain")
    founder_resource_constraint: Optional[str] = Field(None, alias="founder-resource-constraint")
    founder_ai_advantage: Optional[str] = Field(None, alias="founder-ai-advantage")
    founder_failure_pattern: Optional[str] = Field(None, alias="founder-failure-pattern")

    # Tech/Engineering (0-3 years)
    tech_product_thinking: Optional[str] = Field(None, alias="tech-product-thinking")
    tech_business_impact: Optional[str] = Field(None, alias="tech-business-impact")
    tech_execution_accountability: Optional[str] = Field(None, alias="tech-execution-accountability")
    tech_prioritization: Optional[str] = Field(None, alias="tech-prioritization")
    tech_ai_literacy: Optional[str] = Field(None, alias="tech-ai-literacy")
    tech_ownership: Optional[str] = Field(None, alias="tech-ownership")

    # Tech/Engineering (3-8 years)
    tech_feature_roi: Optional[str] = Field(None, alias="tech-feature-roi")
    tech_cost_escalation: Optional[str] = Field(None, alias="tech-cost-escalation")
    tech_sales_product_conflict: Optional[str] = Field(None, alias="tech-sales-product-conflict")
    tech_debt_speed: Optional[str] = Field(None, alias="tech-debt-speed")
    tech_ai_investment: Optional[str] = Field(None, alias="tech-ai-investment")
    tech_resource_allocation: Optional[str] = Field(None, alias="tech-resource-allocation")

    # Tech/Engineering (8+ years)
    tech_strategic_tradeoff: Optional[str] = Field(None, alias="tech-strategic-tradeoff")
    tech_capital_allocation: Optional[str] = Field(None, alias="tech-capital-allocation")
    tech_competitive_advantage: Optional[str] = Field(None, alias="tech-competitive-advantage")
    tech_scalability: Optional[str] = Field(None, alias="tech-scalability")
    tech_ai_strategy: Optional[str] = Field(None, alias="tech-ai-strategy")
    tech_portfolio_balancing: Optional[str] = Field(None, alias="tech-portfolio-balancing")

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

