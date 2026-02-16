"""
MBA Skill Scoring Maps
Direct answer → score mappings for all quiz questions

Each answer gets a score (1-5):
- 5 = Expert-level thinking
- 4 = Advanced understanding
- 3 = Proficient/competent
- 2 = Developing/basic
- 1 = Beginner/surface-level

Each question maps to one or more skills
"""
from typing import Dict, List

# ============================================================================
# QUESTION → SKILL MAPPINGS
# Defines which skills each question tests
# ============================================================================

QUESTION_SKILL_MAP = {
    # Product Manager Questions - 0-3 years (Entry level)
    'pm-e1': ['data_driven_pm'],  # Feature Adoption Drop
    'pm-e2': ['user_centricity'],  # Problem Discovery
    'pm-e3': ['data_driven_pm'],  # Prioritization Conflict
    'pm-e4': ['strategic_thinking'],  # Success Measurement (Ownership)
    'pm-e5': ['ai_literacy'],  # AI in Workflow (AI Fluency)
    'pm-e6': ['strategic_thinking'],  # Data vs User Emotion
    
    # Product Manager Questions - 3-8 years (Mid level)
    'pm-m1': ['product_strategy'],  # Growth vs Monetization Tradeoff
    'pm-m2': ['leadership'],  # Cross-Functional Conflict
    'pm-m3': ['strategic_thinking'],  # North Star Alignment (AI Fluency)
    'pm-m4': ['ai_literacy'],  # AI Feature Pressure (Ownership)
    'pm-m5': ['data_driven_pm'],  # Retention Plateau
    'pm-m6': ['product_strategy'],  # Failed Launch Reflection
    
    # Product Manager Questions - 8+ years (Senior level)
    'pm-s1': ['product_strategy'],  # Revenue Doubling Mandate (AI Fluency)
    'pm-s2': ['capital_allocation'],  # Portfolio Kill Decision
    'pm-s3': ['ai_literacy'],  # AI as Moat (Ownership)
    'pm-s4': ['leadership'],  # Organizational Scale
    'pm-s5': ['strategic_thinking'],  # Expansion vs Focus
    'pm-s6': ['strategic_thinking'],  # Biggest Strategic Failure

    # Finance Questions
    'finance-metrics-conflict': ['business_partnering', 'data_integrity', 'leadership'],
    'finance-forecast-miss': ['financial_modeling', 'data_integrity'],
    'finance-decision-speed': ['data_integrity', 'strategic_thinking'],
    'finance-ai-application': ['ai_literacy'],
    'finance-leadership-weight': ['business_partnering', 'leadership'],
    'finance-impact-type': ['financial_modeling', 'strategic_thinking'],

    # Sales Questions
    'sales-pipeline-reality': ['revenue_operations', 'strategic_thinking'],
    'sales-deal-stuck': ['deal_execution', 'strategic_thinking'],
    'sales-ai-usage': ['ai_literacy'],
    'sales-target-miss': ['sales_strategy', 'strategic_thinking'],
    'sales-forecasting': ['revenue_operations', 'data_driven_pm'],  # Using data_driven as proxy
    'sales-ownership': ['leadership', 'sales_strategy'],

    # Marketing Questions
    'marketing-conflicting-signals': ['growth_marketing', 'marketing_analytics', 'strategic_thinking'],
    'marketing-budget-shock': ['campaign_optimization', 'strategic_thinking'],
    'marketing-ai-application': ['ai_literacy'],
    'marketing-attribution-reality': ['marketing_analytics', 'strategic_thinking'],
    'marketing-scale-failure': ['growth_marketing', 'strategic_thinking'],
    'marketing-defend-metric': ['leadership', 'growth_marketing'],

    # Operations Questions
    'operations-scale-stress': ['operations_excellence', 'supply_chain', 'strategic_thinking'],
    'operations-cost-sla': ['operations_excellence', 'process_automation'],
    'operations-ai-leverage': ['ai_literacy', 'process_automation'],
    'operations-metric-priority': ['leadership', 'operations_excellence'],
    'operations-data-constraint': ['strategic_thinking', 'operations_excellence'],
    'operations-purpose': ['leadership', 'strategic_thinking'],

    # Founder Questions
    'founder-mvp-failure': ['venture_building', 'user_centricity'],  # Using user_centricity as proxy
    'founder-ai-dependency': ['ai_literacy', 'founder_resourcefulness'],
    'founder-scale-pain': ['business_fundamentals', 'strategic_thinking'],
    'founder-resource-constraint': ['founder_resourcefulness', 'business_fundamentals'],
    'founder-ai-advantage': ['ai_literacy', 'strategic_thinking'],
    'founder-failure-pattern': ['leadership', 'venture_building'],

    # Tech/Engineering Questions (0-3 years)
    'tech-product-thinking': ['product_thinking', 'ownership'],
    'tech-business-impact': ['business_impact_awareness', 'strategic_thinking'],
    'tech-execution-accountability': ['execution', 'accountability'],
    'tech-prioritization': ['prioritization', 'business_impact_awareness'],
    'tech-ai-literacy': ['ai_literacy'],
    'tech-ownership': ['ownership', 'leadership'],

    # Tech/Engineering Questions (3-8 years)
    'tech-feature-roi': ['product_thinking', 'strategic_thinking'],
    'tech-cost-escalation': ['business_impact_awareness', 'strategic_thinking'],
    'tech-sales-product-conflict': ['leadership', 'business_partnering'],
    'tech-debt-speed': ['strategic_thinking', 'prioritization'],
    'tech-ai-investment': ['ai_literacy', 'strategic_thinking'],
    'tech-resource-allocation': ['strategic_thinking', 'capital_allocation'],

    # Tech/Engineering Questions (8+ years)
    'tech-strategic-tradeoff': ['strategic_thinking', 'capital_allocation'],
    'tech-capital-allocation': ['capital_allocation', 'strategic_thinking'],
    'tech-competitive-advantage': ['strategic_thinking', 'product_thinking'],
    'tech-scalability': ['strategic_thinking', 'product_thinking'],
    'tech-ai-strategy': ['ai_literacy', 'strategic_thinking'],
    'tech-portfolio-balancing': ['strategic_thinking', 'capital_allocation']
}


# ============================================================================
# ANSWER → SCORE MAPPINGS
# Each answer choice mapped to a 1-5 score
# ============================================================================

ANSWER_SCORES = {
    # -------------------- PRODUCT MANAGER - 0-3 YEARS (ENTRY) --------------------
    
    'pm-e1': {  # Feature Adoption Drop - Data Driven PM
        'add-nudges': 2,  # B → 5, C → 3, A → 2, D → 1
        'break-down-funnel': 5,  # Best: Data-driven analysis
        'ask-support': 3,  # Good: Qualitative input
        'roll-back': 1  # Worst: Reactive without analysis
    },
    
    'pm-e2': {  # Problem Discovery - User Centricity
        'add-to-sprint': 1,  # B → 5, C → 3, D → 2, A → 1
        'interview-churned': 5,  # Best: User-centric validation
        'ship-lightweight': 3,  # Good: Test-driven approach
        'benchmark-competitors': 2  # Okay: External validation
    },
    
    'pm-e3': {  # Prioritization Conflict - Data Driven PM
        'choose-enterprise': 2,  # B → 4, D → 3, A → 2, C → 1
        'scoring-framework': 4,  # Best: Structured approach
        'ask-leadership': 1,  # Worst: No ownership
        'pick-retention': 3  # Good: Growth-focused
    },
    
    'pm-e4': {  # Success Measurement - Strategic Thinking (Ownership)
        'feature-successful': 2,  # B → 3, A → 2, C → 2, D → 1
        'cohort-analysis': 3,  # Best: Deeper analysis
        'increase-marketing': 2,  # Same as A
        'add-more-features': 1  # Worst: Feature factory
    },
    
    'pm-e5': {  # AI in Workflow - AI Literacy (AI Fluency)
        'auto-summarize': 3,  # A → 3, B → 3, C → 2, D → 1
        'generate-prd': 3,  # Same as A
        'respond-stakeholders': 2,  # Good: Practical use
        'not-use-ai': 1  # Worst: No AI adoption
    },
    
    'pm-e6': {  # Data vs User Emotion - Strategic Thinking
        'ignore-interviews': 1,  # B → 4, C → 3, D → 2, A → 1
        'segment-analyze': 4,  # Best: Synthesize both
        'redesign-immediately': 3,  # Good: Action-oriented
        'wait-month': 2  # Okay: Cautious
    },
    
    # -------------------- PRODUCT MANAGER - 3-8 YEARS (MID) --------------------
    
    'pm-m1': {  # Growth vs Monetization Tradeoff - Product Strategy
        'implement-monetization': 1,  # B → 4, C → 3, D → 2, A → 1
        'ltv-analysis': 4,  # Best: Data-driven decision
        'upsell-power-users': 3,  # Good: Targeted approach
        'delay-monetization': 2  # Okay: Growth-focused
    },
    
    'pm-m2': {  # Cross-Functional Conflict - Leadership
        'prioritize-enterprise': 2,  # C → 2, A → 2, B → 1, D → 1
        'prioritize-refactor': 1,  # Single-sided
        'quantify-phased': 2,  # Best: Balanced approach
        'escalate-leadership': 1  # Worst: No ownership
    },
    
    'pm-m3': {  # North Star Alignment - Strategic Thinking (AI Fluency)
        'standardize-reporting': 3,  # B → 3, A → 3, D → 2, C → 1
        'north-star-metric': 3,  # Best: Strategic alignment
        'teams-optimize': 1,  # Worst: Fragmented
        'add-dashboards': 2  # Okay: More visibility
    },
    
    'pm-m4': {  # AI Feature Pressure - AI Literacy (Ownership)
        'build-wrapper': 2,  # B → 3, D → 3, A → 2, C → 1
        'test-workflow': 3,  # Best: Validate value
        'announce-roadmap': 1,  # Worst: No delivery
        'push-back': 3  # Good: Strategic pushback
    },
    
    'pm-m5': {  # Retention Plateau - Data Driven PM
        'add-engagement': 3,  # B → 5, A → 3, C → 2, D → 1
        'churned-analysis': 5,  # Best: Data-driven root cause
        'increase-push': 2,  # Okay: Tactical
        'offer-discounts': 1  # Worst: Short-term fix
    },
    
    'pm-m6': {  # Failed Launch Reflection - Product Strategy
        'weak-discovery': 4,  # A → 4, D → 2, B → 1, C → 1
        'poor-marketing': 1,  # Execution issue
        'engineering-delays': 1,  # Execution issue
        'competitive-timing': 2  # External factor
    },
    
    # -------------------- PRODUCT MANAGER - 8+ YEARS (SENIOR) --------------------
    
    'pm-s1': {  # Revenue Doubling Mandate - Product Strategy (AI Fluency)
        'increase-pricing': 3,  # B → 4, A → 3, D → 2, C → 1
        'identify-ltv-icp': 4,  # Best: Strategic focus
        'launch-features': 1,  # Worst: Feature factory
        'expand-marketing': 2  # Okay: Growth lever
    },
    
    'pm-s2': {  # Portfolio Kill Decision - Capital Allocation Thinking
        'continue-engagement': 1,  # C → 2, B → 2, A → 1, D → 1
        'improve-monetization': 2,  # Good: Fix margin
        'reevaluate-fit': 2,  # Best: Strategic thinking
        'shut-down': 1  # Reactive
    },
    
    'pm-s3': {  # AI as Moat - AI Literacy (Ownership)
        'better-ux': 3,  # C → 4, A → 3, B → 2, D → 1
        'faster-releases': 2,  # Tactical advantage
        'proprietary-data': 4,  # Best: Strategic moat
        'larger-model': 1  # Worst: Wrong understanding
    },
    
    'pm-s4': {  # Organizational Scale - Leadership
        'more-meetings': 3,  # B → 3, A → 3, D → 2, C → 1
        'lack-ownership': 3,  # Best: Root cause
        'slower-engineers': 1,  # Wrong diagnosis
        'poor-tooling': 2  # Contributing factor
    },
    
    'pm-s5': {  # Expansion vs Focus - Strategic Thinking
        'tam-size': 3,  # B → 4, A → 3, D → 2, C → 1
        'core-competency': 4,  # Best: Strategic advantage
        'investor-pressure': 1,  # Worst: External driver
        'trend-momentum': 2  # Okay: Market-driven
    },
    
    'pm-s6': {  # Biggest Strategic Failure - Strategic Thinking
        'wrong-leadership': 2,  # B → 3, A → 2, C → 2, D → 1
        'market-timing': 3,  # Best: Strategic mistake
        'underinvest-data': 2,  # Important but less strategic
        'feature-overbuilding': 1  # Tactical mistake
    },

    # -------------------- FINANCE --------------------

    'finance-metrics-conflict': {
        'recheck-quietly': 2,  # Developing: Insecure, passive
        'present-as-is': 3,  # Proficient: Honest but blunt
        'scenarios': 5,  # Expert: Strategic communication
        'align-narrative': 4   # Advanced: Influential partnership
    },

    'finance-forecast-miss': {
        'conservative-buffers': 2,  # Developing: Band-aid solution
        'granular-drivers': 4,  # Advanced: More detail
        'scenario-modeling': 5,  # Expert: Strategic modeling
        'predictive-models': 5   # Expert: Advanced analytics
    },

    'finance-decision-speed': {
        'delay-decision': 1,  # Beginner: Risk-averse
        'historical-averages': 2,  # Developing: Simplistic
        'confidence-intervals': 5,  # Expert: Statistical rigor
        'ai-anomalies': 5   # Expert: AI-powered analysis
    },

    'finance-ai-application': {
        'faster-reporting': 2,  # Developing: Tactical efficiency
        'anomaly-detection': 4,  # Advanced: Analytical value
        'forecasting': 5,  # Expert: Strategic value
        'prescriptive': 5   # Expert: Decision automation
    },

    'finance-leadership-weight': {
        'leadership': 2,  # Developing: Passive role
        'cross-functional': 3,  # Proficient: Collaborative
        'shared': 4,  # Advanced: Partnership
        'me': 5   # Expert: Full accountability
    },

    'finance-impact-type': {
        'cost-reduction': 3,  # Proficient: Defensive value
        'revenue-optimization': 5,  # Expert: Revenue impact
        'risk-mitigation': 3,  # Proficient: Defensive value
        'strategic-pivot': 5   # Expert: Transformational
    },

    # -------------------- SALES --------------------

    'sales-pipeline-reality': {
        'push-volume': 1,  # Beginner: Activity trap
        'tighten-qualification': 5,  # Expert: Process thinking
        'analyze-winloss': 5,  # Expert: Data-driven diagnosis
        'change-pricing': 3   # Proficient: Quick fix attempt
    },

    'sales-deal-stuck': {
        'increase-followups': 1,  # Beginner: Activity trap
        'escalate-internally': 3,  # Proficient: Relationship leverage
        'analyze-blockers': 5,  # Expert: Pattern recognition
        'change-structure': 5   # Expert: Creative restructuring
    },

    'sales-ai-usage': {
        'email-drafts': 2,  # Developing: Tactical speed
        'call-summaries': 3,  # Proficient: Documentation help
        'deal-risk': 5,  # Expert: Strategic prediction
        'pricing-optimization': 5   # Expert: Revenue optimization
    },

    'sales-target-miss': {
        'lead-quality': 1,  # Beginner: Blaming marketing
        'icp-mismatch': 5,  # Expert: Strategic diagnosis
        'sales-motion': 5,  # Expert: Process design thinking
        'market-conditions': 2   # Developing: External blame
    },

    'sales-forecasting': {
        'rep-judgment': 2,  # Developing: Subjective
        'weighted-pipeline': 3,  # Proficient: Basic process
        'historical-patterns': 4,  # Advanced: Data-informed
        'predictive-models': 5   # Expert: Advanced analytics
    },

    'sales-ownership': {
        'activities': 2,  # Developing: Junior accountability
        'revenue-number': 4,  # Advanced: Individual contributor
        'team-number': 5,  # Expert: Manager accountability
        'region-business': 5   # Expert: Executive accountability
    },

    # -------------------- MARKETING --------------------

    'marketing-conflicting-signals': {
        'ctr': 1,  # Beginner: Vanity metric
        'cac': 3,  # Proficient: Cost awareness
        'ltv-cac-cohort': 5,  # Expert: Unit economics
        'revenue-attribution': 5   # Expert: Revenue connection
    },

    'marketing-budget-shock': {
        'experiments': 1,  # Beginner: Killing learning
        'branding': 3,  # Proficient: Cutting soft ROI
        'low-ltv-segments': 5,  # Expert: Unit economics thinking
        'agency-spend': 4   # Advanced: Cutting overhead
    },

    'marketing-ai-application': {
        'content-generation': 2,  # Developing: Tactical speed
        'creative-testing': 4,  # Advanced: Optimization
        'audience-prediction': 5,  # Expert: Strategic targeting
        'automated-optimization': 5   # Expert: Systematic advantage
    },

    'marketing-attribution-reality': {
        'accept-imperfect': 2,  # Developing: Passive
        'switch-model': 3,  # Proficient: Model-shopping
        'directional-insights': 5,  # Expert: Pragmatic analytics
        'ai-infer-patterns': 5   # Expert: Advanced inference
    },

    'marketing-scale-failure': {
        'saturation': 3,  # Proficient: Market awareness
        'messaging-mismatch': 4,  # Advanced: Positioning insight
        'funnel-leakage': 5,  # Expert: Conversion thinking
        'ops-constraints': 5   # Expert: Systems thinking
    },

    'marketing-defend-metric': {
        'leads': 2,  # Developing: Vanity metric
        'cac': 3,  # Proficient: Cost awareness
        'revenue-contribution': 5,  # Expert: Revenue accountability
        'ltv': 5   # Expert: Long-term value
    },

    # -------------------- OPERATIONS --------------------

    'operations-scale-stress': {
        'hiring-capacity': 2,  # Developing: Throwing headcount
        'process-design': 5,  # Expert: Systems thinking
        'data-visibility': 5,  # Expert: Instrumentation first
        'vendor-reliability': 4   # Advanced: Supply chain thinking
    },

    'operations-cost-sla': {
        'headcount': 1,  # Beginner: Throwing bodies
        'process-bottlenecks': 5,  # Expert: Root cause analysis
        'demand-variability': 4,  # Advanced: Demand management
        'automation-gaps': 5   # Expert: Tech leverage
    },

    'operations-ai-leverage': {
        'reporting': 2,  # Developing: Tactical speed
        'forecasting': 4,  # Advanced: Planning support
        'automation': 5,  # Expert: Process automation
        'decision-optimization': 5   # Expert: Strategic value
    },

    'operations-metric-priority': {
        'task-completion': 2,  # Developing: Activity metric
        'cost-per-unit': 4,  # Advanced: Efficiency metric
        'sla-adherence': 4,  # Advanced: Customer commitment
        'margin': 5   # Expert: Business outcome
    },

    'operations-data-constraint': {
        'wait': 1,  # Beginner: Paralysis
        'use-proxies': 4,  # Advanced: Pragmatic workaround
        'early-warning': 5,  # Expert: Leading indicators
        'ai-prediction': 5   # Expert: Predictive modeling
    },

    'operations-purpose': {
        'execute-plans': 2,  # Developing: Order-taking
        'reduce-cost': 3,  # Proficient: Tactical focus
        'enable-scale': 5,  # Expert: Strategic partner
        'competitive-advantage': 5   # Expert: Strategic weapon
    },

    # -------------------- FOUNDER --------------------

    'founder-mvp-failure': {
        'add-features': 1,  # Beginner: Feature factory
        'increase-marketing': 2,  # Developing: Distribution only
        'reframe-problem': 5,  # Expert: Problem understanding
        'pivot-icp': 5   # Expert: Customer understanding
    },

    'founder-ai-dependency': {
        'engineering': 4,  # Advanced: Common bottleneck
        'marketing': 3,  # Proficient: Distribution help
        'ops': 3,  # Proficient: Efficiency help
        'decision-making': 5   # Expert: Strategic leverage
    },

    'founder-scale-pain': {
        'pricing': 5,  # Expert: Unit economics
        'ops-inefficiency': 3,  # Proficient: Execution issue
        'customer-mix': 5,  # Expert: Segment understanding
        'data-blindness': 4   # Advanced: Instrumentation gap
    },

    'founder-resource-constraint': {
        'growth': 3,  # Proficient: Topline focus
        'profitability': 4,  # Advanced: Unit economics
        'learning': 5,  # Expert: Hypothesis validation
        'fundraising': 2   # Developing: Chasing capital
    },

    'founder-ai-advantage': {
        'speed': 3,  # Proficient: Tactical advantage
        'cost': 3,  # Proficient: Efficiency play
        'insight': 5,  # Expert: Intelligence advantage
        'differentiation': 5   # Expert: Product moat
    },

    'founder-failure-pattern': {
        'hiring-early': 3,  # Proficient: Execution mistake
        'scaling-fast': 3,  # Proficient: Timing mistake
        'weak-data': 5,  # Expert: Instrumentation gap
        'poor-problem': 5   # Expert: Market understanding
    },

    # -------------------- TECH/ENGINEERING (0-3 years) --------------------

    'tech-product-thinking': {
        'move-next-task': 0,  # Very Weak: No ownership
        'suggest-features': 2,  # Weak: Solution before diagnosis
        'review-data': 4,  # Strong: Data-first thinking
        'blame-marketing': 1   # Very Weak: Blame shifting
    },

    'tech-business-impact': {
        'code-quality': 2,  # Weak: Technical focus only
        'ux-cost': 4,  # Strong: Business impact awareness
        'deployment': 1,  # Very Weak: Narrow focus
        'doesnt-matter': 0   # Very Weak: No business sense
    },

    'tech-execution-accountability': {
        'ignore-small': 0,  # Very Weak: No accountability
        'inform-stakeholders': 4,  # Strong: Transparent and responsible
        'fix-quietly': 2,  # Weak: Good intent but poor communication
        'delay-release': 1   # Very Weak: Reactive
    },

    'tech-prioritization': {
        'technically-interesting': 1,  # Very Weak: Self-interest
        'business-impact': 4,  # Strong: Business-oriented
        'always-sales': 2,  # Weak: No balance
        'always-refactor': 2   # Weak: No balance
    },

    'tech-ai-literacy': {
        'competitor-usage': 2,  # Weak: Follower mindset
        'productivity-cost': 4,  # Strong: ROI thinking
        'trending': 0,  # Very Weak: Trend-chasing
        'junior-likes': 1   # Very Weak: Wrong criteria
    },

    'tech-ownership': {
        'highlight-others': 2,  # Weak: Defensive
        'take-ownership': 4,  # Strong: Ownership mindset
        'stay-silent': 1,  # Very Weak: Passive
        'escalate-blame': 0   # Very Weak: Blame-shifting
    },

    # -------------------- TECH/ENGINEERING (3-8 years) --------------------

    'tech-feature-roi': {
        'technical-feasibility': 2,  # Weak: Technical focus
        'revenue-opportunity': 4,  # Strong: Business ROI thinking
        'team-excitement': 0,  # Very Weak: Wrong criteria
        'competitor-parity': 1   # Very Weak: Follower mindset
    },

    'tech-cost-escalation': {
        'immediate-overhaul': 2,  # Weak: Reactive
        'analyze-drivers': 4,  # Strong: Analytical approach
        'reduce-features': 1,  # Very Weak: Wrong solution
        'wait-cfo': 1   # Very Weak: No ownership
    },

    'tech-sales-product-conflict': {
        'build-immediately': 2,  # Weak: Reactive
        'reject-firmly': 0,  # Very Weak: Inflexible
        'evaluate-align': 4,  # Strong: Balanced decision-making
        'escalate-conflict': 1   # Very Weak: Avoidance
    },

    'tech-debt-speed': {
        'prioritize-features': 2,  # Weak: Short-term focus
        'balance-debt': 4,  # Strong: Strategic balance
        'focus-health': 1,  # Very Weak: Ignoring business
        'ignore-pressure': 1   # Very Weak: Poor stakeholder management
    },

    'tech-ai-investment': {
        'trend-value': 0,  # Very Weak: Trend-chasing
        'pain-point-roi': 4,  # Strong: Outcome-driven
        'competitive-pressure': 2,  # Weak: Follower mindset
        'ease-implementation': 1   # Very Weak: Wrong criteria
    },

    'tech-resource-allocation': {
        'highest-impact': 2,  # Weak: Tactical
        'growth-priorities': 4,  # Strong: Strategic alignment
        'technically-complex': 1,  # Very Weak: Self-interest
        'team-vote': 1   # Very Weak: No leadership
    },

    # -------------------- TECH/ENGINEERING (8+ years) --------------------

    'tech-strategic-tradeoff': {
        'immediate-revenue': 2,  # Weak: Short-term focus
        'long-term-strategy': 4,  # Strong: Strategic thinking
        'engineering-preference': 1,  # Very Weak: Biased
        'ceo-urgency': 1   # Very Weak: Reactive
    },

    'tech-capital-allocation': {
        'hire-aggressively': 2,  # Weak: Single lever
        'invest-ai': 1,  # Very Weak: Over-concentration
        'allocate-roi': 4,  # Strong: ROI-based allocation
        'preserve-capital': 1   # Very Weak: Risk-averse
    },

    'tech-competitive-advantage': {
        'complex-architecture': 2,  # Weak: Technical focus
        'switching-cost-value': 4,  # Strong: Business moat thinking
        'high-infra-cost': 1,  # Very Weak: Wrong understanding
        'large-team': 0   # Very Weak: Wrong understanding
    },

    'tech-scalability': {
        'overbuild-now': 2,  # Weak: Premature optimization
        'modular-incremental': 4,  # Strong: Pragmatic scaling
        'ignore-projections': 1,  # Very Weak: Short-sighted
        'freeze-innovation': 0   # Very Weak: Stagnation
    },

    'tech-ai-strategy': {
        'industry-trend': 1,  # Very Weak: Follower
        'strategic-differentiation': 4,  # Strong: Strategic thinking
        'investor-excitement': 0,  # Very Weak: Wrong driver
        'team-expertise': 2   # Weak: Capability focus only
    },

    'tech-portfolio-balancing': {
        'all-features': 1,  # Very Weak: Growth bias
        'balanced-allocation': 4,  # Strong: Strategic balance
        'mostly-refactoring': 1,  # Very Weak: Over-optimization
        'engineering-interest': 0   # Very Weak: Wrong driver
    }
}

