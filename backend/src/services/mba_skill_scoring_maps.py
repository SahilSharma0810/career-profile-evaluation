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

    # Finance Questions - 0-3 years (Entry level)
    'fm-e1': ['financial_modeling'],  # Revenue Forecast Variance
    'fm-e2': ['business_partnering'],  # Sales Team Wants Higher Targets
    'fm-e3': ['data_integrity'],  # Data Discrepancy
    'fm-e4': ['ai_literacy'],  # Automating Reporting (AI Fluency)
    'fm-e5': ['strategic_thinking'],  # Budget Cuts Required
    'fm-e6': ['leadership', 'business_partnering'],  # Cross-functional Planning Meeting (Ownership)
    
    # Finance Questions - 3-8 years (Mid level)
    'fm-m1': ['financial_modeling'],  # Building a 3-Year Financial Model
    'fm-m2': ['business_partnering', 'strategic_thinking'],  # Partnering with Product Team
    'fm-m3': ['strategic_thinking'],  # Forecasting in Uncertainty
    'fm-m4': ['data_integrity'],  # Ensuring Data Reliability
    'fm-m5': ['ai_literacy'],  # Leveraging AI in Finance (AI Fluency)
    'fm-m6': ['leadership', 'business_partnering'],  # Influencing Senior Leaders (Ownership)
    
    # Finance Questions - 8+ years (Senior level)
    'fm-s1': ['strategic_thinking'],  # Capital Allocation Decision
    'fm-s2': ['financial_modeling', 'strategic_thinking'],  # M&A Evaluation
    'fm-s3': ['leadership', 'ai_literacy'],  # Leading Finance Transformation (AI Fluency)
    'fm-s4': ['leadership', 'strategic_thinking'],  # Managing Board-Level Reporting (Ownership)
    'fm-s5': ['strategic_thinking'],  # Enterprise Risk Exposure
    'fm-s6': ['leadership', 'business_partnering'],  # Building High-Performance Finance Team

    # Sales Questions - 0-3 years (Entry level)
    'sm-e1': ['revenue_operations'],  # CRM Data Is Inconsistent
    'sm-e2': ['deal_execution'],  # A Large Deal Is Stuck
    'sm-e3': ['sales_strategy'],  # Monthly Target Missed
    'sm-e4': ['ai_literacy'],  # Repetitive Manual Reporting (AI Fluency)
    'sm-e5': ['strategic_thinking'],  # Pricing Pushback (Ownership)
    'sm-e6': ['leadership', 'revenue_operations'],  # Cross-Team Alignment
    
    # Sales Questions - 3-8 years (Mid level)
    'sm-m1': ['revenue_operations'],  # Scaling Revenue Predictability
    'sm-m2': ['deal_execution'],  # Complex Enterprise Deal
    'sm-m3': ['sales_strategy'],  # Entering a New Segment
    'sm-m4': ['ai_literacy'],  # AI in Prospecting (AI Fluency)
    'sm-m5': ['strategic_thinking'],  # Declining Win Rate (Ownership)
    'sm-m6': ['leadership'],  # Managing Sales Team Performance
    
    # Sales Questions - 8+ years (Senior level)
    'sm-s1': ['strategic_thinking'],  # Long-Term Revenue Strategy
    'sm-s2': ['revenue_operations', 'strategic_thinking'],  # Portfolio Revenue Allocation
    'sm-s3': ['strategic_thinking'],  # Enterprise Risk Exposure
    'sm-s4': ['ai_literacy'],  # AI-Driven Sales Transformation (AI Fluency)
    'sm-s5': ['leadership', 'revenue_operations'],  # Board-Level Revenue Forecast (Ownership)
    'sm-s6': ['leadership'],  # Building High-Performance Revenue Org

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

    # -------------------- FINANCE - 0-3 YEARS (ENTRY) --------------------
    
    'fm-e1': {  # Revenue Forecast Variance - Financial Modeling
        'assume-sales-underperformed': 2,  # A=2
        'adjust-forecast': 1,  # B=1
        'revisit-assumptions': 2,  # C=2 (best answer, but entry level)
        'blame-market': 2  # D=2
    },
    
    'fm-e2': {  # Sales Team Wants Higher Targets - Business Partnering
        'agree-maintain-alignment': 1,  # A=1
        'reject-proposal': 2,  # B=2
        'share-model-scenarios': 2,  # C=2 (best answer)
        'escalate-cfo': 2  # D=2
    },
    
    'fm-e3': {  # Data Discrepancy - Data Integrity
        'ignore-differences': 1,  # A=1
        'update-sheet': 1,  # B=1
        'trace-reconcile': 2,  # C=2 (best answer)
        'send-disclaimer': 2  # D=2
    },
    
    'fm-e4': {  # Automating Reporting - AI Literacy (AI Fluency)
        'continue-manual': 1,  # A=1
        'ask-intern': 2,  # B=2
        'explore-automation': 2,  # C=2 (best answer)
        'reduce-reporting': 1  # D=1
    },
    
    'fm-e5': {  # Budget Cuts Required - Strategic Thinking
        'cut-equally': 2,  # A=2
        'cut-largest': 2,  # B=2
        'analyze-roi-strategic': 5,  # C=5 (best answer)
        'freeze-hiring': 2  # D=2
    },
    
    'fm-e6': {  # Cross-functional Planning Meeting - Leadership & Business Partnering (Ownership)
        'stay-silent': 1,  # A=1
        'support-finance': 2,  # B=2
        'facilitate-data-scenarios': 5,  # C=5 (best answer)
        'defer-decision': 2  # D=2
    },
    
    # -------------------- FINANCE - 3-8 YEARS (MID) --------------------
    
    'fm-m1': {  # Building a 3-Year Financial Model - Financial Modeling
        'extend-growth': 3,  # A=3
        'copy-competitor': 2,  # B=2
        'driver-based-scenarios': 5,  # C=5 (best answer)
        'optimistic-only': 1  # D=1
    },
    
    'fm-m2': {  # Partnering with Product Team - Business Partnering & Strategic Thinking
        'block-uncertainty': 2,  # A=2
        'approve-no-analysis': 1,  # B=1
        'build-business-case': 2,  # C=2 (best answer)
        'delay-indefinitely': 1  # D=1
    },
    
    'fm-m3': {  # Forecasting in Uncertainty - Strategic Financial Planning
        'single-point': 3,  # A=3
        'conservative-only': 2,  # B=2
        'scenarios-sensitivity': 5,  # C=5 (best answer)
        'wait-stability': 1  # D=1
    },
    
    'fm-m4': {  # Ensuring Data Reliability - Data Integrity
        'trust-submissions': 1,  # A=1
        'audit-randomly': 2,  # B=2
        'validation-reconciliation': 4,  # C=4 (best answer)
        'centralize-manual': 2  # D=2
    },
    
    'fm-m5': {  # Leveraging AI in Finance - AI Literacy (AI Fluency)
        'avoid-ai-risk': 1,  # A=1
        'use-without-validation': 1,  # B=1
        'ai-validate-outputs': 2,  # C=2 (best answer)
        'replace-analysts': 1  # D=1
    },
    
    'fm-m6': {  # Influencing Senior Leaders - Leadership & Executive Business Partnering (Ownership)
        'approve-expansion': 1,  # A=1
        'oppose-no-data': 2,  # B=2
        'present-scenarios-risk': 4,  # C=4 (best answer)
        'stay-neutral': 1  # D=1
    },
    
    # -------------------- FINANCE - 8+ YEARS (SENIOR) --------------------
    
    'fm-s1': {  # Capital Allocation Decision - Strategic Thinking
        'even-distribution': 1,  # A=1
        'prioritize-largest': 2,  # B=2
        'allocate-roi-strategic': 4,  # C=4 (best answer)
        'protect-historical': 1  # D=1
    },
    
    'fm-s2': {  # M&A Evaluation - Financial Modeling & Strategic Thinking
        'focus-revenue-synergy': 2,  # A=2
        'look-ebitda': 2,  # B=2
        'evaluate-comprehensive': 2,  # C=2 (best answer)
        'follow-board': 1  # D=1
    },
    
    'fm-s3': {  # Leading Finance Transformation - Leadership & AI Literacy (AI Fluency)
        'add-headcount': 2,  # A=2
        'maintain-status': 1,  # B=1
        'drive-automation-governance': 2,  # C=2 (best answer)
        'outsource-everything': 2  # D=2
    },
    
    'fm-s4': {  # Managing Board-Level Reporting - Executive Leadership & Strategic Clarity (Ownership)
        'defend-aggressively': 2,  # A=2
        'revise-immediately': 2,  # B=2
        'walk-through-transparent': 4,  # C=4 (best answer)
        'defer-ceo': 1  # D=1
    },
    
    'fm-s5': {  # Enterprise Risk Exposure - Strategic Thinking
        'freeze-investments': 2,  # A=2
        'ignore-long-term': 1,  # B=1
        'rebalance-strategic': 4,  # C=4 (best answer)
        'reduce-analytics': 1  # D=1
    },
    
    'fm-s6': {  # Building High-Performance Finance Team - Leadership & Business Partnering
        'focus-technical': 2,  # A=2
        'hire-new-team': 1,  # B=1
        'develop-storytelling': 2,  # C=2 (best answer)
        'increase-compliance': 2  # D=2
    },

    # -------------------- SALES - 0-3 YEARS (ENTRY) --------------------

    'sm-e1': {  # CRM Data Is Inconsistent - Revenue Operations
        'ignore-senior-reps': 1,  # A=1: Ignore it since senior reps manage their own pipeline
        'close-randomly': 1,  # B=1: Close old deals randomly to clean dashboard
        'audit-standardize': 4,  # C=4: Audit deal stages, validate data with reps, and standardize update process
        'excel-separate': 2   # D=2: Create a new Excel sheet and track separately
    },

    'sm-e2': {  # A Large Deal Is Stuck - Deal Execution
        'wait-respond': 1,  # A=1: Wait for them to respond
        'offer-discount': 2,  # B=2: Offer a discount immediately
        'reengage-objections': 4,  # C=4: Re-engage by understanding objections and reframing value
        'escalate-ceo': 2   # D=2: Escalate to CEO immediately
    },

    'sm-e3': {  # Monthly Target Missed - Sales Strategy
        'push-harder': 2,  # A=2: Push team to work harder next month
        'blame-marketing': 1,  # B=1: Blame marketing for weak leads
        'analyze-funnel': 2,  # C=2: Analyze funnel metrics (lead quality, conversion rates, deal velocity)
        'increase-discounts': 2   # D=2: Increase discounts across the board
    },

    'sm-e4': {  # Repetitive Manual Reporting - AI Literacy (AI Fluency)
        'continue-manual': 1,  # A=1: Continue manual reporting
        'ask-admin': 2,  # B=2: Ask admin team to do it
        'explore-automation': 2,  # C=2: Explore CRM automation, dashboards, or AI reporting tools
        'reduce-detail': 1   # D=1: Reduce reporting detail
    },

    'sm-e5': {  # Pricing Pushback - Strategic Thinking (Ownership)
        'offer-discount-immediate': 2,  # A=2: Offer immediate 20% discount
        'assume-product': 1,  # B=1: Assume product isn't good enough
        'investigate-value': 4,  # C=4: Investigate value perception, competitor positioning, and ICP fit
        'reduce-base-pricing': 1   # D=1: Reduce base pricing for everyone
    },

    'sm-e6': {  # Cross-Team Alignment - Leadership & Revenue Ops
        'stay-out': 1,  # A=1: Stay out of it
        'support-sales': 2,  # B=2: Support Sales team only
        'align-data': 2,  # C=2: Align both teams using data (MQL to SQL conversion, lead quality analysis)
        'escalate-conflict': 2   # D=2: Escalate conflict
    },

    # -------------------- SALES - 3-8 YEARS (MID) --------------------

    'sm-m1': {  # Scaling Revenue Predictability - Revenue Operations
        'increase-targets': 2,  # A=2: Increase targets
        'hire-more-reps': 2,  # B=2: Hire more reps immediately
        'strengthen-forecasting': 4,  # C=4: Strengthen forecasting model, pipeline hygiene, and stage conversion analysis
        'focus-quarter-end': 2   # D=2: Focus only on closing quarter-end deals
    },

    'sm-m2': {  # Complex Enterprise Deal - Deal Execution
        'offer-max-discount': 2,  # A=2: Offer maximum discount to close quickly
        'agree-all-customizations': 1,  # B=1: Agree to all customizations
        'map-stakeholders': 4,  # C=4: Map stakeholders, decision process, value justification, and risk mitigation
        'avoid-complex': 1   # D=1: Avoid complex deals
    },

    'sm-m3': {  # Entering a New Segment - Sales Strategy
        'replicate-pitch': 1,  # A=1: Replicate same sales pitch
        'increase-ad-budget': 2,  # B=2: Increase ad budget
        'define-icp': 4,  # C=4: Define ICP, pricing adjustments, sales cycle expectations, and enablement needs
        'assign-existing-reps': 2   # D=2: Assign existing reps without change
    },

    'sm-m4': {  # AI in Prospecting - AI Literacy (AI Fluency)
        'avoid-ai-fear': 1,  # A=1: Avoid AI due to fear of errors
        'fully-automate': 1,  # B=1: Fully automate without oversight
        'use-ai-validate': 2,  # C=2: Use AI for prospect prioritization while validating outputs
        'continue-manual-outreach': 2   # D=2: Continue manual outreach
    },

    'sm-m5': {  # Declining Win Rate - Strategic Thinking (Ownership)
        'increase-discounts': 2,  # A=2: Increase discounts
        'replace-reps': 2,  # B=2: Replace lowest-performing reps
        'analyze-loss-reasons': 2,  # C=2: Analyze deal loss reasons, competitor trends, and sales messaging gaps
        'ignore-temporarily': 1   # D=1: Ignore temporarily
    },

    'sm-m6': {  # Managing Sales Team Performance - Leadership
        'focus-top-performers': 2,  # A=2: Focus only on top performers
        'let-underperformers': 1,  # B=1: Let underperformers figure it out
        'standardize-playbooks': 2,  # C=2: Standardize playbooks, coaching, and performance benchmarks
        'reduce-targets': 1   # D=1: Reduce targets
    },

    # -------------------- SALES - 8+ YEARS (SENIOR) --------------------

    'sm-s1': {  # Long-Term Revenue Strategy - Strategic Thinking
        'increase-targets-aggressive': 2,  # A=2: Increase targets aggressively
        'increase-discounting': 1,  # B=1: Increase discounting
        'reevaluate-strategy': 4,  # C=4: Re-evaluate ICP, pricing strategy, channel mix, and product-market fit
        'replace-team': 1   # D=1: Replace entire sales team
    },

    'sm-s2': {  # Portfolio Revenue Allocation - Revenue Operations & Strategy
        'equal-distribution': 1,  # A=1: Equal distribution
        'favor-dominant': 2,  # B=2: Favor historically dominant channel
        'allocate-cac-ltv': 4,  # C=4: Allocate based on CAC, LTV, scalability, and margin impact
        'follow-last-year': 1   # D=1: Follow last year's budget
    },

    'sm-s3': {  # Enterprise Risk Exposure - Strategic Thinking
        'continue-focus': 2,  # A=2: Continue focus on them
        'increase-dependency': 1,  # B=1: Increase dependency
        'diversify-revenue': 4,  # C=4: Diversify revenue base and reduce concentration risk
        'ignore-risk': 1   # D=1: Ignore risk
    },

    'sm-s4': {  # AI-Driven Sales Transformation - AI Literacy (AI Fluency)
        'buy-expensive-tool': 2,  # A=2: Buy expensive AI tool immediately
        'resist-transformation': 1,  # B=1: Resist transformation
        'define-use-cases': 2,  # C=2: Define use cases (forecasting, scoring, automation), ROI, and phased rollout
        'fully-automate-sales': 1   # D=1: Fully automate sales
    },

    'sm-s5': {  # Board-Level Revenue Forecast - Leadership & Revenue Ops (Ownership)
        'defend-emotionally': 2,  # A=2: Defend emotionally
        'revise-numbers': 2,  # B=2: Revise numbers quickly
        'walk-through-assumptions': 2,  # C=2: Walk through assumptions, pipeline health, sensitivity scenarios
        'defer-finance': 1   # D=1: Defer to finance
    },

    'sm-s6': {  # Building High-Performance Revenue Org - Leadership
        'more-pressure': 2,  # A=2: More pressure on targets
        'increase-commissions': 2,  # B=2: Increase commissions only
        'clear-segmentation': 4,  # C=4: Clear segmentation, enablement structure, performance systems, and culture alignment
        'reduce-reporting': 1   # D=1: Reduce reporting
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

