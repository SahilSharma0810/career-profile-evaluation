// Configuration for Business <> AI MBA Quiz
import React from 'react';
import {
  Briefcase,
  ChartBar,
  TrendUp,
  MegaphoneSimple,
  Package,
  Lightbulb,
  Clock,
  Timer,
  Trophy,
  Target,
  CurrencyInr,
  Rocket,
  ChartLineUp,
  Users,
  Database,
  PresentationChart,
  ShoppingCart,
  Storefront,
  Buildings,
  Code,
  CheckCircle,
  XCircle,
  Path,
  Lightning,
  Brain,
  Gear
} from 'phosphor-react';

// Screen 1: Current Role/Background + Experience
export const MBA_INTAKE_SCREEN_1 = {
  id: 'current-role',
  initialChatText: "Welcome! Let's understand your professional background to personalize your Business <> AI assessment.",
  questions: [
    {
      id: 'currentRole',
      question: "What's your current role or background?",
      options: [
        { value: 'pm', label: 'Product / Program / Project Manager', icon: <Briefcase size={24} weight="duotone" /> },
        { value: 'finance', label: 'Finance / Business Analyst', icon: <ChartBar size={24} weight="duotone" /> },
        { value: 'sales', label: 'Sales / Growth / Revenue roles', icon: <TrendUp size={24} weight="duotone" /> },
        { value: 'marketing', label: 'Marketing / Brand / Performance Marketing', icon: <MegaphoneSimple size={24} weight="duotone" /> },
        { value: 'operations', label: 'Operations / Supply Chain / Strategy', icon: <Package size={24} weight="duotone" /> },
        { value: 'founder', label: 'Startup Founder / Entrepreneur', icon: <Lightbulb size={24} weight="duotone" /> },
        { value: 'tech', label: 'Engineering / DevOps / Tech Roles', icon: <Code size={24} weight="duotone" /> }
      ]
    },
    {
      id: 'experience',
      question: 'How many years of total work experience do you have?',
      options: [
        { value: '0-1', label: '0–1 year', icon: <Clock size={24} weight="duotone" /> },
        { value: '1-3', label: '1–3 years', icon: <Timer size={24} weight="duotone" /> },
        { value: '3-6', label: '3–6 years', icon: <Briefcase size={24} weight="duotone" /> },
        { value: '6-10', label: '6–10 years', icon: <TrendUp size={24} weight="duotone" /> },
        { value: '10+', label: '10+ years', icon: <Trophy size={24} weight="duotone" /> }
      ]
    }
  ],
  chatResponseMap: {
    currentRole: {
      'pm': 'Excellent! Product managers with AI/data skills are transforming how companies build and scale products.',
      'finance': 'Great choice! Finance and analytics professionals are at the forefront of AI-driven decision making.',
      'sales': 'Perfect! Sales and growth leaders who understand AI are revolutionizing revenue operations.',
      'marketing': 'Awesome! Marketing professionals leveraging AI are seeing unprecedented ROI and scale.',
      'operations': 'Fantastic! Operations and strategy roles are being redefined by AI and automation.',
      'founder': 'Impressive! Founders who master AI have a massive competitive advantage in building and scaling.',
      'tech': 'Excellent! Engineers with business acumen and AI skills are becoming strategic leaders in tech companies.'
    },
    experience: {
      '0-1': 'Early in your career - perfect time to build strong business + AI foundations!',
      '1-3': 'Great timing! You have enough context to leverage AI strategically in your role.',
      '3-6': "You're at an inflection point. AI skills can accelerate your path to senior/leadership roles.",
      '6-10': 'Solid experience! AI + business acumen will position you for executive opportunities.',
      '10+': 'Seasoned professional! AI mastery will multiply your decades of business insight.'
    }
  }
};

// Screen 2: Career Goals (Multiselect)
export const MBA_INTAKE_SCREEN_2 = {
  id: 'career-goals',
  initialChatText: "Now let's understand what you're aiming to achieve. You can select multiple goals that matter to you.",
  questions: [
    {
      id: 'primaryGoal',
      question: 'What are your career goals? (Select up to 3)',
      isMultiselect: true,
      maxSelections: 3,
      minSelections: 1,
      options: [
        { value: 'ai-leadership', label: 'Move into a Business + AI leadership role', icon: <ChartLineUp size={24} weight="duotone" /> },
        { value: 'ai-pm', label: 'Become a Product Manager with strong AI/data skills', icon: <Target size={24} weight="duotone" /> },
        { value: 'analytics-strategy', label: 'Transition into Business Analytics / Strategy', icon: <ChartBar size={24} weight="duotone" /> },
        { value: 'improve-current', label: 'Improve performance & growth in current role', icon: <TrendUp size={24} weight="duotone" /> },
        { value: 'build-startup', label: 'Build / scale my own startup using AI', icon: <Rocket size={24} weight="duotone" /> },
        { value: 'salary-growth', label: 'Higher salary & faster career growth', icon: <CurrencyInr size={24} weight="duotone" /> }
      ]
    }
  ],
  chatResponseMap: {
    primaryGoal: {
      'ai-leadership': 'Ambitious! AI-fluent business leaders are the most sought-after talent right now.',
      'ai-pm': 'Smart choice! AI-native PMs command premium salaries and drive critical decisions.',
      'analytics-strategy': 'Excellent path! Strategy roles increasingly require AI/data fluency for impact.',
      'improve-current': 'Practical! AI can 10x your effectiveness and make you indispensable in your role.',
      'build-startup': 'Bold! Founders who master AI have unfair advantages in speed, scale, and capital efficiency.',
      'salary-growth': 'Valid goal! Business + AI professionals command 30-50% salary premiums.'
    }
  }
};

// Role-specific deep-dive questions
// NEW STRUCTURE: Questions are now organized by role AND experience level
// Structure: { 'role': { '0-3': [screens...], '3-8': [screens...], '8+': [screens...] } }
// Experience mapping: '0-1'/'1-3' -> '0-3', '3-6'/'6-10' -> '3-8', '10+' -> '8+'
export const MBA_ROLE_SPECIFIC_SCREENS = {
  'pm': {
    // 0-3 years experience (Entry level)
    '0-3': [
      // Screen 1: PM-E1, PM-E2
      {
        id: 'pm-screen-1',
        initialChatText: "Let's dive into your product thinking and decision-making approach.",
        questions: [
          {
            id: 'pm-e1',
            question: 'Two weeks after launching a new onboarding feature, you notice that overall sign-ups are stable, but activation rate has dropped from 62% to 47%. Leadership is asking for quick fixes. What do you do first?',
            helperText: 'Tests data-driven problem-solving',
            isScenario: true,
            options: [
              { value: 'add-nudges', label: 'Add nudges and tooltips to push users forward', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'break-down-funnel', label: 'Break down the funnel step-by-step and identify exact drop-off points', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'ask-support', label: 'Ask support if they\'ve received complaints', icon: <Users size={24} weight="duotone" /> },
              { value: 'roll-back', label: 'Roll back the feature to restore previous flow', icon: <XCircle size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'pm-e2',
            question: 'Your sales team insists that customers need a dashboard export feature urgently. No data currently tracks how many users are requesting this. What would you do?',
            helperText: 'Tests user-centric discovery',
            isScenario: true,
            options: [
              { value: 'add-to-sprint', label: 'Immediately add it to next sprint to support sales', icon: <Rocket size={24} weight="duotone" /> },
              { value: 'interview-churned', label: 'Interview recent churned customers to validate pain', icon: <Users size={24} weight="duotone" /> },
              { value: 'ship-lightweight', label: 'Ship a lightweight version quickly to test usage', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'benchmark-competitors', label: 'Benchmark competitors and replicate best practice', icon: <ChartBar size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 2: PM-E3, PM-E4
      {
        id: 'pm-screen-2',
        initialChatText: "Now let's explore your prioritization and measurement thinking.",
        questions: [
          {
            id: 'pm-e3',
            question: 'You have 3 competing features: One improves user retention, one requested by enterprise client, one improves internal efficiency. Resources allow only one this sprint. How do you decide?',
            helperText: 'Tests data-driven prioritization',
            isScenario: true,
            options: [
              { value: 'choose-enterprise', label: 'Choose enterprise client request', icon: <Buildings size={24} weight="duotone" /> },
              { value: 'scoring-framework', label: 'Use a structured scoring framework (impact, effort, risk)', icon: <Target size={24} weight="duotone" /> },
              { value: 'ask-leadership', label: 'Ask leadership to decide', icon: <Users size={24} weight="duotone" /> },
              { value: 'pick-retention', label: 'Pick retention because growth is important', icon: <TrendUp size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'pm-e4',
            question: 'You launched a feature meant to improve engagement. After 30 days, overall usage increased but retention stayed flat. What does this signal?',
            helperText: 'Tests strategic measurement thinking',
            isScenario: true,
            options: [
              { value: 'feature-successful', label: 'Feature is successful', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'cohort-analysis', label: 'Need deeper cohort analysis', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'increase-marketing', label: 'Increase marketing push', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'add-more-features', label: 'Add more features around it', icon: <Code size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 3: PM-E5, PM-E6
      {
        id: 'pm-screen-3',
        initialChatText: "Finally, let's assess your AI leverage and strategic thinking.",
        questions: [
          {
            id: 'pm-e5',
            question: 'You spend 6 hours weekly synthesizing user feedback and converting it into insights. How would you use AI here?',
            helperText: 'Tests AI literacy and workflow optimization',
            options: [
              { value: 'auto-summarize', label: 'Auto-summarize feedback themes and cluster patterns', icon: <Brain size={24} weight="duotone" /> },
              { value: 'generate-prd', label: 'Generate PRD drafts from raw notes', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'respond-stakeholders', label: 'Use AI to respond to stakeholders', icon: <Users size={24} weight="duotone" /> },
              { value: 'not-use-ai', label: 'Not use AI; prefer manual review', icon: <Gear size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'pm-e6',
            question: 'Quantitative data shows high feature engagement, but user interviews reveal frustration and confusion. What\'s your next step?',
            helperText: 'Tests strategic thinking and data synthesis',
            isScenario: true,
            options: [
              { value: 'ignore-interviews', label: 'Ignore interviews since data is strong', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'segment-analyze', label: 'Segment users and analyze qualitative patterns deeper', icon: <Users size={24} weight="duotone" /> },
              { value: 'redesign-immediately', label: 'Redesign immediately', icon: <Code size={24} weight="duotone" /> },
              { value: 'wait-month', label: 'Wait another month', icon: <Clock size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 3-8 years experience (Mid level)
    '3-8': [
      // Screen 1: PM-M1, PM-M2
      {
        id: 'pm-screen-1',
        initialChatText: "Let's dive into your product strategy and leadership approach.",
        questions: [
          {
            id: 'pm-m1',
            question: 'Your product\'s monthly active users have grown 35% YoY, but revenue growth is flat. Leadership wants to introduce aggressive monetization (paywalls + upsells). What do you do first?',
            helperText: 'Tests product strategy and monetization thinking',
            isScenario: true,
            options: [
              { value: 'implement-monetization', label: 'Implement monetization quickly to capture value', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'ltv-analysis', label: 'Run cohort-level LTV analysis before changing pricing', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'upsell-power-users', label: 'Add upsell prompts to power users only', icon: <Target size={24} weight="duotone" /> },
              { value: 'delay-monetization', label: 'Delay monetization to protect growth', icon: <TrendUp size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'pm-m2',
            question: 'Engineering says technical debt is slowing delivery by 40%. Sales says missing features are hurting enterprise deals. Resources are limited. What do you do?',
            helperText: 'Tests leadership and conflict resolution',
            isScenario: true,
            options: [
              { value: 'prioritize-enterprise', label: 'Prioritize enterprise features', icon: <Buildings size={24} weight="duotone" /> },
              { value: 'prioritize-refactor', label: 'Prioritize refactor', icon: <Code size={24} weight="duotone" /> },
              { value: 'quantify-phased', label: 'Quantify impact of both and create phased roadmap', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'escalate-leadership', label: 'Escalate to leadership', icon: <Users size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 2: PM-M3, PM-M4
      {
        id: 'pm-screen-2',
        initialChatText: "Now let's explore your strategic alignment and AI approach.",
        questions: [
          {
            id: 'pm-m3',
            question: 'Different teams track different KPIs (engagement, revenue, feature adoption). Growth discussions feel fragmented. What do you do?',
            helperText: 'Tests strategic thinking and alignment',
            isScenario: true,
            options: [
              { value: 'standardize-reporting', label: 'Standardize reporting format', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'north-star-metric', label: 'Define a single north-star metric tied to long-term value', icon: <Target size={24} weight="duotone" /> },
              { value: 'teams-optimize', label: 'Let teams optimize independently', icon: <Users size={24} weight="duotone" /> },
              { value: 'add-dashboards', label: 'Add more dashboards', icon: <PresentationChart size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'pm-m4',
            question: 'CEO wants to announce an AI feature at upcoming event. No validated use-case yet. You:',
            helperText: 'Tests AI literacy and strategic pushback',
            isScenario: true,
            options: [
              { value: 'build-wrapper', label: 'Build a lightweight AI wrapper for optics', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'test-workflow', label: 'Identify 1 high-friction workflow and test AI value', icon: <Brain size={24} weight="duotone" /> },
              { value: 'announce-roadmap', label: 'Announce roadmap without building', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'push-back', label: 'Push back entirely', icon: <XCircle size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 3: PM-M5, PM-M6
      {
        id: 'pm-screen-3',
        initialChatText: "Finally, let's assess your data-driven approach and strategic reflection.",
        questions: [
          {
            id: 'pm-m5',
            question: 'Your activation is strong, but 90-day retention is declining gradually. What is your first structured move?',
            helperText: 'Tests data-driven problem-solving',
            isScenario: true,
            options: [
              { value: 'add-engagement', label: 'Add new engagement features', icon: <Code size={24} weight="duotone" /> },
              { value: 'churned-analysis', label: 'Run churned-user interviews + behavioral cohort analysis', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'increase-push', label: 'Increase push notifications', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'offer-discounts', label: 'Offer discounts', icon: <CurrencyInr size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'pm-m6',
            question: 'A major feature failed to move the primary metric despite positive internal reviews. Root cause most likely?',
            helperText: 'Tests product strategy and problem discovery',
            isScenario: true,
            options: [
              { value: 'weak-discovery', label: 'Weak problem discovery', icon: <Users size={24} weight="duotone" /> },
              { value: 'poor-marketing', label: 'Poor marketing push', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'engineering-delays', label: 'Engineering delays', icon: <Code size={24} weight="duotone" /> },
              { value: 'competitive-timing', label: 'Competitive timing', icon: <Clock size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 8+ years experience (Senior level)
    '8+': [
      // Screen 1: PM-S1, PM-S2
      {
        id: 'pm-screen-1',
        initialChatText: "Let's dive into your portfolio strategy and capital allocation thinking.",
        questions: [
          {
            id: 'pm-s1',
            question: 'Board mandates 2x revenue in 12 months. You lead a multi-product portfolio. Your first action:',
            helperText: 'Tests product strategy and portfolio thinking',
            isScenario: true,
            options: [
              { value: 'increase-pricing', label: 'Increase pricing across products', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'identify-ltv-icp', label: 'Identify highest LTV ICP and re-focus portfolio', icon: <Target size={24} weight="duotone" /> },
              { value: 'launch-features', label: 'Launch 3 new features', icon: <Code size={24} weight="duotone" /> },
              { value: 'expand-marketing', label: 'Expand marketing budget', icon: <MegaphoneSimple size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'pm-s2',
            question: 'One product has strong engagement but low margin and weak strategic alignment. You:',
            helperText: 'Tests capital allocation thinking',
            isScenario: true,
            options: [
              { value: 'continue-engagement', label: 'Continue due to engagement', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'improve-monetization', label: 'Improve monetization', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'reevaluate-fit', label: 'Re-evaluate strategic fit + opportunity cost', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'shut-down', label: 'Shut it down immediately', icon: <XCircle size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 2: PM-S3, PM-S4
      {
        id: 'pm-screen-2',
        initialChatText: "Now let's explore your AI strategy and organizational leadership.",
        questions: [
          {
            id: 'pm-s3',
            question: 'Competitors are adding similar AI features rapidly. True defensibility comes from:',
            helperText: 'Tests AI literacy and strategic moat thinking',
            options: [
              { value: 'better-ux', label: 'Better UX', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'faster-releases', label: 'Faster releases', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'proprietary-data', label: 'Proprietary data feedback loops', icon: <Database size={24} weight="duotone" /> },
              { value: 'larger-model', label: 'Larger model size', icon: <Brain size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'pm-s4',
            question: 'Product velocity slows as org grows from 20 to 120 people. Root strategic issue likely:',
            helperText: 'Tests leadership and organizational design',
            isScenario: true,
            options: [
              { value: 'more-meetings', label: 'More meetings', icon: <Users size={24} weight="duotone" /> },
              { value: 'lack-ownership', label: 'Lack of clear ownership structure', icon: <Target size={24} weight="duotone" /> },
              { value: 'slower-engineers', label: 'Slower engineers', icon: <Code size={24} weight="duotone" /> },
              { value: 'poor-tooling', label: 'Poor tooling', icon: <Gear size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 3: PM-S5, PM-S6
      {
        id: 'pm-screen-3',
        initialChatText: "Finally, let's assess your strategic thinking and failure reflection.",
        questions: [
          {
            id: 'pm-s5',
            question: 'Company can expand into adjacent market OR deepen core product. You choose based on:',
            helperText: 'Tests strategic thinking and competitive advantage',
            isScenario: true,
            options: [
              { value: 'tam-size', label: 'TAM size', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'core-competency', label: 'Core competency + execution advantage', icon: <Target size={24} weight="duotone" /> },
              { value: 'investor-pressure', label: 'Investor pressure', icon: <Users size={24} weight="duotone" /> },
              { value: 'trend-momentum', label: 'Trend momentum', icon: <TrendUp size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'pm-s6',
            question: 'In hindsight, your most expensive mistake would likely come from:',
            helperText: 'Tests strategic thinking and failure patterns',
            isScenario: true,
            options: [
              { value: 'wrong-leadership', label: 'Hiring wrong leadership', icon: <Users size={24} weight="duotone" /> },
              { value: 'market-timing', label: 'Misreading market timing', icon: <Clock size={24} weight="duotone" /> },
              { value: 'underinvest-data', label: 'Underinvesting in data infrastructure', icon: <Database size={24} weight="duotone" /> },
              { value: 'feature-overbuilding', label: 'Feature overbuilding', icon: <Code size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ]
  },

  'finance': {
    // 0-3 years experience (Entry level)
    '0-3': [
      // Screen 1: FM-E1, FM-E2
      {
        id: 'finance-screen-1',
        initialChatText: "Let's dive into your financial analysis and business partnering approach.",
        questions: [
          {
            id: 'fm-e1',
            question: 'You created a revenue forecast for the quarter. Actual revenue came 18% lower than projected. Your manager asks what happened. What is your first step?',
            helperText: 'Tests financial modeling and analytical thinking',
            isScenario: true,
            options: [
              { value: 'assume-sales-underperformed', label: 'Assume sales underperformed and report that', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'adjust-forecast', label: 'Adjust next quarter\'s forecast without analysis', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'revisit-assumptions', label: 'Revisit assumptions, drivers, and variance breakdown (volume, price, churn)', icon: <Target size={24} weight="duotone" /> },
              { value: 'blame-market', label: 'Blame market conditions broadly', icon: <XCircle size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'fm-e2',
            question: 'Sales leadership pushes for higher targets, but your analysis shows limited capacity. How do you respond?',
            helperText: 'Tests business partnering and influence',
            isScenario: true,
            options: [
              { value: 'agree-maintain-alignment', label: 'Agree to maintain alignment', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'reject-proposal', label: 'Reject proposal immediately', icon: <XCircle size={24} weight="duotone" /> },
              { value: 'share-model-scenarios', label: 'Share model assumptions and scenario analysis to align on realistic targets', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'escalate-cfo', label: 'Escalate to CFO', icon: <Users size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 2: FM-E3, FM-E4
      {
        id: 'finance-screen-2',
        initialChatText: "Now let's explore your data integrity and AI adoption.",
        questions: [
          {
            id: 'fm-e3',
            question: 'You notice revenue numbers in dashboard don\'t match finance sheet. What do you do?',
            helperText: 'Tests data integrity and rigor',
            isScenario: true,
            options: [
              { value: 'ignore-differences', label: 'Ignore minor differences', icon: <XCircle size={24} weight="duotone" /> },
              { value: 'update-sheet', label: 'Update your sheet to match dashboard', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'trace-reconcile', label: 'Trace source of discrepancy and reconcile data before reporting', icon: <Target size={24} weight="duotone" /> },
              { value: 'send-disclaimer', label: 'Send numbers with disclaimer', icon: <CheckCircle size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'fm-e4',
            question: 'You spend 6 hours weekly updating Excel reports manually. Best approach?',
            helperText: 'Tests AI literacy and automation thinking',
            isScenario: true,
            options: [
              { value: 'continue-manual', label: 'Continue manually to avoid risk', icon: <Gear size={24} weight="duotone" /> },
              { value: 'ask-intern', label: 'Ask intern to do it', icon: <Users size={24} weight="duotone" /> },
              { value: 'explore-automation', label: 'Explore automation using Excel macros / BI tools / AI', icon: <Brain size={24} weight="duotone" /> },
              { value: 'reduce-reporting', label: 'Reduce reporting depth', icon: <ChartBar size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 3: FM-E5, FM-E6
      {
        id: 'finance-screen-3',
        initialChatText: "Finally, let's assess your strategic thinking and leadership.",
        questions: [
          {
            id: 'fm-e5',
            question: 'Company needs to cut 10% cost. What is your approach?',
            helperText: 'Tests strategic thinking and cost analysis',
            isScenario: true,
            options: [
              { value: 'cut-equally', label: 'Cut equally across departments', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'cut-largest', label: 'Cut largest cost center first', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'analyze-roi-strategic', label: 'Analyze ROI, strategic importance, and variable vs fixed cost', icon: <Target size={24} weight="duotone" /> },
              { value: 'freeze-hiring', label: 'Freeze hiring only', icon: <Users size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'fm-e6',
            question: 'In a business review, teams disagree on spending allocation.',
            helperText: 'Tests leadership and business partnering',
            isScenario: true,
            options: [
              { value: 'stay-silent', label: 'Stay silent', icon: <XCircle size={24} weight="duotone" /> },
              { value: 'support-finance', label: 'Support finance position only', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'facilitate-data-scenarios', label: 'Facilitate discussion using data-backed scenarios', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'defer-decision', label: 'Defer decision', icon: <Clock size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 3-8 years experience (Mid level)
    '3-8': [
      // Screen 1: FM-M1, FM-M2
      {
        id: 'finance-screen-1',
        initialChatText: "Let's assess your financial modeling and business partnering depth.",
        questions: [
          {
            id: 'fm-m1',
            question: 'You\'re asked to build a 3-year projection for a new business line. Best approach?',
            helperText: 'Tests financial modeling sophistication',
            isScenario: true,
            options: [
              { value: 'extend-growth', label: 'Extend current year numbers with growth %', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'copy-competitor', label: 'Copy competitor assumptions', icon: <Buildings size={24} weight="duotone" /> },
              { value: 'driver-based-scenarios', label: 'Build driver-based model (acquisition, pricing, churn, cost structure) with scenarios', icon: <Target size={24} weight="duotone" /> },
              { value: 'optimistic-only', label: 'Present optimistic case only', icon: <TrendUp size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'fm-m2',
            question: 'Product wants to launch a feature with unclear monetization.',
            helperText: 'Tests business partnering and strategic thinking',
            isScenario: true,
            options: [
              { value: 'block-uncertainty', label: 'Block it due to uncertainty', icon: <XCircle size={24} weight="duotone" /> },
              { value: 'approve-no-analysis', label: 'Approve without analysis', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'build-business-case', label: 'Build business case with cost assumptions, revenue scenarios, and risk analysis', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'delay-indefinitely', label: 'Delay decision indefinitely', icon: <Clock size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 2: FM-M3, FM-M4
      {
        id: 'finance-screen-2',
        initialChatText: "Now let's explore your forecasting approach and data governance.",
        questions: [
          {
            id: 'fm-m3',
            question: 'Market conditions are volatile. How do you forecast?',
            helperText: 'Tests strategic financial planning',
            isScenario: true,
            options: [
              { value: 'single-point', label: 'Single-point forecast', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'conservative-only', label: 'Conservative estimate only', icon: <Target size={24} weight="duotone" /> },
              { value: 'scenarios-sensitivity', label: 'Base, upside, and downside scenarios with sensitivity analysis', icon: <Path size={24} weight="duotone" /> },
              { value: 'wait-stability', label: 'Wait for stability', icon: <Clock size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'fm-m4',
            question: 'Multiple teams input financial data. Best governance approach?',
            helperText: 'Tests data integrity and process design',
            isScenario: true,
            options: [
              { value: 'trust-submissions', label: 'Trust team submissions', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'audit-randomly', label: 'Audit randomly', icon: <Target size={24} weight="duotone" /> },
              { value: 'validation-reconciliation', label: 'Implement validation checks, reconciliation processes, and ownership clarity', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'centralize-manual', label: 'Centralize everything manually', icon: <Gear size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 3: FM-M5, FM-M6
      {
        id: 'finance-screen-3',
        initialChatText: "Finally, let's assess your AI adoption and executive influence.",
        questions: [
          {
            id: 'fm-m5',
            question: 'AI tools can automate variance analysis.',
            helperText: 'Tests AI literacy and validation thinking',
            isScenario: true,
            options: [
              { value: 'avoid-ai-risk', label: 'Avoid AI due to risk', icon: <XCircle size={24} weight="duotone" /> },
              { value: 'use-without-validation', label: 'Use AI outputs without validation', icon: <Brain size={24} weight="duotone" /> },
              { value: 'ai-validate-outputs', label: 'Use AI to generate insights but validate outputs before decision-making', icon: <Target size={24} weight="duotone" /> },
              { value: 'replace-analysts', label: 'Replace analysts fully', icon: <Users size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'fm-m6',
            question: 'CEO wants aggressive expansion but cash runway is limited.',
            helperText: 'Tests leadership and executive business partnering',
            isScenario: true,
            options: [
              { value: 'approve-expansion', label: 'Approve expansion', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'oppose-no-data', label: 'Oppose without data', icon: <XCircle size={24} weight="duotone" /> },
              { value: 'present-scenarios-risk', label: 'Present scenario models, risk exposure, and capital strategy options', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'stay-neutral', label: 'Stay neutral', icon: <ChartBar size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 8+ years experience (Senior level)
    '8+': [
      // Screen 1: FM-S1, FM-S2
      {
        id: 'finance-screen-1',
        initialChatText: "Let's assess your strategic capital allocation and M&A thinking.",
        questions: [
          {
            id: 'fm-s1',
            question: 'You manage portfolio-level budgeting across divisions. What defines strong allocation?',
            helperText: 'Tests strategic thinking and capital allocation',
            isScenario: true,
            options: [
              { value: 'even-distribution', label: 'Even distribution', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'prioritize-largest', label: 'Prioritize largest teams', icon: <Users size={24} weight="duotone" /> },
              { value: 'allocate-roi-strategic', label: 'Allocate based on ROI, strategic positioning, and long-term value creation', icon: <Target size={24} weight="duotone" /> },
              { value: 'protect-historical', label: 'Protect historical budgets', icon: <CheckCircle size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'fm-s2',
            question: 'Company is considering acquiring a smaller competitor. What is your approach?',
            helperText: 'Tests financial modeling and strategic thinking',
            isScenario: true,
            options: [
              { value: 'focus-revenue-synergy', label: 'Focus only on revenue synergy', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'look-ebitda', label: 'Look only at EBITDA multiple', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'evaluate-comprehensive', label: 'Evaluate synergy, integration cost, cultural fit, risk, and long-term value', icon: <Target size={24} weight="duotone" /> },
              { value: 'follow-board', label: 'Follow board preference', icon: <Users size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 2: FM-S3, FM-S4
      {
        id: 'finance-screen-2',
        initialChatText: "Now let's explore your finance transformation and board-level communication.",
        questions: [
          {
            id: 'fm-s3',
            question: 'Finance processes are manual and fragmented.',
            helperText: 'Tests leadership and AI literacy',
            isScenario: true,
            options: [
              { value: 'add-headcount', label: 'Add more headcount', icon: <Users size={24} weight="duotone" /> },
              { value: 'maintain-status', label: 'Maintain status quo', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'drive-automation-governance', label: 'Drive automation roadmap, data governance, and KPI standardization', icon: <Brain size={24} weight="duotone" /> },
              { value: 'outsource-everything', label: 'Outsource everything', icon: <Buildings size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'fm-s4',
            question: 'Board challenges your forecast assumptions.',
            helperText: 'Tests executive leadership and strategic clarity',
            isScenario: true,
            options: [
              { value: 'defend-aggressively', label: 'Defend aggressively', icon: <XCircle size={24} weight="duotone" /> },
              { value: 'revise-immediately', label: 'Revise immediately', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'walk-through-transparent', label: 'Walk through assumptions, sensitivities, and risk buffers transparently', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'defer-ceo', label: 'Defer to CEO', icon: <Users size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 3: FM-S5, FM-S6
      {
        id: 'finance-screen-3',
        initialChatText: "Finally, let's assess your enterprise risk management and team development.",
        questions: [
          {
            id: 'fm-s5',
            question: 'Macroeconomic downturn impacts demand projections. Best response?',
            helperText: 'Tests strategic thinking and risk management',
            isScenario: true,
            options: [
              { value: 'freeze-investments', label: 'Freeze all investments', icon: <XCircle size={24} weight="duotone" /> },
              { value: 'ignore-long-term', label: 'Ignore long-term vision', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'rebalance-strategic', label: 'Rebalance cost structure, preserve cash, and protect strategic bets', icon: <Target size={24} weight="duotone" /> },
              { value: 'reduce-analytics', label: 'Reduce analytics budget', icon: <TrendUp size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'fm-s6',
            question: 'Finance team is strong technically but weak in business influence.',
            helperText: 'Tests leadership and business partnering',
            isScenario: true,
            options: [
              { value: 'focus-technical', label: 'Focus only on technical upskilling', icon: <Gear size={24} weight="duotone" /> },
              { value: 'hire-new-team', label: 'Hire new team entirely', icon: <Users size={24} weight="duotone" /> },
              { value: 'develop-storytelling', label: 'Develop storytelling, business acumen, and cross-functional exposure', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'increase-compliance', label: 'Increase compliance controls', icon: <CheckCircle size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ]
  },

  // Sales, Marketing, Operations, and Founder roles fully implemented
  // Student and Other roles remain as placeholders (decision needed on approach)
  'sales': {
    // 0-3 years experience (Entry level)
    '0-3': [
    // Screen 3: Sales Questions 1-2
      {
        id: 'sales-screen-1',
        initialChatText: "Let's dive into your sales approach and revenue thinking.",
        questions: [
          {
            id: 'sales-pipeline-reality',
            question: 'Your sales pipeline coverage is 3× the target, but your close rate is dropping. What would be your first move?',
            helperText: 'Tests revenue maturity',
            isScenario: true,
            options: [
              { value: 'push-volume', label: 'Push more volume into the pipeline', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'tighten-qualification', label: 'Tighten lead qualification criteria', icon: <Target size={24} weight="duotone" /> },
              { value: 'analyze-winloss', label: 'Analyze win/loss patterns deeply', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'change-pricing', label: 'Change pricing or packaging structure', icon: <CurrencyInr size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'sales-deal-stuck',
            question: 'A large deal is stuck at final approval stage for weeks. What do you do?',
            helperText: 'Tests pattern recognition',
            isScenario: true,
            options: [
              { value: 'increase-followups', label: 'Increase follow-up frequency with the prospect', icon: <Clock size={24} weight="duotone" /> },
              { value: 'escalate-internally', label: 'Escalate to senior leadership internally', icon: <Users size={24} weight="duotone" /> },
              { value: 'analyze-blockers', label: 'Analyze historical blockers from similar deals', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'change-structure', label: 'Restructure the deal terms', icon: <Path size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Sales Questions 3-4
      {
        id: 'sales-screen-2',
        initialChatText: "Now let's explore your AI application and systems thinking.",
        questions: [
          {
            id: 'sales-ai-usage',
            question: 'Where do you think AI actually helps and adds value in your sales work today?',
            helperText: 'Tests senior AI usage',
            options: [
              { value: 'email-drafts', label: 'Email drafts - writing prospect communications', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'call-summaries', label: 'Call summaries - documenting conversations', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'deal-risk', label: 'Deal risk prediction - forecasting win probability', icon: <Target size={24} weight="duotone" /> },
              { value: 'pricing-optimization', label: 'Pricing and discount optimization strategies', icon: <CurrencyInr size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'sales-target-miss',
            question: 'You missed your sales quota despite strong activity metrics (calls, meetings, demos). What do you think is the root cause?',
            helperText: 'Tests systems thinking',
            isScenario: true,
            options: [
              { value: 'lead-quality', label: 'Poor lead quality from marketing', icon: <Target size={24} weight="duotone" /> },
              { value: 'icp-mismatch', label: 'ICP (Ideal Customer Profile) mismatch', icon: <Users size={24} weight="duotone" /> },
              { value: 'sales-motion', label: 'Flawed sales motion or process design', icon: <Path size={24} weight="duotone" /> },
              { value: 'market-conditions', label: 'External market conditions', icon: <ChartLineUp size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Sales Questions 5-6
      {
        id: 'sales-screen-3',
        initialChatText: "Finally, let's assess your data maturity and ownership level.",
        questions: [
          {
            id: 'sales-forecasting',
            question: 'What do you think your sales forecast is primarily based on today?',
            helperText: 'Tests data maturity',
            options: [
              { value: 'rep-judgment', label: 'Rep judgment - sales team intuition and estimates', icon: <Users size={24} weight="duotone" /> },
              { value: 'weighted-pipeline', label: 'Weighted pipeline - stage-based probability scoring', icon: <Target size={24} weight="duotone" /> },
              { value: 'historical-patterns', label: 'Historical patterns - past performance trends', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'predictive-models', label: 'Predictive models - AI-driven forecasting', icon: <Brain size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'sales-ownership',
            question: 'In your current sales role, what do you think you own and are accountable for?',
            helperText: 'Tests seniority',
            options: [
              { value: 'activities', label: 'Activities - calls, meetings, and demos', icon: <Clock size={24} weight="duotone" /> },
              { value: 'revenue-number', label: 'Revenue number - personal quota achievement', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'team-number', label: 'Team number - managing team quota', icon: <Users size={24} weight="duotone" /> },
              { value: 'region-business', label: 'Region or business unit performance', icon: <Buildings size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 3-8 years experience (Mid level) - using same questions for now
    '3-8': [
      // Screen 3: Sales Questions 1-2
      {
        id: 'sales-screen-1',
        initialChatText: "Let's dive into your sales approach and revenue thinking.",
        questions: [
          {
            id: 'sales-pipeline-reality',
            question: 'Your sales pipeline coverage is 3× the target, but your close rate is dropping. What would be your first move?',
            helperText: 'Tests revenue maturity',
            isScenario: true,
            options: [
              { value: 'push-volume', label: 'Push more volume into the pipeline', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'tighten-qualification', label: 'Tighten lead qualification criteria', icon: <Target size={24} weight="duotone" /> },
              { value: 'analyze-winloss', label: 'Analyze win/loss patterns deeply', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'change-pricing', label: 'Change pricing or packaging structure', icon: <CurrencyInr size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'sales-deal-stuck',
            question: 'A large deal is stuck at final approval stage for weeks. What do you do?',
            helperText: 'Tests pattern recognition',
            isScenario: true,
            options: [
              { value: 'increase-followups', label: 'Increase follow-up frequency with the prospect', icon: <Clock size={24} weight="duotone" /> },
              { value: 'escalate-internally', label: 'Escalate to senior leadership internally', icon: <Users size={24} weight="duotone" /> },
              { value: 'analyze-blockers', label: 'Analyze historical blockers from similar deals', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'change-structure', label: 'Restructure the deal terms', icon: <Path size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Sales Questions 3-4
      {
        id: 'sales-screen-2',
        initialChatText: "Now let's explore your AI application and systems thinking.",
        questions: [
          {
            id: 'sales-ai-usage',
            question: 'Where do you think AI actually helps and adds value in your sales work today?',
            helperText: 'Tests senior AI usage',
            options: [
              { value: 'email-drafts', label: 'Email drafts - writing prospect communications', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'call-summaries', label: 'Call summaries - documenting conversations', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'deal-risk', label: 'Deal risk prediction - forecasting win probability', icon: <Target size={24} weight="duotone" /> },
              { value: 'pricing-optimization', label: 'Pricing and discount optimization strategies', icon: <CurrencyInr size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'sales-target-miss',
            question: 'You missed your sales quota despite strong activity metrics (calls, meetings, demos). What do you think is the root cause?',
            helperText: 'Tests systems thinking',
            isScenario: true,
            options: [
              { value: 'lead-quality', label: 'Poor lead quality from marketing', icon: <Target size={24} weight="duotone" /> },
              { value: 'icp-mismatch', label: 'ICP (Ideal Customer Profile) mismatch', icon: <Users size={24} weight="duotone" /> },
              { value: 'sales-motion', label: 'Flawed sales motion or process design', icon: <Path size={24} weight="duotone" /> },
              { value: 'market-conditions', label: 'External market conditions', icon: <ChartLineUp size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Sales Questions 5-6
      {
        id: 'sales-screen-3',
        initialChatText: "Finally, let's assess your data maturity and ownership level.",
        questions: [
          {
            id: 'sales-forecasting',
            question: 'What do you think your sales forecast is primarily based on today?',
            helperText: 'Tests data maturity',
            options: [
              { value: 'rep-judgment', label: 'Rep judgment - sales team intuition and estimates', icon: <Users size={24} weight="duotone" /> },
              { value: 'weighted-pipeline', label: 'Weighted pipeline - stage-based probability scoring', icon: <Target size={24} weight="duotone" /> },
              { value: 'historical-patterns', label: 'Historical patterns - past performance trends', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'predictive-models', label: 'Predictive models - AI-driven forecasting', icon: <Brain size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'sales-ownership',
            question: 'In your current sales role, what do you think you own and are accountable for?',
            helperText: 'Tests seniority',
            options: [
              { value: 'activities', label: 'Activities - calls, meetings, and demos', icon: <Clock size={24} weight="duotone" /> },
              { value: 'revenue-number', label: 'Revenue number - personal quota achievement', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'team-number', label: 'Team number - managing team quota', icon: <Users size={24} weight="duotone" /> },
              { value: 'region-business', label: 'Region or business unit performance', icon: <Buildings size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 8+ years experience (Senior level) - using same questions for now
    '8+': [
      // Screen 3: Sales Questions 1-2
      {
        id: 'sales-screen-1',
        initialChatText: "Let's dive into your sales approach and revenue thinking.",
        questions: [
          {
            id: 'sales-pipeline-reality',
            question: 'Your sales pipeline coverage is 3× the target, but your close rate is dropping. What would be your first move?',
            helperText: 'Tests revenue maturity',
            isScenario: true,
            options: [
              { value: 'push-volume', label: 'Push more volume into the pipeline', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'tighten-qualification', label: 'Tighten lead qualification criteria', icon: <Target size={24} weight="duotone" /> },
              { value: 'analyze-winloss', label: 'Analyze win/loss patterns deeply', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'change-pricing', label: 'Change pricing or packaging structure', icon: <CurrencyInr size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'sales-deal-stuck',
            question: 'A large deal is stuck at final approval stage for weeks. What do you do?',
            helperText: 'Tests pattern recognition',
            isScenario: true,
            options: [
              { value: 'increase-followups', label: 'Increase follow-up frequency with the prospect', icon: <Clock size={24} weight="duotone" /> },
              { value: 'escalate-internally', label: 'Escalate to senior leadership internally', icon: <Users size={24} weight="duotone" /> },
              { value: 'analyze-blockers', label: 'Analyze historical blockers from similar deals', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'change-structure', label: 'Restructure the deal terms', icon: <Path size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Sales Questions 3-4
      {
        id: 'sales-screen-2',
        initialChatText: "Now let's explore your AI application and systems thinking.",
        questions: [
          {
            id: 'sales-ai-usage',
            question: 'Where do you think AI actually helps and adds value in your sales work today?',
            helperText: 'Tests senior AI usage',
            options: [
              { value: 'email-drafts', label: 'Email drafts - writing prospect communications', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'call-summaries', label: 'Call summaries - documenting conversations', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'deal-risk', label: 'Deal risk prediction - forecasting win probability', icon: <Target size={24} weight="duotone" /> },
              { value: 'pricing-optimization', label: 'Pricing and discount optimization strategies', icon: <CurrencyInr size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'sales-target-miss',
            question: 'You missed your sales quota despite strong activity metrics (calls, meetings, demos). What do you think is the root cause?',
            helperText: 'Tests systems thinking',
            isScenario: true,
            options: [
              { value: 'lead-quality', label: 'Poor lead quality from marketing', icon: <Target size={24} weight="duotone" /> },
              { value: 'icp-mismatch', label: 'ICP (Ideal Customer Profile) mismatch', icon: <Users size={24} weight="duotone" /> },
              { value: 'sales-motion', label: 'Flawed sales motion or process design', icon: <Path size={24} weight="duotone" /> },
              { value: 'market-conditions', label: 'External market conditions', icon: <ChartLineUp size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Sales Questions 5-6
      {
        id: 'sales-screen-3',
        initialChatText: "Finally, let's assess your data maturity and ownership level.",
        questions: [
          {
            id: 'sales-forecasting',
            question: 'What do you think your sales forecast is primarily based on today?',
            helperText: 'Tests data maturity',
            options: [
              { value: 'rep-judgment', label: 'Rep judgment - sales team intuition and estimates', icon: <Users size={24} weight="duotone" /> },
              { value: 'weighted-pipeline', label: 'Weighted pipeline - stage-based probability scoring', icon: <Target size={24} weight="duotone" /> },
              { value: 'historical-patterns', label: 'Historical patterns - past performance trends', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'predictive-models', label: 'Predictive models - AI-driven forecasting', icon: <Brain size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'sales-ownership',
            question: 'In your current sales role, what do you think you own and are accountable for?',
            helperText: 'Tests seniority',
            options: [
              { value: 'activities', label: 'Activities - calls, meetings, and demos', icon: <Clock size={24} weight="duotone" /> },
              { value: 'revenue-number', label: 'Revenue number - personal quota achievement', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'team-number', label: 'Team number - managing team quota', icon: <Users size={24} weight="duotone" /> },
              { value: 'region-business', label: 'Region or business unit performance', icon: <Buildings size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ]
  },

  'marketing': {
    // 0-3 years experience (Entry level)
    '0-3': [
    // Screen 3: Marketing Questions 1-2
      {
        id: 'marketing-screen-1',
        initialChatText: "Let's explore your marketing analytics and strategic thinking.",
        questions: [
          {
            id: 'marketing-conflicting-signals',
            question: 'Your CTR (Click-Through Rate) is up, CAC (Customer Acquisition Cost) is up, but Revenue is down. What metric do you trust most to make decisions?',
            helperText: 'Tests metric hierarchy understanding',
            isScenario: true,
            options: [
              { value: 'ctr', label: 'Trust CTR (Click-Through Rate)', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'cac', label: 'Trust CAC (Customer Acquisition Cost)', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'ltv-cac-cohort', label: 'Analyze LTV/CAC (Lifetime Value to CAC ratio) by cohort', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'revenue-attribution', label: 'Build a comprehensive revenue attribution model', icon: <Target size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'marketing-budget-shock',
            question: 'Your marketing budget is cut by 30%, but growth targets remain unchanged. What would you cut first?',
            helperText: 'Tests ROI thinking',
            isScenario: true,
            options: [
              { value: 'experiments', label: 'New experiments and testing', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'branding', label: 'Brand awareness campaigns', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'low-ltv-segments', label: 'Low LTV (Lifetime Value) customer segments', icon: <Target size={24} weight="duotone" /> },
              { value: 'agency-spend', label: 'External agency spend', icon: <CurrencyInr size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Marketing Questions 3-4
      {
        id: 'marketing-screen-2',
        initialChatText: "Now let's assess your AI maturity and pragmatic decision-making.",
        questions: [
          {
            id: 'marketing-ai-application',
            question: 'Where do you think AI creates a defensible competitive advantage in marketing?',
            helperText: 'Tests AI maturity',
            options: [
              { value: 'content-generation', label: 'Content generation - creating marketing copy at scale', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'creative-testing', label: 'Creative testing - rapid A/B experimentation', icon: <Target size={24} weight="duotone" /> },
              { value: 'audience-prediction', label: 'Audience prediction - identifying high-intent segments', icon: <Users size={24} weight="duotone" /> },
              { value: 'automated-optimization', label: 'Automated optimization loops - self-improving campaigns', icon: <Gear size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'marketing-attribution-reality',
            question: 'Your attribution data is unreliable and inconsistent. What do you do?',
            helperText: 'Tests senior pragmatism',
            isScenario: true,
            options: [
              { value: 'accept-imperfect', label: 'Accept imperfect data and move forward', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'switch-model', label: 'Switch to a different attribution model', icon: <Path size={24} weight="duotone" /> },
              { value: 'directional-insights', label: 'Build directional insights with caveats', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'ai-infer-patterns', label: 'Use AI to infer hidden patterns', icon: <Brain size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Marketing Questions 5-6
      {
        id: 'marketing-screen-3',
        initialChatText: "Finally, let's understand your systems thinking and accountability.",
        questions: [
          {
            id: 'marketing-scale-failure',
            question: 'Your growth campaign scaled initially but now has completely stalled. What do you think is the most likely reason?',
            helperText: 'Tests systems thinking',
            isScenario: true,
            options: [
              { value: 'saturation', label: 'Market saturation - ran out of addressable audience', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'messaging-mismatch', label: 'Messaging mismatch with new audience segments', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'funnel-leakage', label: 'Conversion funnel leakage at scale', icon: <Path size={24} weight="duotone" /> },
              { value: 'ops-constraints', label: 'Operations constraints (fulfillment, support)', icon: <Gear size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'marketing-leadership-metric',
            question: 'Which metric do you defend and own in leadership reviews and stakeholder meetings?',
            helperText: 'Tests senior accountability',
            options: [
              { value: 'leads', label: 'Leads - total lead volume generated', icon: <Users size={24} weight="duotone" /> },
              { value: 'cac', label: 'CAC (Customer Acquisition Cost)', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'revenue-contribution', label: 'Revenue contribution - marketing-attributed revenue', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'ltv', label: 'LTV (Lifetime Value) of acquired customers', icon: <Trophy size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 3-8 years experience (Mid level) - using same questions for now
    '3-8': [
      // Screen 3: Marketing Questions 1-2
      {
        id: 'marketing-screen-1',
        initialChatText: "Let's explore your marketing analytics and strategic thinking.",
        questions: [
          {
            id: 'marketing-conflicting-signals',
            question: 'Your CTR (Click-Through Rate) is up, CAC (Customer Acquisition Cost) is up, but Revenue is down. What metric do you trust most to make decisions?',
            helperText: 'Tests metric hierarchy understanding',
            isScenario: true,
            options: [
              { value: 'ctr', label: 'Trust CTR (Click-Through Rate)', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'cac', label: 'Trust CAC (Customer Acquisition Cost)', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'ltv-cac-cohort', label: 'Analyze LTV/CAC (Lifetime Value to CAC ratio) by cohort', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'revenue-attribution', label: 'Build a comprehensive revenue attribution model', icon: <Target size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'marketing-budget-shock',
            question: 'Your marketing budget is cut by 30%, but growth targets remain unchanged. What would you cut first?',
            helperText: 'Tests ROI thinking',
            isScenario: true,
            options: [
              { value: 'experiments', label: 'New experiments and testing', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'branding', label: 'Brand awareness campaigns', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'low-ltv-segments', label: 'Low LTV (Lifetime Value) customer segments', icon: <Target size={24} weight="duotone" /> },
              { value: 'agency-spend', label: 'External agency spend', icon: <CurrencyInr size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Marketing Questions 3-4
      {
        id: 'marketing-screen-2',
        initialChatText: "Now let's assess your AI maturity and pragmatic decision-making.",
        questions: [
          {
            id: 'marketing-ai-application',
            question: 'Where do you think AI creates a defensible competitive advantage in marketing?',
            helperText: 'Tests AI maturity',
            options: [
              { value: 'content-generation', label: 'Content generation - creating marketing copy at scale', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'creative-testing', label: 'Creative testing - rapid A/B experimentation', icon: <Target size={24} weight="duotone" /> },
              { value: 'audience-prediction', label: 'Audience prediction - identifying high-intent segments', icon: <Users size={24} weight="duotone" /> },
              { value: 'automated-optimization', label: 'Automated optimization loops - self-improving campaigns', icon: <Gear size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'marketing-attribution-reality',
            question: 'Your attribution data is unreliable and inconsistent. What do you do?',
            helperText: 'Tests senior pragmatism',
            isScenario: true,
            options: [
              { value: 'accept-imperfect', label: 'Accept imperfect data and move forward', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'switch-model', label: 'Switch to a different attribution model', icon: <Path size={24} weight="duotone" /> },
              { value: 'directional-insights', label: 'Build directional insights with caveats', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'ai-infer-patterns', label: 'Use AI to infer hidden patterns', icon: <Brain size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Marketing Questions 5-6
      {
        id: 'marketing-screen-3',
        initialChatText: "Finally, let's understand your systems thinking and accountability.",
        questions: [
          {
            id: 'marketing-scale-failure',
            question: 'Your growth campaign scaled initially but now has completely stalled. What do you think is the most likely reason?',
            helperText: 'Tests systems thinking',
            isScenario: true,
            options: [
              { value: 'saturation', label: 'Market saturation - ran out of addressable audience', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'messaging-mismatch', label: 'Messaging mismatch with new audience segments', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'funnel-leakage', label: 'Conversion funnel leakage at scale', icon: <Path size={24} weight="duotone" /> },
              { value: 'ops-constraints', label: 'Operations constraints (fulfillment, support)', icon: <Gear size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'marketing-leadership-metric',
            question: 'Which metric do you defend and own in leadership reviews and stakeholder meetings?',
            helperText: 'Tests senior accountability',
            options: [
              { value: 'leads', label: 'Leads - total lead volume generated', icon: <Users size={24} weight="duotone" /> },
              { value: 'cac', label: 'CAC (Customer Acquisition Cost)', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'revenue-contribution', label: 'Revenue contribution - marketing-attributed revenue', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'ltv', label: 'LTV (Lifetime Value) of acquired customers', icon: <Trophy size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 8+ years experience (Senior level) - using same questions for now
    '8+': [
      // Screen 3: Marketing Questions 1-2
      {
        id: 'marketing-screen-1',
        initialChatText: "Let's explore your marketing analytics and strategic thinking.",
        questions: [
          {
            id: 'marketing-conflicting-signals',
            question: 'Your CTR (Click-Through Rate) is up, CAC (Customer Acquisition Cost) is up, but Revenue is down. What metric do you trust most to make decisions?',
            helperText: 'Tests metric hierarchy understanding',
            isScenario: true,
            options: [
              { value: 'ctr', label: 'Trust CTR (Click-Through Rate)', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'cac', label: 'Trust CAC (Customer Acquisition Cost)', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'ltv-cac-cohort', label: 'Analyze LTV/CAC (Lifetime Value to CAC ratio) by cohort', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'revenue-attribution', label: 'Build a comprehensive revenue attribution model', icon: <Target size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'marketing-budget-shock',
            question: 'Your marketing budget is cut by 30%, but growth targets remain unchanged. What would you cut first?',
            helperText: 'Tests ROI thinking',
            isScenario: true,
            options: [
              { value: 'experiments', label: 'New experiments and testing', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'branding', label: 'Brand awareness campaigns', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'low-ltv-segments', label: 'Low LTV (Lifetime Value) customer segments', icon: <Target size={24} weight="duotone" /> },
              { value: 'agency-spend', label: 'External agency spend', icon: <CurrencyInr size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Marketing Questions 3-4
      {
        id: 'marketing-screen-2',
        initialChatText: "Now let's assess your AI maturity and pragmatic decision-making.",
        questions: [
          {
            id: 'marketing-ai-application',
            question: 'Where do you think AI creates a defensible competitive advantage in marketing?',
            helperText: 'Tests AI maturity',
            options: [
              { value: 'content-generation', label: 'Content generation - creating marketing copy at scale', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'creative-testing', label: 'Creative testing - rapid A/B experimentation', icon: <Target size={24} weight="duotone" /> },
              { value: 'audience-prediction', label: 'Audience prediction - identifying high-intent segments', icon: <Users size={24} weight="duotone" /> },
              { value: 'automated-optimization', label: 'Automated optimization loops - self-improving campaigns', icon: <Gear size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'marketing-attribution-reality',
            question: 'Your attribution data is unreliable and inconsistent. What do you do?',
            helperText: 'Tests senior pragmatism',
            isScenario: true,
            options: [
              { value: 'accept-imperfect', label: 'Accept imperfect data and move forward', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'switch-model', label: 'Switch to a different attribution model', icon: <Path size={24} weight="duotone" /> },
              { value: 'directional-insights', label: 'Build directional insights with caveats', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'ai-infer-patterns', label: 'Use AI to infer hidden patterns', icon: <Brain size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Marketing Questions 5-6
      {
        id: 'marketing-screen-3',
        initialChatText: "Finally, let's understand your systems thinking and accountability.",
        questions: [
          {
            id: 'marketing-scale-failure',
            question: 'Your growth campaign scaled initially but now has completely stalled. What do you think is the most likely reason?',
            helperText: 'Tests systems thinking',
            isScenario: true,
            options: [
              { value: 'saturation', label: 'Market saturation - ran out of addressable audience', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'messaging-mismatch', label: 'Messaging mismatch with new audience segments', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'funnel-leakage', label: 'Conversion funnel leakage at scale', icon: <Path size={24} weight="duotone" /> },
              { value: 'ops-constraints', label: 'Operations constraints (fulfillment, support)', icon: <Gear size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'marketing-leadership-metric',
            question: 'Which metric do you defend and own in leadership reviews and stakeholder meetings?',
            helperText: 'Tests senior accountability',
            options: [
              { value: 'leads', label: 'Leads - total lead volume generated', icon: <Users size={24} weight="duotone" /> },
              { value: 'cac', label: 'CAC (Customer Acquisition Cost)', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'revenue-contribution', label: 'Revenue contribution - marketing-attributed revenue', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'ltv', label: 'LTV (Lifetime Value) of acquired customers', icon: <Trophy size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ]
  },

  'operations': {
    // 0-3 years experience (Entry level)
    '0-3': [
    // Screen 3: Operations Questions 1-2
      {
        id: 'operations-screen-1',
        initialChatText: "Let's explore your operations thinking and problem-solving approach.",
        questions: [
          {
            id: 'operations-scale-stress',
            question: 'Your product demand doubles in just 90 days. What do you think will break first in your operations?',
            helperText: 'Tests system-level thinking',
            isScenario: true,
            options: [
              { value: 'hiring-capacity', label: 'Hiring capacity - unable to scale team fast enough', icon: <Users size={24} weight="duotone" /> },
              { value: 'process-design', label: 'Process design - workflows not built for scale', icon: <Gear size={24} weight="duotone" /> },
              { value: 'data-visibility', label: 'Data visibility - losing insights at scale', icon: <Database size={24} weight="duotone" /> },
              { value: 'vendor-reliability', label: 'Vendor reliability - third-party dependencies', icon: <Buildings size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'operations-cost-sla',
            question: 'Your operational costs are rising while SLA (Service Level Agreement) performance is dropping. What would you fix first?',
            helperText: 'Tests ops maturity',
            isScenario: true,
            options: [
              { value: 'headcount', label: 'Headcount - hire more people', icon: <Users size={24} weight="duotone" /> },
              { value: 'process-bottlenecks', label: 'Process bottlenecks - fix inefficient workflows', icon: <Path size={24} weight="duotone" /> },
              { value: 'demand-variability', label: 'Demand variability - better forecasting', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'automation-gaps', label: 'Automation gaps - identify manual work to automate', icon: <Gear size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Operations Questions 3-4
      {
        id: 'operations-screen-2',
        initialChatText: "Now let's assess your AI application and accountability.",
        questions: [
          {
            id: 'operations-ai-leverage',
            question: 'Where do you think AI delivers the highest ROI (Return on Investment) in your operations work?',
            helperText: 'Tests AI application depth',
            options: [
              { value: 'reporting', label: 'Reporting - automated dashboards and insights', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'forecasting', label: 'Forecasting - demand and capacity prediction', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'automation', label: 'Automation - eliminating manual workflows', icon: <Gear size={24} weight="duotone" /> },
              { value: 'decision-optimization', label: 'Decision optimization - smarter resource allocation', icon: <Brain size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'operations-ownership',
            question: 'Which metric do you think keeps you up at night and worries you the most?',
            helperText: 'Tests accountability',
            options: [
              { value: 'task-completion', label: 'Task completion - getting things done on time', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'cost-per-unit', label: 'Cost per unit - operational efficiency', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'sla-adherence', label: 'SLA (Service Level Agreement) adherence - meeting commitments', icon: <Target size={24} weight="duotone" /> },
              { value: 'margin', label: 'Margin - profitability of operations', icon: <ChartBar size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Operations Questions 5-6
      {
        id: 'operations-screen-3',
        initialChatText: "Finally, let's understand your pragmatism and strategic framing.",
        questions: [
          {
            id: 'operations-data-constraint',
            question: 'Your operations data is delayed by 2 weeks, but decisions need to be made now. What do you do?',
            helperText: 'Tests senior pragmatism',
            isScenario: true,
            options: [
              { value: 'wait', label: 'Wait for accurate data before making decisions', icon: <Clock size={24} weight="duotone" /> },
              { value: 'use-proxies', label: 'Use proxy metrics as temporary alternatives', icon: <Target size={24} weight="duotone" /> },
              { value: 'early-warning', label: 'Build real-time early-warning indicator system', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'ai-prediction', label: 'Use AI models to predict missing data', icon: <Brain size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'operations-strategic-role',
            question: 'In your view, what do you think operations exists primarily to accomplish?',
            helperText: 'Tests senior framing',
            options: [
              { value: 'execute-plans', label: 'Execute plans - deliver on commitments', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'reduce-cost', label: 'Reduce cost - maximize efficiency', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'enable-scale', label: 'Enable scale - support rapid growth', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'competitive-advantage', label: 'Drive competitive advantage - ops as strategy', icon: <Trophy size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 3-8 years experience (Mid level) - using same questions for now
    '3-8': [
      // Screen 3: Operations Questions 1-2
      {
        id: 'operations-screen-1',
        initialChatText: "Let's explore your operations thinking and problem-solving approach.",
        questions: [
          {
            id: 'operations-scale-stress',
            question: 'Your product demand doubles in just 90 days. What do you think will break first in your operations?',
            helperText: 'Tests system-level thinking',
            isScenario: true,
            options: [
              { value: 'hiring-capacity', label: 'Hiring capacity - unable to scale team fast enough', icon: <Users size={24} weight="duotone" /> },
              { value: 'process-design', label: 'Process design - workflows not built for scale', icon: <Gear size={24} weight="duotone" /> },
              { value: 'data-visibility', label: 'Data visibility - losing insights at scale', icon: <Database size={24} weight="duotone" /> },
              { value: 'vendor-reliability', label: 'Vendor reliability - third-party dependencies', icon: <Buildings size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'operations-cost-sla',
            question: 'Your operational costs are rising while SLA (Service Level Agreement) performance is dropping. What would you fix first?',
            helperText: 'Tests ops maturity',
            isScenario: true,
            options: [
              { value: 'headcount', label: 'Headcount - hire more people', icon: <Users size={24} weight="duotone" /> },
              { value: 'process-bottlenecks', label: 'Process bottlenecks - fix inefficient workflows', icon: <Path size={24} weight="duotone" /> },
              { value: 'demand-variability', label: 'Demand variability - better forecasting', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'automation-gaps', label: 'Automation gaps - identify manual work to automate', icon: <Gear size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Operations Questions 3-4
      {
        id: 'operations-screen-2',
        initialChatText: "Now let's assess your AI application and accountability.",
        questions: [
          {
            id: 'operations-ai-leverage',
            question: 'Where do you think AI delivers the highest ROI (Return on Investment) in your operations work?',
            helperText: 'Tests AI application depth',
            options: [
              { value: 'reporting', label: 'Reporting - automated dashboards and insights', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'forecasting', label: 'Forecasting - demand and capacity prediction', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'automation', label: 'Automation - eliminating manual workflows', icon: <Gear size={24} weight="duotone" /> },
              { value: 'decision-optimization', label: 'Decision optimization - smarter resource allocation', icon: <Brain size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'operations-ownership',
            question: 'Which metric do you think keeps you up at night and worries you the most?',
            helperText: 'Tests accountability',
            options: [
              { value: 'task-completion', label: 'Task completion - getting things done on time', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'cost-per-unit', label: 'Cost per unit - operational efficiency', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'sla-adherence', label: 'SLA (Service Level Agreement) adherence - meeting commitments', icon: <Target size={24} weight="duotone" /> },
              { value: 'margin', label: 'Margin - profitability of operations', icon: <ChartBar size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Operations Questions 5-6
      {
        id: 'operations-screen-3',
        initialChatText: "Finally, let's understand your pragmatism and strategic framing.",
        questions: [
          {
            id: 'operations-data-constraint',
            question: 'Your operations data is delayed by 2 weeks, but decisions need to be made now. What do you do?',
            helperText: 'Tests senior pragmatism',
            isScenario: true,
            options: [
              { value: 'wait', label: 'Wait for accurate data before making decisions', icon: <Clock size={24} weight="duotone" /> },
              { value: 'use-proxies', label: 'Use proxy metrics as temporary alternatives', icon: <Target size={24} weight="duotone" /> },
              { value: 'early-warning', label: 'Build real-time early-warning indicator system', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'ai-prediction', label: 'Use AI models to predict missing data', icon: <Brain size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'operations-strategic-role',
            question: 'In your view, what do you think operations exists primarily to accomplish?',
            helperText: 'Tests senior framing',
            options: [
              { value: 'execute-plans', label: 'Execute plans - deliver on commitments', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'reduce-cost', label: 'Reduce cost - maximize efficiency', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'enable-scale', label: 'Enable scale - support rapid growth', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'competitive-advantage', label: 'Drive competitive advantage - ops as strategy', icon: <Trophy size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 8+ years experience (Senior level) - using same questions for now
    '8+': [
      // Screen 3: Operations Questions 1-2
      {
        id: 'operations-screen-1',
        initialChatText: "Let's explore your operations thinking and problem-solving approach.",
        questions: [
          {
            id: 'operations-scale-stress',
            question: 'Your product demand doubles in just 90 days. What do you think will break first in your operations?',
            helperText: 'Tests system-level thinking',
            isScenario: true,
            options: [
              { value: 'hiring-capacity', label: 'Hiring capacity - unable to scale team fast enough', icon: <Users size={24} weight="duotone" /> },
              { value: 'process-design', label: 'Process design - workflows not built for scale', icon: <Gear size={24} weight="duotone" /> },
              { value: 'data-visibility', label: 'Data visibility - losing insights at scale', icon: <Database size={24} weight="duotone" /> },
              { value: 'vendor-reliability', label: 'Vendor reliability - third-party dependencies', icon: <Buildings size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'operations-cost-sla',
            question: 'Your operational costs are rising while SLA (Service Level Agreement) performance is dropping. What would you fix first?',
            helperText: 'Tests ops maturity',
            isScenario: true,
            options: [
              { value: 'headcount', label: 'Headcount - hire more people', icon: <Users size={24} weight="duotone" /> },
              { value: 'process-bottlenecks', label: 'Process bottlenecks - fix inefficient workflows', icon: <Path size={24} weight="duotone" /> },
              { value: 'demand-variability', label: 'Demand variability - better forecasting', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'automation-gaps', label: 'Automation gaps - identify manual work to automate', icon: <Gear size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Operations Questions 3-4
      {
        id: 'operations-screen-2',
        initialChatText: "Now let's assess your AI application and accountability.",
        questions: [
          {
            id: 'operations-ai-leverage',
            question: 'Where do you think AI delivers the highest ROI (Return on Investment) in your operations work?',
            helperText: 'Tests AI application depth',
            options: [
              { value: 'reporting', label: 'Reporting - automated dashboards and insights', icon: <PresentationChart size={24} weight="duotone" /> },
              { value: 'forecasting', label: 'Forecasting - demand and capacity prediction', icon: <ChartLineUp size={24} weight="duotone" /> },
              { value: 'automation', label: 'Automation - eliminating manual workflows', icon: <Gear size={24} weight="duotone" /> },
              { value: 'decision-optimization', label: 'Decision optimization - smarter resource allocation', icon: <Brain size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'operations-ownership',
            question: 'Which metric do you think keeps you up at night and worries you the most?',
            helperText: 'Tests accountability',
            options: [
              { value: 'task-completion', label: 'Task completion - getting things done on time', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'cost-per-unit', label: 'Cost per unit - operational efficiency', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'sla-adherence', label: 'SLA (Service Level Agreement) adherence - meeting commitments', icon: <Target size={24} weight="duotone" /> },
              { value: 'margin', label: 'Margin - profitability of operations', icon: <ChartBar size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Operations Questions 5-6
      {
        id: 'operations-screen-3',
        initialChatText: "Finally, let's understand your pragmatism and strategic framing.",
        questions: [
          {
            id: 'operations-data-constraint',
            question: 'Your operations data is delayed by 2 weeks, but decisions need to be made now. What do you do?',
            helperText: 'Tests senior pragmatism',
            isScenario: true,
            options: [
              { value: 'wait', label: 'Wait for accurate data before making decisions', icon: <Clock size={24} weight="duotone" /> },
              { value: 'use-proxies', label: 'Use proxy metrics as temporary alternatives', icon: <Target size={24} weight="duotone" /> },
              { value: 'early-warning', label: 'Build real-time early-warning indicator system', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'ai-prediction', label: 'Use AI models to predict missing data', icon: <Brain size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'operations-strategic-role',
            question: 'In your view, what do you think operations exists primarily to accomplish?',
            helperText: 'Tests senior framing',
            options: [
              { value: 'execute-plans', label: 'Execute plans - deliver on commitments', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'reduce-cost', label: 'Reduce cost - maximize efficiency', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'enable-scale', label: 'Enable scale - support rapid growth', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'competitive-advantage', label: 'Drive competitive advantage - ops as strategy', icon: <Trophy size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ]
  },

  'founder': {
    // 0-3 years experience (Entry level)
    '0-3': [
    // Screen 3: Founder Questions 1-2
      {
        id: 'founder-screen-1',
        initialChatText: "Let's explore your founder mindset and strategic approach.",
        questions: [
          {
            id: 'founder-mvp-failure',
            question: 'Users are signing up for your product but not returning. What do you do?',
            helperText: 'Tests founder maturity',
            isScenario: true,
            options: [
              { value: 'add-features', label: 'Add more features to increase value', icon: <Code size={24} weight="duotone" /> },
              { value: 'increase-marketing', label: 'Increase marketing to get more users', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'reframe-problem', label: 'Reframe the problem you\'re solving', icon: <Brain size={24} weight="duotone" /> },
              { value: 'pivot-icp', label: 'Pivot to a different ICP (Ideal Customer Profile)', icon: <Users size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'founder-ai-dependency',
            question: 'Which team dependency do you think AI would help you remove or reduce first in your startup?',
            helperText: 'Tests AI strategy',
            options: [
              { value: 'engineering', label: 'Engineering - building and shipping product', icon: <Code size={24} weight="duotone" /> },
              { value: 'marketing', label: 'Marketing - customer acquisition and content', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'ops', label: 'Operations - workflows and processes', icon: <Gear size={24} weight="duotone" /> },
              { value: 'decision-making', label: 'Decision-making - strategic choices and insights', icon: <Brain size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Founder Questions 3-4
      {
        id: 'founder-screen-2',
        initialChatText: "Now let's assess your business maturity and resource prioritization.",
        questions: [
          {
            id: 'founder-scale-pain',
            question: 'Your revenue is growing but profit margins are falling. What do you think is the root cause?',
            helperText: 'Tests business maturity',
            isScenario: true,
            options: [
              { value: 'pricing', label: 'Pricing strategy is too aggressive', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'ops-inefficiency', label: 'Operations inefficiency at scale', icon: <Gear size={24} weight="duotone" /> },
              { value: 'customer-mix', label: 'Customer mix - acquiring wrong segment', icon: <Users size={24} weight="duotone" /> },
              { value: 'data-blindness', label: 'Data blindness - not tracking unit economics', icon: <Database size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'founder-resource-constraint',
            question: 'You have only 3 people and 6 months of runway. What would you optimize for?',
            helperText: 'Tests founder intent',
            isScenario: true,
            options: [
              { value: 'growth', label: 'Growth - maximize user acquisition', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'profitability', label: 'Profitability - reach break-even', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'learning', label: 'Learning - validate key assumptions', icon: <Lightbulb size={24} weight="duotone" /> },
              { value: 'fundraising', label: 'Fundraising - build deck and meet investors', icon: <Rocket size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Founder Questions 5-6
      {
        id: 'founder-screen-3',
        initialChatText: "Finally, let's understand your AI strategy and self-awareness.",
        questions: [
          {
            id: 'founder-ai-advantage',
            question: 'How do you think AI helps your startup the most right now?',
            helperText: 'Tests strategic thinking',
            options: [
              { value: 'speed', label: 'Speed - shipping faster and iterating quickly', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'cost', label: 'Cost - reducing burn rate and expenses', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'insight', label: 'Insight - better data-driven decisions', icon: <Brain size={24} weight="duotone" /> },
              { value: 'differentiation', label: 'Differentiation - unique competitive advantage', icon: <Trophy size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'founder-failure-pattern',
            question: 'When you reflect on your journey, what do you think was your biggest mistake so far?',
            helperText: 'Tests reflection depth',
            options: [
              { value: 'hiring-early', label: 'Hiring too early - scaling team prematurely', icon: <Users size={24} weight="duotone" /> },
              { value: 'scaling-fast', label: 'Scaling too fast - overextending operations', icon: <Rocket size={24} weight="duotone" /> },
              { value: 'weak-data', label: 'Weak data - not tracking metrics early enough', icon: <Database size={24} weight="duotone" /> },
              { value: 'poor-problem', label: 'Poor problem selection - solving wrong problem', icon: <Target size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 3-8 years experience (Mid level) - using same questions for now
    '3-8': [
      // Screen 3: Founder Questions 1-2
      {
        id: 'founder-screen-1',
        initialChatText: "Let's explore your founder mindset and strategic approach.",
        questions: [
          {
            id: 'founder-mvp-failure',
            question: 'Users are signing up for your product but not returning. What do you do?',
            helperText: 'Tests founder maturity',
            isScenario: true,
            options: [
              { value: 'add-features', label: 'Add more features to increase value', icon: <Code size={24} weight="duotone" /> },
              { value: 'increase-marketing', label: 'Increase marketing to get more users', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'reframe-problem', label: 'Reframe the problem you\'re solving', icon: <Brain size={24} weight="duotone" /> },
              { value: 'pivot-icp', label: 'Pivot to a different ICP (Ideal Customer Profile)', icon: <Users size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'founder-ai-dependency',
            question: 'Which team dependency do you think AI would help you remove or reduce first in your startup?',
            helperText: 'Tests AI strategy',
            options: [
              { value: 'engineering', label: 'Engineering - building and shipping product', icon: <Code size={24} weight="duotone" /> },
              { value: 'marketing', label: 'Marketing - customer acquisition and content', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'ops', label: 'Operations - workflows and processes', icon: <Gear size={24} weight="duotone" /> },
              { value: 'decision-making', label: 'Decision-making - strategic choices and insights', icon: <Brain size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Founder Questions 3-4
      {
        id: 'founder-screen-2',
        initialChatText: "Now let's assess your business maturity and resource prioritization.",
        questions: [
          {
            id: 'founder-scale-pain',
            question: 'Your revenue is growing but profit margins are falling. What do you think is the root cause?',
            helperText: 'Tests business maturity',
            isScenario: true,
            options: [
              { value: 'pricing', label: 'Pricing strategy is too aggressive', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'ops-inefficiency', label: 'Operations inefficiency at scale', icon: <Gear size={24} weight="duotone" /> },
              { value: 'customer-mix', label: 'Customer mix - acquiring wrong segment', icon: <Users size={24} weight="duotone" /> },
              { value: 'data-blindness', label: 'Data blindness - not tracking unit economics', icon: <Database size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'founder-resource-constraint',
            question: 'You have only 3 people and 6 months of runway. What would you optimize for?',
            helperText: 'Tests founder intent',
            isScenario: true,
            options: [
              { value: 'growth', label: 'Growth - maximize user acquisition', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'profitability', label: 'Profitability - reach break-even', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'learning', label: 'Learning - validate key assumptions', icon: <Lightbulb size={24} weight="duotone" /> },
              { value: 'fundraising', label: 'Fundraising - build deck and meet investors', icon: <Rocket size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Founder Questions 5-6
      {
        id: 'founder-screen-3',
        initialChatText: "Finally, let's understand your AI strategy and self-awareness.",
        questions: [
          {
            id: 'founder-ai-advantage',
            question: 'How do you think AI helps your startup the most right now?',
            helperText: 'Tests strategic thinking',
            options: [
              { value: 'speed', label: 'Speed - shipping faster and iterating quickly', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'cost', label: 'Cost - reducing burn rate and expenses', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'insight', label: 'Insight - better data-driven decisions', icon: <Brain size={24} weight="duotone" /> },
              { value: 'differentiation', label: 'Differentiation - unique competitive advantage', icon: <Trophy size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'founder-failure-pattern',
            question: 'When you reflect on your journey, what do you think was your biggest mistake so far?',
            helperText: 'Tests reflection depth',
            options: [
              { value: 'hiring-early', label: 'Hiring too early - scaling team prematurely', icon: <Users size={24} weight="duotone" /> },
              { value: 'scaling-fast', label: 'Scaling too fast - overextending operations', icon: <Rocket size={24} weight="duotone" /> },
              { value: 'weak-data', label: 'Weak data - not tracking metrics early enough', icon: <Database size={24} weight="duotone" /> },
              { value: 'poor-problem', label: 'Poor problem selection - solving wrong problem', icon: <Target size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 8+ years experience (Senior level) - using same questions for now
    '8+': [
      // Screen 3: Founder Questions 1-2
      {
        id: 'founder-screen-1',
        initialChatText: "Let's explore your founder mindset and strategic approach.",
        questions: [
          {
            id: 'founder-mvp-failure',
            question: 'Users are signing up for your product but not returning. What do you do?',
            helperText: 'Tests founder maturity',
            isScenario: true,
            options: [
              { value: 'add-features', label: 'Add more features to increase value', icon: <Code size={24} weight="duotone" /> },
              { value: 'increase-marketing', label: 'Increase marketing to get more users', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'reframe-problem', label: 'Reframe the problem you\'re solving', icon: <Brain size={24} weight="duotone" /> },
              { value: 'pivot-icp', label: 'Pivot to a different ICP (Ideal Customer Profile)', icon: <Users size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'founder-ai-dependency',
            question: 'Which team dependency do you think AI would help you remove or reduce first in your startup?',
            helperText: 'Tests AI strategy',
            options: [
              { value: 'engineering', label: 'Engineering - building and shipping product', icon: <Code size={24} weight="duotone" /> },
              { value: 'marketing', label: 'Marketing - customer acquisition and content', icon: <MegaphoneSimple size={24} weight="duotone" /> },
              { value: 'ops', label: 'Operations - workflows and processes', icon: <Gear size={24} weight="duotone" /> },
              { value: 'decision-making', label: 'Decision-making - strategic choices and insights', icon: <Brain size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Founder Questions 3-4
      {
        id: 'founder-screen-2',
        initialChatText: "Now let's assess your business maturity and resource prioritization.",
        questions: [
          {
            id: 'founder-scale-pain',
            question: 'Your revenue is growing but profit margins are falling. What do you think is the root cause?',
            helperText: 'Tests business maturity',
            isScenario: true,
            options: [
              { value: 'pricing', label: 'Pricing strategy is too aggressive', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'ops-inefficiency', label: 'Operations inefficiency at scale', icon: <Gear size={24} weight="duotone" /> },
              { value: 'customer-mix', label: 'Customer mix - acquiring wrong segment', icon: <Users size={24} weight="duotone" /> },
              { value: 'data-blindness', label: 'Data blindness - not tracking unit economics', icon: <Database size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'founder-resource-constraint',
            question: 'You have only 3 people and 6 months of runway. What would you optimize for?',
            helperText: 'Tests founder intent',
            isScenario: true,
            options: [
              { value: 'growth', label: 'Growth - maximize user acquisition', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'profitability', label: 'Profitability - reach break-even', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'learning', label: 'Learning - validate key assumptions', icon: <Lightbulb size={24} weight="duotone" /> },
              { value: 'fundraising', label: 'Fundraising - build deck and meet investors', icon: <Rocket size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Founder Questions 5-6
      {
        id: 'founder-screen-3',
        initialChatText: "Finally, let's understand your AI strategy and self-awareness.",
        questions: [
          {
            id: 'founder-ai-advantage',
            question: 'How do you think AI helps your startup the most right now?',
            helperText: 'Tests strategic thinking',
            options: [
              { value: 'speed', label: 'Speed - shipping faster and iterating quickly', icon: <Lightning size={24} weight="duotone" /> },
              { value: 'cost', label: 'Cost - reducing burn rate and expenses', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'insight', label: 'Insight - better data-driven decisions', icon: <Brain size={24} weight="duotone" /> },
              { value: 'differentiation', label: 'Differentiation - unique competitive advantage', icon: <Trophy size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'founder-failure-pattern',
            question: 'When you reflect on your journey, what do you think was your biggest mistake so far?',
            helperText: 'Tests reflection depth',
            options: [
              { value: 'hiring-early', label: 'Hiring too early - scaling team prematurely', icon: <Users size={24} weight="duotone" /> },
              { value: 'scaling-fast', label: 'Scaling too fast - overextending operations', icon: <Rocket size={24} weight="duotone" /> },
              { value: 'weak-data', label: 'Weak data - not tracking metrics early enough', icon: <Database size={24} weight="duotone" /> },
              { value: 'poor-problem', label: 'Poor problem selection - solving wrong problem', icon: <Target size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ]
  },

  'tech': {
    // 0-3 years experience (Entry level) - Questions from document
    '0-3': [
      // Screen 3: Tech Questions 1-2
      {
        id: 'tech-screen-1',
        initialChatText: "Let's explore your product thinking and business impact awareness.",
        questions: [
          {
            id: 'tech-product-thinking',
            question: 'You built a feature that took significant effort. After launch, usage is very low. The Product Manager hasn\'t raised concerns yet. What do you do?',
            helperText: 'Tests product thinking and ownership',
            isScenario: true,
            options: [
              { value: 'move-next-task', label: 'Move to the next task since launch is complete', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'suggest-features', label: 'Suggest adding more features to improve engagement', icon: <Code size={24} weight="duotone" /> },
              { value: 'review-data', label: 'Review usage data and speak to Product about potential issues', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'blame-marketing', label: 'Assume marketing didn\'t promote it well', icon: <MegaphoneSimple size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'tech-business-impact',
            question: 'You reduced server response time by 25%, but users haven\'t directly complained about speed before. How do you evaluate the value of your work?',
            helperText: 'Tests business impact awareness',
            isScenario: true,
            options: [
              { value: 'code-quality', label: 'It improves code quality only', icon: <Code size={24} weight="duotone" /> },
              { value: 'ux-cost', label: 'It may improve user experience and reduce infra costs', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'deployment', label: 'It makes deployment easier', icon: <Gear size={24} weight="duotone" /> },
              { value: 'doesnt-matter', label: 'It doesn\'t matter if users didn\'t complain', icon: <XCircle size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Tech Questions 3-4
      {
        id: 'tech-screen-2',
        initialChatText: "Now let's assess your execution approach and prioritization thinking.",
        questions: [
          {
            id: 'tech-execution-accountability',
            question: 'Two days before release, you discover a bug that may impact 5% of users. What is the best action?',
            helperText: 'Tests execution and accountability',
            isScenario: true,
            options: [
              { value: 'ignore-small', label: 'Ignore since impact is small', icon: <XCircle size={24} weight="duotone" /> },
              { value: 'inform-stakeholders', label: 'Inform stakeholders and suggest fix vs delay trade-off', icon: <Users size={24} weight="duotone" /> },
              { value: 'fix-quietly', label: 'Fix quietly without informing anyone', icon: <CheckCircle size={24} weight="duotone" /> },
              { value: 'delay-release', label: 'Delay release without explanation', icon: <Clock size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'tech-prioritization',
            question: 'You have: Task A: Refactor messy code (no immediate visible impact). Task B: Add minor UI feature requested by Sales. Both take equal time. How do you decide?',
            helperText: 'Tests prioritization thinking',
            isScenario: true,
            options: [
              { value: 'technically-interesting', label: 'Choose what is technically interesting', icon: <Code size={24} weight="duotone" /> },
              { value: 'business-impact', label: 'Evaluate business impact and urgency', icon: <Target size={24} weight="duotone" /> },
              { value: 'always-sales', label: 'Always prioritize Sales', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'always-refactor', label: 'Always prioritize refactoring', icon: <Gear size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Tech Questions 5-6
      {
        id: 'tech-screen-3',
        initialChatText: "Finally, let's understand your AI literacy and ownership mindset.",
        questions: [
          {
            id: 'tech-ai-literacy',
            question: 'Your manager suggests adopting an AI coding assistant for the team. What should you evaluate?',
            helperText: 'Tests AI literacy in business context',
            options: [
              { value: 'competitor-usage', label: 'Whether competitors use it', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'productivity-cost', label: 'Whether it improves productivity enough to justify cost', icon: <Target size={24} weight="duotone" /> },
              { value: 'trending', label: 'Whether it\'s trending', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'junior-likes', label: 'Whether junior engineers like it', icon: <Users size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'tech-ownership',
            question: 'A production issue occurred due to a decision you made, though it wasn\'t fully your fault. What do you do?',
            helperText: 'Tests ownership mindset',
            isScenario: true,
            options: [
              { value: 'highlight-others', label: 'Highlight that others were involved', icon: <Users size={24} weight="duotone" /> },
              { value: 'take-ownership', label: 'Take ownership and help resolve it', icon: <Trophy size={24} weight="duotone" /> },
              { value: 'stay-silent', label: 'Stay silent unless asked', icon: <Clock size={24} weight="duotone" /> },
              { value: 'escalate-blame', label: 'Escalate blame', icon: <XCircle size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 3-8 years experience (Mid level) - Questions from document
    '3-8': [
      // Screen 3: Tech Questions 1-2
      {
        id: 'tech-screen-1',
        initialChatText: "Let's explore your feature ROI evaluation and cost management thinking.",
        questions: [
          {
            id: 'tech-feature-roi',
            question: 'A new feature requires 6 weeks of engineering effort and may increase retention by 3%. What matters most before committing?',
            helperText: 'Tests feature ROI evaluation',
            isScenario: true,
            options: [
              { value: 'technical-feasibility', label: 'Technical feasibility', icon: <Code size={24} weight="duotone" /> },
              { value: 'revenue-opportunity', label: 'Revenue impact vs opportunity cost', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'team-excitement', label: 'Team excitement', icon: <Users size={24} weight="duotone" /> },
              { value: 'competitor-parity', label: 'Competitor parity', icon: <Target size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'tech-cost-escalation',
            question: 'Cloud costs increased 50% year-over-year. Growth is only 15%. What\'s your first strategic step?',
            helperText: 'Tests cost escalation management',
            isScenario: true,
            options: [
              { value: 'immediate-overhaul', label: 'Immediate infra overhaul', icon: <Gear size={24} weight="duotone" /> },
              { value: 'analyze-drivers', label: 'Analyze cost drivers and inefficiencies', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'reduce-features', label: 'Reduce product features', icon: <Code size={24} weight="duotone" /> },
              { value: 'wait-cfo', label: 'Wait for CFO direction', icon: <Clock size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Tech Questions 3-4
      {
        id: 'tech-screen-2',
        initialChatText: "Now let's assess your cross-functional collaboration and tech debt management.",
        questions: [
          {
            id: 'tech-sales-product-conflict',
            question: 'Sales closed a major deal promising a custom feature not on roadmap. What do you do?',
            helperText: 'Tests sales vs product conflict resolution',
            isScenario: true,
            options: [
              { value: 'build-immediately', label: 'Build immediately', icon: <Code size={24} weight="duotone" /> },
              { value: 'reject-firmly', label: 'Reject firmly', icon: <XCircle size={24} weight="duotone" /> },
              { value: 'evaluate-align', label: 'Evaluate revenue impact and align with Product roadmap', icon: <Target size={24} weight="duotone" /> },
              { value: 'escalate-conflict', label: 'Escalate conflict', icon: <Users size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'tech-debt-speed',
            question: 'Engineering wants refactoring. Leadership wants faster feature releases. How do you respond?',
            helperText: 'Tests tech debt vs speed balance',
            isScenario: true,
            options: [
              { value: 'prioritize-features', label: 'Prioritize features always', icon: <Code size={24} weight="duotone" /> },
              { value: 'balance-debt', label: 'Balance short-term delivery with planned debt reduction', icon: <Target size={24} weight="duotone" /> },
              { value: 'focus-health', label: 'Focus only on engineering health', icon: <Gear size={24} weight="duotone" /> },
              { value: 'ignore-pressure', label: 'Ignore leadership pressure', icon: <XCircle size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Tech Questions 5-6
      {
        id: 'tech-screen-3',
        initialChatText: "Finally, let's understand your AI investment decisions and resource allocation.",
        questions: [
          {
            id: 'tech-ai-investment',
            question: 'Leadership wants to add AI chatbot to product. Your evaluation criteria?',
            helperText: 'Tests AI investment decision making',
            options: [
              { value: 'trend-value', label: 'Trend value', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'pain-point-roi', label: 'Clear user pain point + ROI projection', icon: <Target size={24} weight="duotone" /> },
              { value: 'competitive-pressure', label: 'Competitive pressure', icon: <ChartBar size={24} weight="duotone" /> },
              { value: 'ease-implementation', label: 'Ease of implementation', icon: <Code size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'tech-resource-allocation',
            question: 'You have limited engineering bandwidth. Options: Infra optimization, New revenue feature, Internal tooling. How do you decide?',
            helperText: 'Tests resource allocation thinking',
            isScenario: true,
            options: [
              { value: 'highest-impact', label: 'Choose highest visible impact', icon: <Target size={24} weight="duotone" /> },
              { value: 'growth-priorities', label: 'Align with company growth priorities', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'technically-complex', label: 'Choose technically complex work', icon: <Code size={24} weight="duotone" /> },
              { value: 'team-vote', label: 'Let team vote', icon: <Users size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ],
    // 8+ years experience (Senior level) - Questions from document
    '8+': [
      // Screen 3: Tech Questions 1-2
      {
        id: 'tech-screen-1',
        initialChatText: "Let's explore your strategic trade-offs and capital allocation thinking.",
        questions: [
          {
            id: 'tech-strategic-tradeoff',
            question: 'You must choose between: Improving reliability (reduces churn risk) OR Launching a revenue-driving feature. Decision should be based on?',
            helperText: 'Tests strategic trade-off thinking',
            isScenario: true,
            options: [
              { value: 'immediate-revenue', label: 'Immediate revenue only', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'long-term-strategy', label: 'Long-term company strategy + risk analysis', icon: <Target size={24} weight="duotone" /> },
              { value: 'engineering-preference', label: 'Engineering preference', icon: <Code size={24} weight="duotone" /> },
              { value: 'ceo-urgency', label: 'CEO urgency', icon: <Clock size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'tech-capital-allocation',
            question: 'You receive ₹3 Cr for engineering improvement. Best approach?',
            helperText: 'Tests capital allocation thinking',
            isScenario: true,
            options: [
              { value: 'hire-aggressively', label: 'Hire aggressively', icon: <Users size={24} weight="duotone" /> },
              { value: 'invest-ai', label: 'Invest entirely in AI', icon: <Brain size={24} weight="duotone" /> },
              { value: 'allocate-roi', label: 'Allocate across people, infra, and automation based on ROI', icon: <Target size={24} weight="duotone" /> },
              { value: 'preserve-capital', label: 'Preserve capital', icon: <CurrencyInr size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 4: Tech Questions 3-4
      {
        id: 'tech-screen-2',
        initialChatText: "Now let's assess your understanding of engineering as competitive advantage and scalability.",
        questions: [
          {
            id: 'tech-competitive-advantage',
            question: 'When does tech become a moat?',
            helperText: 'Tests understanding of engineering as competitive advantage',
            options: [
              { value: 'complex-architecture', label: 'When architecture is complex', icon: <Code size={24} weight="duotone" /> },
              { value: 'switching-cost-value', label: 'When it increases switching cost and user value', icon: <Target size={24} weight="duotone" /> },
              { value: 'high-infra-cost', label: 'When infra cost is high', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'large-team', label: 'When team size grows', icon: <Users size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'tech-scalability',
            question: 'You expect 5x user growth in 2 years but revenue is tight today. What\'s the best strategy?',
            helperText: 'Tests long-term scalability thinking',
            isScenario: true,
            options: [
              { value: 'overbuild-now', label: 'Overbuild now', icon: <Code size={24} weight="duotone" /> },
              { value: 'modular-incremental', label: 'Build modular systems that scale incrementally', icon: <Gear size={24} weight="duotone" /> },
              { value: 'ignore-projections', label: 'Ignore future projections', icon: <XCircle size={24} weight="duotone" /> },
              { value: 'freeze-innovation', label: 'Freeze innovation', icon: <Clock size={24} weight="duotone" /> }
            ]
          }
        ]
      },
      // Screen 5: Tech Questions 5-6
      {
        id: 'tech-screen-3',
        initialChatText: "Finally, let's understand your AI strategy and portfolio balancing.",
        questions: [
          {
            id: 'tech-ai-strategy',
            question: 'How do you decide if AI should be core product vs supporting feature?',
            helperText: 'Tests AI as strategy thinking',
            options: [
              { value: 'industry-trend', label: 'Industry trend', icon: <TrendUp size={24} weight="duotone" /> },
              { value: 'strategic-differentiation', label: 'Strategic differentiation potential', icon: <Target size={24} weight="duotone" /> },
              { value: 'investor-excitement', label: 'Investor excitement', icon: <CurrencyInr size={24} weight="duotone" /> },
              { value: 'team-expertise', label: 'Team expertise', icon: <Users size={24} weight="duotone" /> }
            ]
          },
          {
            id: 'tech-portfolio-balancing',
            question: 'How should engineering capacity typically be allocated?',
            helperText: 'Tests portfolio balancing thinking',
            options: [
              { value: 'all-features', label: '100% new features', icon: <Code size={24} weight="duotone" /> },
              { value: 'balanced-allocation', label: 'Balanced between growth, stability, and innovation', icon: <Target size={24} weight="duotone" /> },
              { value: 'mostly-refactoring', label: 'Mostly refactoring', icon: <Gear size={24} weight="duotone" /> },
              { value: 'engineering-interest', label: 'Based on engineering interest', icon: <Users size={24} weight="duotone" /> }
            ]
          }
        ]
      }
    ]
  }
};

// Helper function to map frontend experience values to document experience levels
export const mapExperienceToLevel = (experience) => {
  // Frontend: '0-1', '1-3', '3-6', '6-10', '10+'
  // Document: '0-3', '3-8', '8+'
  if (experience === '0-1' || experience === '1-3') {
    return '0-3';
  } else if (experience === '3-6' || experience === '6-10') {
    return '3-8';
  } else if (experience === '10+') {
    return '8+';
  }
  // Default to mid-level if unknown
  return '3-8';
};

// Helper to check if all questions in a screen are answered
export const isScreenComplete = (screenId, responses) => {
  // Implementation will be handled in the orchestrator
  return true;
};
