const TENX_BY_ROLE = {
  'senior-backend': {
    title: 'What a 10× Senior Backend Engineer actually looks like in 2026.',
    subtitle: 'Not a unicorn. A real engineer who uses AI as leverage — every single day.',
    points: [
      { text: 'Uses <strong>AI coding agents</strong> to scaffold services, write tests, and refactor legacy code — not just autocomplete' },
      { text: 'Reviews <strong>AI-generated code critically</strong> — catches hallucinated imports, wrong DB queries, and race conditions before they ship' },
      { text: 'Ships <strong>AI-integrated backend features</strong>: embedding pipelines, intelligent caching, LLM-powered API routes' },
      { text: 'Designs <strong>systems with AI in the architecture</strong> — vector stores, model routing, and async inference baked in from day one' },
      { text: 'Answers <strong>"how would AI change your system design?"</strong> in interviews without hesitation' }
    ]
  },
  'senior-fullstack': {
    title: 'What a 10× Senior Full-Stack Engineer actually looks like in 2026.',
    subtitle: 'Not a unicorn. A real engineer who uses AI as leverage — every single day.',
    points: [
      { text: 'Uses <strong>AI coding agents</strong> end-to-end — scaffolding React components, API routes, and database schemas in one flow' },
      { text: 'Reviews <strong>AI-generated code critically</strong> — catches hallucinated props, broken API contracts, and XSS vectors before they ship' },
      { text: 'Ships <strong>AI-integrated features</strong>: smart search, AI-powered forms, real-time content generation across the stack' },
      { text: 'Designs <strong>full-stack systems with AI built in</strong> — streaming responses, edge inference, and client-side ML from the start' },
      { text: 'Answers <strong>"how would AI change your architecture?"</strong> in interviews without hesitation' }
    ]
  },
  'backend-sde': {
    title: 'What a 10× Backend Engineer actually looks like in 2026.',
    subtitle: 'Not a unicorn. A real engineer who uses AI as leverage — every single day.',
    points: [
      { text: 'Uses <strong>Cursor or Copilot</strong> for every feature — not just autocomplete, full refactors' },
      { text: 'Reviews <strong>AI-generated code critically</strong> — catches hallucinations before they ship' },
      { text: 'Ships <strong>AI-integrated features</strong>: smart caching, auto-generated API docs, AI-assisted debugging workflows' },
      { text: 'Designs <strong>APIs with AI consumers in mind</strong> — structured outputs, streaming endpoints, and token-efficient payloads' },
      { text: 'Answers <strong>"how would AI change your design?"</strong> in interviews without hesitation' }
    ]
  },
  'fullstack-sde': {
    title: 'What a 10× Full-Stack Engineer actually looks like in 2026.',
    subtitle: 'Not a unicorn. A real engineer who uses AI as leverage — every single day.',
    points: [
      { text: 'Uses <strong>Cursor or Copilot</strong> for every feature — not just autocomplete, full refactors across frontend and backend' },
      { text: 'Reviews <strong>AI-generated code critically</strong> — catches hallucinated APIs, broken state logic, and security issues before they ship' },
      { text: 'Ships <strong>AI-integrated features</strong>: chatbots, smart search, AI-assisted content workflows' },
      { text: 'Designs <strong>systems with AI in the architecture</strong> — not bolted on after' },
      { text: 'Answers <strong>"how would AI change your design?"</strong> in interviews without hesitation' }
    ]
  },
  'data-ml': {
    title: 'What a 10× Data Science Engineer actually looks like in 2026.',
    subtitle: 'Not a unicorn. A real data scientist who uses AI as leverage — every single day.',
    points: [
      { text: 'Uses <strong>AI coding assistants</strong> to write data pipelines, feature engineering code, and experiment notebooks faster' },
      { text: 'Reviews <strong>AI-generated analysis critically</strong> — catches statistical hallucinations, data leakage, and wrong aggregations' },
      { text: 'Ships <strong>production ML features</strong>: recommendation engines, anomaly detection, real-time scoring APIs' },
      { text: 'Designs <strong>data systems with LLMs in the loop</strong> — embeddings, fine-tuning pipelines, and evaluation frameworks from day one' },
      { text: 'Answers <strong>"how would AI change your ML pipeline?"</strong> in interviews without hesitation' }
    ]
  },
  'devops-sre': {
    title: 'What a 10× DevOps Engineer actually looks like in 2026.',
    subtitle: 'Not a unicorn. A real engineer who uses AI as leverage — every single day.',
    points: [
      { text: 'Uses <strong>AI coding assistants</strong> to write Terraform, CI/CD pipelines, and Kubernetes configs — not just autocomplete' },
      { text: 'Reviews <strong>AI-generated infra code critically</strong> — catches misconfigured IAM policies, open ports, and drift before they deploy' },
      { text: 'Ships <strong>AI-powered observability</strong>: intelligent alerting, anomaly detection, and auto-remediation workflows' },
      { text: 'Designs <strong>infrastructure with AI workloads in mind</strong> — GPU scheduling, model serving, and cost optimization built in' },
      { text: 'Answers <strong>"how would AI change your infra design?"</strong> in interviews without hesitation' }
    ]
  },
  'ai-ml-engineer': {
    title: 'What a 10× AI/ML Engineer actually looks like in 2026.',
    subtitle: 'Not a unicorn. A real engineer who ships AI systems at scale — every single day.',
    points: [
      { text: 'Uses <strong>AI coding agents</strong> to prototype, evaluate, and iterate on models and pipelines at 5× speed' },
      { text: 'Reviews <strong>AI-generated code and model outputs critically</strong> — catches training bugs, evaluation leaks, and prompt drift' },
      { text: 'Ships <strong>production AI systems</strong>: RAG pipelines, agent frameworks, fine-tuned models with guardrails' },
      { text: 'Designs <strong>AI-native architectures</strong> — routing, fallbacks, evaluations, and human-in-the-loop baked in from day one' },
      { text: 'Answers <strong>"how would you evaluate and improve this AI system?"</strong> in interviews without hesitation' }
    ]
  },
  'tech-lead': {
    title: 'What a 10× Tech Lead actually looks like in 2026.',
    subtitle: 'Not a unicorn. A real leader who multiplies team output with AI — every single day.',
    points: [
      { text: 'Sets up <strong>AI-augmented development workflows</strong> for the entire team — standardized tooling, prompt libraries, review processes' },
      { text: 'Reviews <strong>AI-generated code and architecture critically</strong> — ensures correctness, security, and alignment with system goals' },
      { text: 'Ships <strong>AI-integrated products</strong>: drives the roadmap for features that use LLMs, embeddings, and intelligent automation' },
      { text: 'Designs <strong>systems with AI as a first-class citizen</strong> — cost models, latency budgets, and fallback strategies built in' },
      { text: 'Answers <strong>"how would you lead a team building with AI?"</strong> in interviews without hesitation' }
    ]
  }
};

const DEFAULT_TENX = {
  title: 'What a 10× Software Engineer actually looks like in 2026.',
  subtitle: 'Not a unicorn. A real engineer who uses AI as leverage — every single day.',
  points: [
    { text: 'Uses <strong>Cursor or Copilot</strong> for every feature — not just autocomplete, full refactors' },
    { text: 'Reviews <strong>AI-generated code critically</strong> — catches hallucinations before they ship' },
    { text: 'Ships <strong>AI-integrated features</strong>: RAG pipelines, agents, AI-assisted workflows' },
    { text: 'Designs <strong>systems with AI in the architecture</strong> — not bolted on after' },
    { text: 'Answers <strong>"how would AI change your design?"</strong> in interviews without hesitation' }
  ]
};

export const getTenXContent = (targetRole) => {
  return TENX_BY_ROLE[targetRole] || DEFAULT_TENX;
};
