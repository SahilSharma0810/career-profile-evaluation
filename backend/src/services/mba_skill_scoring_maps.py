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

    # Marketing Questions - 0-3 years (Entry level)
    'mm-e1': ['marketing_analytics'],  # Campaign CAC Suddenly Increases
    'mm-e2': ['campaign_optimization'],  # Low Conversion Landing Page
    'mm-e3': ['growth_marketing'],  # Planning a New Growth Campaign
    'mm-e4': ['ai_literacy'],  # Manual Performance Reporting (AI Fluency)
    'mm-e5': ['strategic_thinking'],  # Brand vs Performance Debate
    'mm-e6': ['leadership', 'marketing_analytics'],  # Marketing-Sales Misalignment (Ownership)
    
    # Marketing Questions - 3-8 years (Mid level)
    'mm-m1': ['growth_marketing', 'campaign_optimization'],  # Scaling Growth Efficiently
    'mm-m2': ['marketing_analytics'],  # Multi-Channel Attribution Challenge
    'mm-m3': ['strategic_thinking'],  # Launching a New Market Segment
    'mm-m4': ['ai_literacy'],  # AI in Creative Optimization (AI Fluency)
    'mm-m5': ['campaign_optimization'],  # Campaign Underperformance
    'mm-m6': ['leadership'],  # Leading a Performance Team (Ownership)
    
    # Marketing Questions - 8+ years (Senior level)
    'mm-s1': ['strategic_thinking'],  # Long-Term Brand vs Performance Balance
    'mm-s2': ['growth_marketing', 'strategic_thinking'],  # Portfolio Channel Allocation
    'mm-s3': ['marketing_analytics'],  # Enterprise-Level Attribution Redesign
    'mm-s4': ['ai_literacy', 'leadership'],  # AI-Led Marketing Transformation (AI Fluency)
    'mm-s5': ['strategic_thinking'],  # Entering New Geography
    'mm-s6': ['leadership'],  # Building a High-Performance Marketing Org (Ownership)

    # Operations Questions - 0-3 years (Entry level)
    'om-e1': ['operations_excellence'],  # Order Fulfillment Delays
    'om-e2': ['supply_chain', 'data_integrity'],  # Inventory Mismatch
    'om-e3': ['process_automation'],  # Repetitive Manual Reporting
    'om-e4': ['supply_chain'],  # Vendor Delays
    'om-e5': ['ai_literacy'],  # Using AI in Operations (AI Fluency)
    'om-e6': ['leadership', 'operations_excellence'],  # Cross-Team Process Breakdown (Ownership)
    
    # Operations Questions - 3-8 years (Mid level)
    'om-m1': ['operations_excellence'],  # Rising Operational Costs
    'om-m2': ['supply_chain'],  # Supply Chain Disruption
    'om-m3': ['strategic_thinking', 'operations_excellence'],  # Scaling Operations
    'om-m4': ['ai_literacy'],  # Automation Opportunity (AI Fluency)
    'om-m5': ['operations_excellence', 'data_integrity'],  # Data-Driven Decision Making
    'om-m6': ['leadership'],  # Managing Cross-Functional Execution (Ownership)
    
    # Operations Questions - 8+ years (Senior level)
    'om-s1': ['strategic_thinking'],  # Long-Term Operations Strategy
    'om-s2': ['supply_chain'],  # Supply Chain Risk Concentration
    'om-s3': ['ai_literacy', 'process_automation'],  # Enterprise Automation Roadmap (AI Fluency)
    'om-s4': ['leadership'],  # Board-Level Performance Challenge (Ownership)
    'om-s5': ['strategic_thinking'],  # Expansion into New Geography
    'om-s6': ['leadership', 'operations_excellence'],  # Building High-Performance Ops Team

    # Founder Questions - 0-3 years (Entry level)
    'sf-e1': ['venture_building'],  # Validating a Startup Idea
    'sf-e2': ['business_fundamentals'],  # Early Revenue Challenge
    'sf-e3': ['strategic_thinking'],  # Limited Budget, Big Goals
    'sf-e4': ['founder_resourcefulness'],  # Wearing Multiple Hats
    'sf-e5': ['ai_literacy'],  # Using AI in Early Startup (AI Fluency)
    'sf-e6': ['leadership'],  # Co-Founder Conflict (Ownership)
    
    # Founder Questions - 3-8 years (Mid level)
    'sf-m1': ['venture_building'],  # Scaling After Product-Market Fit
    'sf-m2': ['business_fundamentals'],  # Unit Economics Under Pressure
    'sf-m3': ['leadership'],  # Hiring Leadership Team (Ownership)
    'sf-m4': ['strategic_thinking'],  # Competitive Pressure
    'sf-m5': ['ai_literacy'],  # Leveraging AI for Scale (AI Fluency)
    'sf-m6': ['leadership', 'strategic_thinking'],  # Investor Alignment
    
    # Founder Questions - 8+ years (Senior level)
    'sf-s1': ['venture_building', 'strategic_thinking'],  # Building Multi-Product Portfolio
    'sf-s2': ['strategic_thinking'],  # Long-Term Vision Recalibration
    'sf-s3': ['leadership'],  # Enterprise Governance & Scale (Ownership)
    'sf-s4': ['business_fundamentals'],  # Capital Allocation Discipline
    'sf-s5': ['ai_literacy'],  # AI-Driven Business Reinvention (AI Fluency)
    'sf-s6': ['leadership'],  # Founder Legacy & Culture

    # Tech/Engineering Questions (0-3 years)
    'tm-e1': ['product_thinking', 'ownership'],  # Product Thinking
    'tm-e2': ['business_impact_awareness', 'strategic_thinking'],  # Business Impact Awareness
    'tm-e3': ['execution', 'accountability'],  # Execution & Accountability
    'tm-e4': ['prioritization', 'business_impact_awareness'],  # Prioritization Thinking
    'tm-e5': ['ai_literacy'],  # AI Literacy (Business Context) - Used for AI Fluency
    'tm-e6': ['ownership', 'leadership'],  # Ownership Mindset - Used for Ownership

    # Tech/Engineering Questions (3-8 years)
    'tm-m1': ['product_thinking', 'strategic_thinking'],  # Feature ROI Evaluation
    'tm-m2': ['business_impact_awareness', 'strategic_thinking'],  # Cost Escalation
    'tm-m3': ['leadership', 'business_partnering'],  # Sales vs Product Conflict
    'tm-m4': ['strategic_thinking', 'prioritization'],  # Tech Debt vs Speed - Used for Ownership
    'tm-m5': ['ai_literacy', 'strategic_thinking'],  # AI Investment Decision - Used for AI Fluency
    'tm-m6': ['strategic_thinking', 'capital_allocation'],  # Resource Allocation

    # Tech/Engineering Questions (8+ years)
    'tm-s1': ['strategic_thinking', 'capital_allocation'],  # Strategic Trade-off
    'tm-s2': ['capital_allocation', 'strategic_thinking'],  # Capital Allocation
    'tm-s3': ['strategic_thinking', 'product_thinking'],  # Engineering as Competitive Advantage
    'tm-s4': ['strategic_thinking', 'product_thinking'],  # Long-Term Scalability - Used for Ownership
    'tm-s5': ['ai_literacy', 'strategic_thinking'],  # AI as Strategy - Used for AI Fluency
    'tm-s6': ['strategic_thinking', 'capital_allocation']  # Portfolio Balancing
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

    # -------------------- MARKETING - 0-3 YEARS (ENTRY) --------------------

    'mm-e1': {  # Campaign CAC Suddenly Increases - Marketing Analytics
        'increase-budget': 2,  # A=2: Increase budget to regain volume
        'pause-campaigns': 2,  # B=2: Pause all campaigns immediately
        'analyze-funnel-metrics': 2,  # C=2: Analyze funnel metrics (CTR, CPC, conversion rate, audience segmentation)
        'change-creatives-randomly': 1   # D=1: Change ad creatives randomly
    },

    'mm-e2': {  # Low Conversion Landing Page - Campaign Optimization
        'increase-traffic': 1,  # A=1: Increase traffic volume
        'assume-audience-wrong': 2,  # B=2: Assume audience is wrong
        'run-ab-tests': 2,  # C=2: Run A/B tests on messaging, CTA, and page layout
        'add-more-content': 2   # D=2: Add more content to the page
    },

    'mm-e3': {  # Planning a New Growth Campaign - Growth Marketing
        'launch-ads-immediately': 2,  # A=2: Launch ads immediately
        'copy-competitor-messaging': 1,  # B=1: Copy competitor messaging
        'define-persona-strategy': 4,  # C=4: Define target persona, value proposition, channels, and success metrics
        'increase-brand-posts': 2   # D=2: Increase brand posts on social media
    },

    'mm-e4': {  # Manual Performance Reporting - AI Literacy (AI Fluency)
        'continue-manually': 1,  # A=1: Continue manually to avoid errors
        'reduce-frequency': 2,  # B=2: Reduce report frequency
        'use-automation-ai': 2,  # C=2: Use automation tools, dashboards, or AI to streamline reporting
        'delegate-without-structure': 2   # D=2: Delegate without structure
    },

    'mm-e5': {  # Brand vs Performance Debate - Strategic Thinking
        'support-performance-only': 2,  # A=2: Support performance only
        'support-brand-only': 2,  # B=2: Support brand only
        'propose-balanced-mix': 2,  # C=2: Propose a balanced mix aligned with business goals
        'escalate-conflict': 2   # D=2: Escalate conflict
    },

    'mm-e6': {  # Marketing-Sales Misalignment - Leadership & Analytics (Ownership)
        'defend-marketing': 2,  # A=2: Defend marketing team
        'ignore-feedback': 1,  # B=1: Ignore feedback
        'analyze-mql-sql': 2,  # C=2: Analyze MQL → SQL conversion and refine targeting
        'reduce-lead-generation': 1   # D=1: Reduce lead generation efforts
    },

    # -------------------- MARKETING - 3-8 YEARS (MID) --------------------

    'mm-m1': {  # Scaling Growth Efficiently - Growth Marketing & Campaign Optimization
        'increase-budgets': 2,  # A=2: Increase budgets to maintain growth
        'cut-brand-spend': 1,  # B=1: Cut brand spend entirely
        'optimize-channel-mix': 4,  # C=4: Optimize channel mix, creative testing, audience segmentation, and LTV analysis
        'accept-higher-cac': 2   # D=2: Accept higher CAC
    },

    'mm-m2': {  # Multi-Channel Attribution Challenge - Marketing Analytics
        'trust-last-click': 1,  # A=1: Trust last-click attribution blindly
        'choose-best-numbers': 1,  # B=1: Choose platform with best numbers
        'investigate-reconcile': 4,  # C=4: Investigate attribution model and reconcile cross-channel data
        'report-highest-number': 1   # D=1: Report highest number
    },

    'mm-m3': {  # Launching a New Market Segment - Strategic Thinking
        'use-same-messaging': 1,  # A=1: Use same messaging
        'increase-influencer': 2,  # B=2: Increase influencer partnerships
        'conduct-market-research': 2,  # C=2: Conduct market research and reposition value proposition
        'reduce-budget': 1   # D=1: Reduce budget
    },

    'mm-m4': {  # AI in Creative Optimization - AI Literacy (AI Fluency)
        'use-ai-without-testing': 1,  # A=1: Use AI creatives without testing
        'avoid-ai-tools': 1,  # B=1: Avoid AI tools
        'use-ai-validate-testing': 2,  # C=2: Use AI for ideation but validate through structured A/B testing
        'replace-creative-team': 1   # D=1: Replace creative team
    },

    'mm-m5': {  # Campaign Underperformance - Campaign Optimization
        'reduce-marketing-budget': 2,  # A=2: Reduce marketing budget
        'blame-external-factors': 1,  # B=1: Blame external factors
        'analyze-audience-targeting': 2,  # C=2: Analyze audience targeting, messaging alignment, and funnel conversion
        'stop-experimenting': 1   # D=1: Stop experimenting
    },

    'mm-m6': {  # Leading a Performance Team - Leadership (Ownership)
        'push-higher-targets': 2,  # A=2: Push for higher targets
        'focus-only-reporting': 2,  # B=2: Focus only on reporting
        'align-team-objectives': 4,  # C=4: Align team with clear growth objectives and performance benchmarks
        'micromanage-campaigns': 1   # D=1: Micromanage campaigns
    },

    # -------------------- MARKETING - 8+ YEARS (SENIOR) --------------------

    'mm-s1': {  # Long-Term Brand vs Performance Balance - Strategic Thinking
        'increase-discounts': 2,  # A=2: Increase discounts
        'double-performance-budget': 2,  # B=2: Double performance budget
        'strengthen-brand-equity': 4,  # C=4: Strengthen brand equity while optimizing performance efficiency
        'reduce-marketing-investment': 1   # D=1: Reduce marketing investment
    },

    'mm-s2': {  # Portfolio Channel Allocation - Growth Marketing & Strategic Thinking
        'equal-distribution': 1,  # A=1: Equal distribution
        'allocate-last-year': 1,  # B=1: Allocate based on last year's budget
        'allocate-cac-ltv-roi': 4,  # C=4: Allocate based on CAC, LTV, scalability, and marginal ROI
        'focus-one-channel': 1   # D=1: Focus only on one channel
    },

    'mm-s3': {  # Enterprise-Level Attribution Redesign - Marketing Analytics
        'defend-current-model': 2,  # A=2: Defend current model
        'simplify-reporting': 1,  # B=1: Simplify reporting
        'redesign-attribution-framework': 4,  # C=4: Redesign attribution framework integrating CRM, cohort, and incrementality analysis
        'reduce-reporting-depth': 1   # D=1: Reduce reporting depth
    },

    'mm-s4': {  # AI-Led Marketing Transformation - AI Literacy & Leadership (AI Fluency)
        'buy-expensive-tool': 2,  # A=2: Buy expensive tool immediately
        'resist-change': 1,  # B=1: Resist change
        'identify-pilot-scale': 2,  # C=2: Identify high-impact use cases, pilot, measure ROI, then scale
        'fully-automate-campaigns': 1   # D=1: Fully automate campaigns
    },

    'mm-s5': {  # Entering New Geography - Strategic Thinking
        'replicate-same-campaigns': 1,  # A=1: Replicate same campaigns
        'increase-paid-ads': 2,  # B=2: Increase paid ads
        'localize-strategy': 2,  # C=2: Localize messaging, pricing, and channel strategy
        'focus-only-digital': 1   # D=1: Focus only on digital
    },

    'mm-s6': {  # Building a High-Performance Marketing Org - Leadership (Ownership)
        'increase-budget-only': 2,  # A=2: Increase budget only
        'focus-only-acquisition': 2,  # B=2: Focus only on acquisition
        'define-specialization-kpis': 4,  # C=4: Define specialization, KPIs, experimentation culture, and leadership structure
        'reduce-reporting': 1   # D=1: Reduce reporting
    },

    # -------------------- OPERATIONS - 0-3 YEARS (ENTRY) --------------------

    'om-e1': {  # Order Fulfillment Delays - Operations Excellence
        'increase-delivery-timelines': 1,  # A=1
        'blame-warehouse-staff': 1,  # B=1
        'analyze-fulfillment-cycle': 4,  # C=4 (best answer)
        'offer-discounts': 2   # D=2
    },

    'om-e2': {  # Inventory Mismatch - Supply Chain & Data Integrity
        'adjust-system-match': 2,  # A=2
        'ignore-small-discrepancy': 1,  # B=1
        'investigate-root-cause': 2,  # C=2 (best answer)
        'order-more-inventory': 2   # D=2
    },

    'om-e3': {  # Repetitive Manual Reporting - Process Automation
        'continue-manually': 1,  # A=1
        'reduce-reporting-scope': 2,  # B=2
        'explore-automation': 2,  # C=2 (best answer)
        'delegate-without-docs': 2   # D=2
    },

    'om-e4': {  # Vendor Delays - Supply Chain Management
        'terminate-contract': 2,  # A=2
        'ignore-delays': 1,  # B=1
        'review-slas-discuss': 4,  # C=4 (best answer)
        'increase-buffer-inventory': 2   # D=2
    },

    'om-e5': {  # Using AI in Operations - AI Literacy (AI Fluency)
        'avoid-using-ai': 1,  # A=1
        'replace-planning-team': 1,  # B=1
        'pilot-ai-forecasting': 2,  # C=2 (best answer)
        'use-ai-without-verification': 1   # D=1
    },

    'om-e6': {  # Cross-Team Process Breakdown - Leadership & Operations Excellence (Ownership)
        'stay-out-conflict': 1,  # A=1
        'support-own-team': 2,  # B=2
        'map-end-to-end': 4,  # C=4 (best answer)
        'escalate-immediately': 1   # D=1
    },

    # -------------------- OPERATIONS - 3-8 YEARS (MID) --------------------

    'om-m1': {  # Rising Operational Costs - Operations Excellence
        'cut-costs-equally': 2,  # A=2
        'reduce-workforce': 2,  # B=2
        'conduct-cost-driver-analysis': 2,  # C=2 (best answer)
        'increase-pricing': 2   # D=2
    },

    'om-m2': {  # Supply Chain Disruption - Supply Chain Strategy
        'pause-operations': 1,  # A=1
        'increase-customer-prices': 2,  # B=2
        'activate-alternate-suppliers': 2,  # C=2 (best answer)
        'wait-resolution': 1   # D=1
    },

    'om-m3': {  # Scaling Operations - Strategic Thinking & Operations Excellence
        'increase-overtime': 2,  # A=2
        'hire-aggressively': 2,  # B=2
        'redesign-workflows': 4,  # C=4 (best answer)
        'slow-down-growth': 2   # D=2
    },

    'om-m4': {  # Automation Opportunity - AI Literacy (AI Fluency)
        'add-more-approvers': 1,  # A=1
        'remove-approvals': 1,  # B=1
        'evaluate-workflow-automation': 2,  # C=2 (best answer)
        'ignore-issue': 1   # D=1
    },

    'om-m5': {  # Data-Driven Decision Making - Operations Excellence & Data Governance
        'choose-favorable-metric': 1,  # A=1
        'report-average': 2,  # B=2
        'standardize-kpi-definitions': 4,  # C=4 (best answer)
        'reduce-reporting': 1   # D=1
    },

    'om-m6': {  # Managing Cross-Functional Execution - Leadership (Ownership)
        'let-teams-manage': 2,  # A=2
        'increase-pressure': 2,  # B=2
        'implement-launch-checklists': 2,  # C=2 (best answer)
        'delay-launches': 2   # D=2
    },

    # -------------------- OPERATIONS - 8+ YEARS (SENIOR) --------------------

    'om-s1': {  # Long-Term Operations Strategy - Strategic Thinking
        'increase-headcount': 2,  # A=2
        'maintain-current-structure': 1,  # B=1
        'redesign-operating-model': 4,  # C=4 (best answer)
        'cut-costs-aggressively': 2   # D=2
    },

    'om-s2': {  # Supply Chain Risk Concentration - Supply Chain Strategy
        'continue-as-is': 1,  # A=1
        'increase-dependency': 1,  # B=1
        'diversify-supplier-base': 4,  # C=4 (best answer)
        'increase-inventory-buffer': 2   # D=2
    },

    'om-s3': {  # Enterprise Automation Roadmap - AI Literacy & Process Automation (AI Fluency)
        'buy-multiple-tools': 2,  # A=2
        'resist-change': 1,  # B=1
        'define-phased-automation': 2,  # C=2 (best answer)
        'fully-automate-without-pilots': 1   # D=1
    },

    'om-s4': {  # Board-Level Performance Challenge - Leadership (Ownership)
        'defend-current-processes': 2,  # A=2
        'revise-metrics-presentation': 1,  # B=1
        'present-root-cause-analysis': 4,  # C=4 (best answer)
        'defer-to-ceo': 1   # D=1
    },

    'om-s5': {  # Expansion into New Geography - Strategic Thinking
        'replicate-domestic-model': 1,  # A=1
        'focus-only-logistics': 2,  # B=2
        'assess-regulatory-supplier': 4,  # C=4 (best answer)
        'increase-pricing': 1   # D=1
    },

    'om-s6': {  # Building High-Performance Ops Team - Leadership & Operations Excellence
        'increase-monitoring-only': 2,  # A=2
        'focus-only-daily-execution': 2,  # B=2
        'establish-clear-ownership': 2,  # C=2 (best answer)
        'reduce-documentation': 1   # D=1
    },

    # -------------------- FOUNDER - 0-3 YEARS (ENTRY) --------------------

    'sf-e1': {  # Validating a Startup Idea - Venture Building
        'hire-developers': 2,  # A=2
        'build-full-product': 1,  # B=1
        'validate-demand': 4,  # C=4 (best answer)
        'raise-funding': 2   # D=2
    },

    'sf-e2': {  # Early Revenue Challenge - Business Fundamentals
        'reduce-pricing': 2,  # A=2
        'assume-no-value': 1,  # B=1
        'reassess-value-prop': 2,  # C=2 (best answer)
        'increase-marketing': 2   # D=2
    },

    'sf-e3': {  # Limited Budget, Big Goals - Strategic Thinking
        'build-multiple-features': 1,  # A=1
        'hire-aggressively': 1,  # B=1
        'focus-core-value': 2,  # C=2 (best answer)
        'rebrand-product': 2   # D=2
    },

    'sf-e4': {  # Wearing Multiple Hats - Founder Resourcefulness
        'react-to-tasks': 2,  # A=2
        'work-longer-hours': 2,  # B=2
        'prioritize-high-impact': 2,  # C=2 (best answer)
        'delegate-everything': 1   # D=1
    },

    'sf-e5': {  # Using AI in Early Startup - AI Literacy (AI Fluency)
        'avoid-ai-tools': 1,  # A=1
        'fully-rely-ai': 1,  # B=1
        'use-ai-validate': 2,  # C=2 (best answer)
        'replace-team': 1   # D=1
    },

    'sf-e6': {  # Co-Founder Conflict - Leadership (Ownership)
        'push-decision': 2,  # A=2
        'avoid-discussion': 1,  # B=1
        'align-vision-validate': 3,  # C=3 (best answer)
        'escalate-investors': 1   # D=1
    },

    # -------------------- FOUNDER - 3-8 YEARS (MID) --------------------

    'sf-m1': {  # Scaling After Product-Market Fit - Venture Building
        'launch-multiple-products': 2,  # A=2
        'raise-funds': 2,  # B=2
        'strengthen-distribution': 4,  # C=4 (best answer)
        'increase-burn-rate': 1   # D=1
    },

    'sf-m2': {  # Unit Economics Under Pressure - Business Fundamentals
        'increase-prices': 2,  # A=2
        'cut-marketing': 1,  # B=1
        'optimize-channels-ltv': 4,  # C=4 (best answer)
        'ignore-temporarily': 1   # D=1
    },

    'sf-m3': {  # Hiring Leadership Team - Leadership (Ownership)
        'hire-fast': 2,  # A=2
        'hire-friends': 1,  # B=1
        'hire-culture-alignment': 4,  # C=4 (best answer)
        'outsource-leadership': 1   # D=1
    },

    'sf-m4': {  # Competitive Pressure - Strategic Thinking
        'panic-pivot': 2,  # A=2
        'slash-pricing': 1,  # B=1
        'double-down-differentiation': 4,  # C=4 (best answer)
        'reduce-marketing': 1   # D=1
    },

    'sf-m5': {  # Leveraging AI for Scale - AI Literacy (AI Fluency)
        'increase-headcount': 2,  # A=2
        'avoid-automation': 1,  # B=1
        'use-ai-efficiency': 4,  # C=4 (best answer)
        'cut-support': 1   # D=1
    },

    'sf-m6': {  # Investor Alignment - Leadership & Strategic Thinking
        'follow-investor-pressure': 2,  # A=2
        'ignore-investors': 1,  # B=1
        'present-data-backed-plan': 4,  # C=4 (best answer)
        'delay-communication': 1   # D=1
    },

    # -------------------- FOUNDER - 8+ YEARS (SENIOR) --------------------

    'sf-s1': {  # Building Multi-Product Portfolio - Venture Building & Strategic Thinking
        'equal-attention': 1,  # A=1
        'focus-legacy': 2,  # B=2
        'allocate-strategic-fit': 4,  # C=4 (best answer)
        'expand-randomly': 1   # D=1
    },

    'sf-s2': {  # Long-Term Vision Recalibration - Strategic Thinking
        'maintain-roadmap': 2,  # A=2
        'react-impulsively': 1,  # B=1
        'reevaluate-positioning': 4,  # C=4 (best answer)
        'cut-costs-only': 2   # D=2
    },

    'sf-s3': {  # Enterprise Governance & Scale - Leadership (Ownership)
        'founder-all-decisions': 2,  # A=2
        'minimal-process': 1,  # B=1
        'define-org-structure': 4,  # C=4 (best answer)
        'increase-meetings': 2   # D=2
    },

    'sf-s4': {  # Capital Allocation Discipline - Business Fundamentals
        'spend-aggressively': 2,  # A=2
        'protect-capital': 1,  # B=1
        'allocate-capital-roi': 4,  # C=4 (best answer)
        'increase-burn-outpace': 1   # D=1
    },

    'sf-s5': {  # AI-Driven Business Reinvention - AI Literacy (AI Fluency)
        'implement-ai-everywhere': 2,  # A=2
        'resist-change': 1,  # B=1
        'identify-pilot-scale': 4,  # C=4 (best answer)
        'replace-teams': 1   # D=1
    },

    'sf-s6': {  # Founder Legacy & Culture - Leadership
        'focus-revenue-only': 2,  # A=2
        'let-culture-evolve': 1,  # B=1
        'define-values-principles': 4,  # C=4 (best answer)
        'increase-monitoring': 2   # D=2
    },

    # -------------------- TECH/ENGINEERING (0-3 years) --------------------

    'tm-e1': {  # TM-E1: Product Thinking
        'move-next-task': 1,  # A (1): No ownership
        'suggest-features': 2,  # B (2): Solution before diagnosis
        'review-data': 4,  # C (4): Data-first thinking
        'blame-marketing': 1   # D (1): Blame shifting
    },

    'tm-e2': {  # TM-E2: Business Impact Awareness
        'code-quality': 2,  # A (2): Technical focus only
        'ux-cost': 4,  # B (4): Business impact awareness
        'deployment': 1,  # C (1): Narrow focus
        'doesnt-matter': 1   # D (1): No business sense
    },

    'tm-e3': {  # TM-E3: Execution & Accountability
        'ignore-small': 1,  # A (1): No accountability
        'inform-stakeholders': 4,  # B (4): Transparent and responsible
        'fix-quietly': 2,  # C (2): Good intent but poor communication
        'delay-release': 1   # D (1): Reactive
    },

    'tm-e4': {  # TM-E4: Prioritization Thinking
        'technically-interesting': 1,  # A (1): Self-interest
        'business-impact': 4,  # B (4): Business-oriented
        'always-sales': 2,  # C (2): No balance
        'always-refactor': 1   # D (1): No balance
    },

    'tm-e5': {  # TM-E5: AI Literacy (Business Context) - Used for AI Fluency
        'competitor-usage': 2,  # A (2): Follower mindset
        'productivity-cost': 4,  # B (4): ROI thinking
        'trending': 1,  # C (1): Trend-chasing
        'junior-likes': 1   # D (1): Wrong criteria
    },

    'tm-e6': {  # TM-E6: Ownership Mindset - Used for Ownership
        'highlight-others': 2,  # A (2): Defensive
        'take-ownership': 4,  # B (4): Ownership mindset
        'stay-silent': 1,  # C (1): Passive
        'escalate-blame': 1   # D (1): Blame-shifting
    },

    # -------------------- TECH/ENGINEERING (3-8 years) --------------------

    'tm-m1': {  # TM-M1: Feature ROI Evaluation
        'technical-feasibility': 2,  # A (2): Technical focus
        'revenue-opportunity': 4,  # B (4): Business ROI thinking
        'team-excitement': 1,  # C (1): Wrong criteria
        'competitor-parity': 1   # D (1): Follower mindset
    },

    'tm-m2': {  # TM-M2: Cost Escalation
        'immediate-overhaul': 2,  # A (2): Reactive
        'analyze-drivers': 4,  # B (4): Analytical approach
        'reduce-features': 1,  # C (1): Wrong solution
        'wait-cfo': 1   # D (1): No ownership
    },

    'tm-m3': {  # TM-M3: Sales vs Product Conflict
        'build-immediately': 2,  # A (2): Reactive
        'reject-firmly': 1,  # B (1): Inflexible
        'evaluate-align': 4,  # C (4): Balanced decision-making
        'escalate-conflict': 1   # D (1): Avoidance
    },

    'tm-m4': {  # TM-M4: Tech Debt vs Speed - Used for Ownership
        'prioritize-features': 2,  # A (2): Short-term focus
        'balance-debt': 4,  # B (4): Strategic balance
        'focus-health': 1,  # C (1): Ignoring business
        'ignore-pressure': 1   # D (1): Poor stakeholder management
    },

    'tm-m5': {  # TM-M5: AI Investment Decision - Used for AI Fluency
        'trend-value': 1,  # A (1): Trend-chasing
        'pain-point-roi': 4,  # B (4): Outcome-driven
        'competitive-pressure': 2,  # C (2): Follower mindset
        'ease-implementation': 1   # D (1): Wrong criteria
    },

    'tm-m6': {  # TM-M6: Resource Allocation
        'highest-impact': 2,  # A (2): Tactical
        'growth-priorities': 4,  # B (4): Strategic alignment
        'technically-complex': 1,  # C (1): Self-interest
        'team-vote': 1   # D (1): No leadership
    },

    # -------------------- TECH/ENGINEERING (8+ years) --------------------

    'tm-s1': {  # TM-S1: Strategic Trade-off
        'immediate-revenue': 2,  # A (2): Short-term focus
        'long-term-strategy': 4,  # B (4): Strategic thinking
        'engineering-preference': 1,  # C (1): Biased
        'ceo-urgency': 1   # D (1): Reactive
    },

    'tm-s2': {  # TM-S2: Capital Allocation
        'hire-aggressively': 2,  # A (2): Single lever
        'invest-ai': 1,  # B (1): Over-concentration
        'allocate-roi': 4,  # C (4): ROI-based allocation
        'preserve-capital': 1   # D (1): Risk-averse
    },

    'tm-s3': {  # TM-S3: Engineering as Competitive Advantage
        'complex-architecture': 2,  # A (2): Technical focus
        'switching-cost-value': 4,  # B (4): Business moat thinking
        'high-infra-cost': 1,  # C (1): Wrong understanding
        'large-team': 1   # D (1): Wrong understanding
    },

    'tm-s4': {  # TM-S4: Long-Term Scalability - Used for Ownership
        'overbuild-now': 2,  # A (2): Premature optimization
        'modular-incremental': 4,  # B (4): Pragmatic scaling
        'ignore-projections': 1,  # C (1): Short-sighted
        'freeze-innovation': 1   # D (1): Stagnation
    },

    'tm-s5': {  # TM-S5: AI as Strategy - Used for AI Fluency
        'industry-trend': 1,  # A (1): Follower
        'strategic-differentiation': 4,  # B (4): Strategic thinking
        'investor-excitement': 1,  # C (1): Wrong driver
        'team-expertise': 2   # D (2): Capability focus only
    },

    'tm-s6': {  # TM-S6: Portfolio Balancing
        'all-features': 2,  # A (2): Growth bias
        'balanced-allocation': 4,  # B (4): Strategic balance
        'mostly-refactoring': 1,  # C (1): Over-optimization
        'engineering-interest': 1   # D (1): Wrong driver
    }
}

