const sampleEvaluationResults = {
  profile_strength_score: 68,
  profile_strength_status: "Good",
  profile_strength_notes:
    "You have a solid foundation in backend development with room to grow in system design and AI-integrated workflows. With targeted effort, you can reach senior-level readiness within 6 months.",
  current_profile: {
    title: "Your Current Profile",
    summary:
      "A motivated backend developer with 4 years of hands-on experience building scalable APIs and microservices. You have strong fundamentals but need deeper system design exposure and leadership experience to break into senior roles at top-tier companies.",
    key_stats: [
      { label: "Experience", value: "4 years", icon: "briefcase" },
      { label: "Current Role", value: "Backend Developer", icon: "code" },
      { label: "Target Role", value: "Senior Backend Engineer", icon: "target" },
      { label: "Education", value: "B.Tech CS", icon: "graduation-cap" },
    ],
  },
  skill_analysis: {
    strengths: [
      "Strong grasp of REST API design and microservices architecture",
      "Proficient in Python and Node.js with production experience",
      "Good understanding of relational databases and query optimization",
      "Consistent problem-solving ability in coding assessments",
    ],
    areas_to_develop: [
      "System design depth — need experience with large-scale distributed systems",
      "AI/ML integration — limited exposure to LLM-powered features",
      "Leadership and mentoring — no experience leading a team or project",
    ],
  },
  recommended_tools: [
    "LangChain",
    "Docker & Kubernetes",
    "Redis",
    "Grafana + Prometheus",
    "Terraform",
  ],
  experience_benchmark: {
    your_experience_years: "4",
    typical_for_target_role_years: "5-7",
    gap_analysis:
      "You are 1-3 years below the typical experience range for senior backend roles at top companies. Focused upskilling in system design and AI can bridge this gap faster.",
  },
  interview_readiness: {
    technical_interview_percent: 55,
    hr_behavioral_percent: 65,
    technical_notes:
      "Strong on coding fundamentals and API design. Needs improvement in system design rounds and AI/ML-related questions increasingly appearing in senior interviews.",
  },
  peer_comparison: {
    percentile: 62,
    potential_percentile: 82,
    peer_group_description: "Backend developers with 3-5 years of experience targeting senior roles",
    label: "Above Average",
    summary:
      "You rank above 62% of peers in your experience bracket. With the right upskilling, you can reach the top 20%.",
    metrics: {
      profile_strength_percent: 68,
      better_than_peers_percent: 62,
    },
  },
  success_likelihood: {
    score_percent: 70,
    label: "Good Chances",
    status: "Good",
    notes:
      "You have a strong foundation. Focused preparation in system design and AI tools will significantly improve your placement odds at target companies.",
  },
  quick_wins: [
    {
      title: "Build an AI side project",
      description:
        "Ship a small LLM-powered tool (e.g., a code reviewer or doc summarizer) to demonstrate AI fluency on your resume.",
      icon: "rocket",
    },
    {
      title: "Complete system design prep",
      description:
        "Work through 10 classic system design problems (URL shortener, chat system, notification service) with written solutions.",
      icon: "target",
    },
    {
      title: "Start a technical blog",
      description:
        "Publish 2-3 deep-dive articles on topics like database sharding or API rate limiting to build your professional brand.",
      icon: "books",
    },
    {
      title: "Practice mock interviews",
      description:
        "Do at least 5 mock system design interviews with peers or platforms like Pramp to build confidence.",
      icon: "trophy",
    },
  ],
  opportunities_you_qualify_for: [],
  recommended_roles_based_on_interests: [
    {
      title: "Senior Backend Engineer",
      role: "backend-sde",
      seniority: "Senior",
      reason:
        "Natural progression from your current backend role. Requires deeper system design skills and AI integration knowledge.",
      timeline_text: "6-9 months",
      min_months: 6,
      max_months: 9,
      key_gap: "System design depth and distributed systems experience",
      milestones: [
        "Complete system design course",
        "Build 1 production-grade distributed system",
        "Pass 3 mock system design interviews",
      ],
      card_type: "target",
      confidence: "high",
    },
    {
      title: "Full-Stack Engineer",
      role: "fullstack-sde",
      seniority: "Mid-Senior",
      reason:
        "Leverages your backend strength while adding frontend skills. Many companies value full-stack versatility.",
      timeline_text: "4-6 months",
      min_months: 4,
      max_months: 6,
      key_gap: "Frontend framework proficiency (React/Next.js)",
      milestones: [
        "Build a React project end-to-end",
        "Learn Next.js fundamentals",
        "Deploy a full-stack app",
      ],
      card_type: "alternative_1_easier_company",
      confidence: "medium",
    },
    {
      title: "AI/ML Engineer",
      role: "ai-ml-engineer",
      seniority: "Entry",
      reason:
        "Growing demand for engineers who can bridge backend systems with AI/ML pipelines. Your backend experience is a strong foundation.",
      timeline_text: "9-12 months",
      min_months: 9,
      max_months: 12,
      key_gap: "ML fundamentals, model deployment, and LLM fine-tuning",
      milestones: [
        "Complete ML foundations course",
        "Build and deploy an ML model",
        "Contribute to an open-source AI project",
      ],
      card_type: "alternative_2_different_role",
      confidence: "medium",
    },
  ],
  badges: ["Quick Learner", "Backend Strong"],
};

const sampleQuizResponses = {
  currentRole: "backend-developer",
  currentRoleLabel: "Backend Developer",
  targetRole: "senior-backend-engineer",
  targetRoleLabel: "Senior Backend Engineer",
  experience: "3-5",
  currentCompany: "Mid-size startup",
};

const sampleBackground = "tech";

const sampleGoals = {
  requirementType: ["career-growth", "salary-hike"],
  targetCompany: "Google",
  topicOfInterest: ["system-design", "ai-ml"],
};

export { sampleEvaluationResults, sampleQuizResponses, sampleBackground, sampleGoals };
