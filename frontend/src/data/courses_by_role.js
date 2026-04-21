const COURSES_BY_ROLE = {
  'senior-backend': [
    { title: 'System Design Fundamentals', description: 'Learn how to design scalable systems — your foundation needs work.', duration: '12 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'Distributed Systems Primer', description: 'Understand how systems talk at scale — brush up on distributed fundamentals.', duration: '8 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'Backend with Python & Django', description: 'Build production-grade APIs — backend fundamentals in Python are a gap worth closing.', duration: '16 hrs', type: 'Self-paced', free: true, url: '#' }
  ],
  'senior-fullstack': [
    { title: 'Full-Stack Architecture', description: 'Master end-to-end application design from frontend to backend.', duration: '14 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'React Advanced Patterns', description: 'Level up your React skills with production-grade patterns.', duration: '10 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'System Design Fundamentals', description: 'Learn how to design scalable systems — essential for senior roles.', duration: '12 hrs', type: 'Self-paced', free: true, url: '#' }
  ],
  'backend-sde': [
    { title: 'Backend with Python & Django', description: 'Build production-grade APIs with Python.', duration: '16 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'Database Design & SQL', description: 'Master relational databases, indexing, and query optimization.', duration: '10 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'REST API Design Best Practices', description: 'Design robust, scalable APIs that teams love to work with.', duration: '8 hrs', type: 'Self-paced', free: true, url: '#' }
  ],
  'fullstack-sde': [
    { title: 'Full-Stack JavaScript', description: 'Build full-stack applications with Node.js and React.', duration: '20 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'Frontend Fundamentals', description: 'HTML, CSS, JavaScript — the building blocks of every web app.', duration: '12 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'Backend with Node.js', description: 'Build scalable server-side applications with Express and Node.', duration: '14 hrs', type: 'Self-paced', free: true, url: '#' }
  ],
  'data-ml': [
    { title: 'Python for Data Science', description: 'Master Python, pandas, and numpy for data analysis.', duration: '16 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'Machine Learning Foundations', description: 'Understand ML algorithms from linear regression to neural networks.', duration: '20 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'SQL for Analytics', description: 'Advanced SQL for data extraction, transformation, and analysis.', duration: '10 hrs', type: 'Self-paced', free: true, url: '#' }
  ],
  'devops-sre': [
    { title: 'Docker & Kubernetes Fundamentals', description: 'Master containerization and orchestration from scratch.', duration: '14 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'AWS Cloud Practitioner', description: 'Build your cloud foundation with core AWS services.', duration: '12 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'CI/CD Pipeline Design', description: 'Automate your deployment workflow end to end.', duration: '8 hrs', type: 'Self-paced', free: true, url: '#' }
  ],
  'ai-ml-engineer': [
    { title: 'LLM Fundamentals & Prompt Engineering', description: 'Understand large language models and how to work with them.', duration: '10 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'RAG Pipeline Design', description: 'Build retrieval-augmented generation systems for production.', duration: '12 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'Machine Learning Foundations', description: 'Core ML concepts every AI engineer needs.', duration: '20 hrs', type: 'Self-paced', free: true, url: '#' }
  ],
  'tech-lead': [
    { title: 'System Design Masterclass', description: 'Design systems at scale — the core skill for tech leads.', duration: '16 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'Engineering Leadership', description: 'Lead teams, run design reviews, and drive technical decisions.', duration: '10 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'Architecture Patterns', description: 'Microservices, event-driven, CQRS — patterns that matter at scale.', duration: '12 hrs', type: 'Self-paced', free: true, url: '#' }
  ],
  'default': [
    { title: 'System Design Fundamentals', description: 'Learn how to design scalable systems.', duration: '12 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'Data Structures & Algorithms', description: 'Master DSA — the foundation of every technical interview.', duration: '20 hrs', type: 'Self-paced', free: true, url: '#' },
    { title: 'Backend Development Basics', description: 'Build APIs and understand server-side programming.', duration: '16 hrs', type: 'Self-paced', free: true, url: '#' }
  ]
};

const MASTERCLASS_PLACEHOLDER = [
  { title: 'How to crack backend interviews at product companies', speaker: 'Anshuman Singh', speakerTitle: 'Ex-Google', day: 'Sat', time: '7 PM', url: '#' },
  { title: 'System design fundamentals: caches, queues, tradeoffs', speaker: 'Naman Bhalla', speakerTitle: 'Ex-Atlassian', day: 'Sun', time: '6 PM', url: '#' },
  { title: 'AI in your day-to-day backend workflow', speaker: 'Tarun Beriwal', speakerTitle: 'Scaler instructor', day: 'Wed', time: '8 PM', url: '#' }
];

const PROGRAMS = {
  'academy': {
    name: 'Scaler Academy',
    description: 'A structured program for early-career engineers to build strong CS fundamentals and land their first product company role.',
    stats: [
      { value: '8 mo', label: 'Job-ready' },
      { value: '900+', label: 'Placed alumni' },
      { value: '2.5×', label: 'Avg salary jump' }
    ],
    features: [
      '1:1 mentors from Google, Amazon, Flipkart',
      '20+ mock interviews with sharp feedback',
      '5 production-grade resume projects',
      'Direct referrals to 400+ companies',
      'Pay after placement (income share)'
    ],
    primaryCta: { label: 'Go to program page →', url: 'https://www.scaler.com/academy/' },
    secondaryCta: { label: 'Download curriculum', url: 'https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/124/701/original/Academy-Broucher-12-05-24.pdf?1747034174' }
  },
  'data-science-course': {
    name: 'Scaler Data Science & ML',
    description: 'Go from data curiosity to data career. Industry mentors, real datasets, and a job guarantee that puts skin in the game.',
    stats: [
      { value: '11 mo', label: 'Job-ready' },
      { value: '500+', label: 'Placed alumni' },
      { value: '2.2×', label: 'Avg salary jump' }
    ],
    features: [
      '1:1 mentors from Google, Amazon, Flipkart',
      '15+ mock interviews with detailed feedback',
      'Real-world capstone projects with industry data',
      'Direct referrals to 400+ companies',
      'Pay after placement (income share)'
    ],
    primaryCta: { label: 'Go to program page →', url: 'https://www.scaler.com/courses/data-science-course/' },
    secondaryCta: { label: 'Download curriculum', url: 'https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/105/157/original/DSML_Brochure_2024_compressed.pdf?1738001683' }
  },
  'devops-course': {
    name: 'Scaler DevOps & SRE',
    description: 'Master cloud infrastructure, CI/CD, and reliability engineering with mentors who\'ve scaled systems at top companies.',
    stats: [
      { value: '8 mo', label: 'Job-ready' },
      { value: '900+', label: 'Placed alumni' },
      { value: '2.5×', label: 'Avg salary jump' }
    ],
    features: [
      '1:1 mentors from Google, Amazon, Flipkart',
      '20+ mock interviews with sharp feedback',
      '5 production-grade resume projects',
      'Direct referrals to 400+ companies',
      'Pay after placement (income share)'
    ],
    primaryCta: { label: 'Go to program page →', url: 'https://www.scaler.com/courses/devops-course/' },
    secondaryCta: { label: 'Download curriculum', url: 'https://content.interviewbit.com/devops_brochure.pdf' }
  },
  'ai-machine-learning-course': {
    name: 'Scaler AI & ML',
    description: 'Build production AI systems — from classical ML to LLMs. Mentored by engineers shipping AI at scale.',
    stats: [
      { value: '11 mo', label: 'Job-ready' },
      { value: '500+', label: 'Placed alumni' },
      { value: '2.2×', label: 'Avg salary jump' }
    ],
    features: [
      '1:1 mentors from Google, Amazon, Flipkart',
      '15+ mock interviews with detailed feedback',
      'Real-world capstone projects with industry data',
      'Direct referrals to 400+ companies',
      'Pay after placement (income share)'
    ],
    primaryCta: { label: 'Go to program page →', url: 'https://www.scaler.com/courses/ai-machine-learning-course/' },
    secondaryCta: { label: 'Download curriculum', url: 'https://content.interviewbit.com/AI-Ml-Brochure.pdf' }
  }
};

const ROLE_TO_PROGRAM = {
  'senior-backend': 'academy',
  'senior-fullstack': 'academy',
  'backend-sde': 'academy',
  'fullstack-sde': 'academy',
  'tech-lead': 'academy',
  'data-ml': 'data-science-course',
  'devops-sre': 'devops-course',
  'ai-ml-engineer': 'ai-machine-learning-course'
};

export const getStructuredProgramForRole = (targetRole) => {
  const programKey = ROLE_TO_PROGRAM[targetRole] || 'academy';
  return PROGRAMS[programKey];
};

export const getCoursesForRole = (targetRole) => {
  return COURSES_BY_ROLE[targetRole] || COURSES_BY_ROLE['default'];
};

export const getMasterclasses = () => {
  return MASTERCLASS_PLACEHOLDER;
};

export default COURSES_BY_ROLE;
