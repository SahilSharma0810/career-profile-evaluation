import SystemDesignFundamentals from '../assets/topics_icons/System-Design-Fundamentals.webp';
import DistributedSystemsPrimer from '../assets/topics_icons/Distributed-Systems-Primer.webp';
import BackendWithPythonAndDjango from '../assets/topics_icons/Backend-with-Python-&-Django.webp';
import DatabaseDesignAndSQL from '../assets/topics_icons/Database-Design-&-SQL.webp';
import FullStackArchitecture from '../assets/topics_icons/Full-Stack-Architecture.webp';
import RESTAPIDesignBestPractices from '../assets/topics_icons/REST-API-Design-Best-Practices.webp';
import FrontendFundamentals from '../assets/topics_icons/Frontend-Fundamentals.webp';
import FullStackJavaScript from '../assets/topics_icons/Full-Stack-JavaScript.webp';
import ReactAdvancedPatterns from '../assets/topics_icons/React-Advanced-Patterns.webp';
import BackendWithNodeJS from '../assets/topics_icons/Backend-Development-Basics.webp';
import SystemDesignMasterclass from '../assets/topics_icons/System-Design-Fundamentals.webp';
import EngineeringLeadership from '../assets/topics_icons/Engineering-Leadership.webp';
import ArchitecturePatterns from '../assets/topics_icons/Architecture-Patterns.webp';
import PythonForDataScience from '../assets/topics_icons/Machine-Learning-Foundations.webp';
import MachineLearningFoundations from '../assets/topics_icons/Machine-Learning-Foundations.webp';
import SQLForAnalytics from '../assets/topics_icons/SQL-for-Analytics.webp';
import DockerAndKubernetesFundamentals from '../assets/topics_icons/Docker-&-Kubernetes-Fundamentals.webp';
import AWSCloudPractitioner from '../assets/topics_icons/AWS-Cloud-Practitioner.webp';
import CICDPipelineDesign from '../assets/topics_icons/CI:CD-Pipeline-Design.webp';
import LLMFundamentalsAndPromptEngineering from '../assets/topics_icons/LLM-Fundamentals-&-Prompt-Engineering.webp';
import RAGPipelineDesign from '../assets/topics_icons/RAG-Pipeline-Design.webp';
import DataStructuresAndAlgorithms from '../assets/topics_icons/System-Design-Fundamentals.webp';
import BackendDevelopmentBasics from '../assets/topics_icons/Backend-Development-Basics.webp';


import academyBackground from '../assets/program_banners/academy_bg.png';
import dataScienceBackground from '../assets/program_banners/dsml.png';
import devopsAimlBackground from '../assets/program_banners/aiml_devops.png';



const COURSES_BY_ROLE = {
  'senior-backend': [
    { title: 'System Design Fundamentals', icon: SystemDesignFundamentals, description: 'Learn how to design scalable systems — your foundation needs work.', duration: '12 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/best-system-design-courses/' },
    { title: 'Distributed Systems Primer', icon: DistributedSystemsPrimer, description: 'Understand how systems talk at scale — brush up on distributed fundamentals.', duration: '8 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/challenges-of-distributed-system/' },
    { title: 'Backend with Python & Django', icon: BackendWithPythonAndDjango, description: 'Build production-grade APIs — backend fundamentals in Python are a gap worth closing.', duration: '16 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/python/' }
  ],
  'senior-fullstack': [
    { title: 'Full-Stack Architecture', icon: FullStackArchitecture, description: 'Master end-to-end application design from frontend to backend.', duration: '14 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/software-engineering/how-to-become-a-full-stack-developer/' },
    { title: 'React Advanced Patterns', icon: ReactAdvancedPatterns, description: 'Level up your React skills with production-grade patterns.', duration: '10 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/react/' },
    { title: 'System Design Fundamentals', icon: SystemDesignFundamentals, description: 'Learn how to design scalable systems — essential for senior roles.', duration: '12 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/best-system-design-courses/' }
  ],
  'backend-sde': [
    { title: 'Backend with Python & Django', icon: BackendWithPythonAndDjango, description: 'Build production-grade APIs with Python.', duration: '16 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/python/' },
    { title: 'Database Design & SQL', icon: DatabaseDesignAndSQL, description: 'Master relational databases, indexing, and query optimization.', duration: '10 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/dbms/' },
    { title: 'REST API Design Best Practices', icon: RESTAPIDesignBestPractices, description: 'Design robust, scalable APIs that teams love to work with.', duration: '8 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/what-is-rest-api/' }
  ],
  'fullstack-sde': [
    { title: 'Full-Stack JavaScript', icon: FullStackJavaScript, description: 'Build full-stack applications with Node.js and React.', duration: '20 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/software-engineering/how-to-become-a-full-stack-developer/' },
    { title: 'Frontend Fundamentals', icon: FrontendFundamentals, description: 'HTML, CSS, JavaScript — the building blocks of every web app.', duration: '12 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/javascript/' },
    { title: 'Backend with Node.js', icon: BackendWithNodeJS, description: 'Build scalable server-side applications with Express and Node.', duration: '14 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/nodejs/' }
  ],
  'data-ml': [
    { title: 'Python for Data Science', icon: PythonForDataScience, description: 'Master Python, pandas, and numpy for data analysis.', duration: '16 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/data-science/' },
    { title: 'Machine Learning Foundations', icon: MachineLearningFoundations, description: 'Understand ML algorithms from linear regression to neural networks.', duration: '20 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/artificial-intelligence-tutorial/' },
    { title: 'SQL for Analytics', icon: SQLForAnalytics, description: 'Advanced SQL for data extraction, transformation, and analysis.', duration: '10 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/sql/' }
  ],
  'devops-sre': [
    { title: 'Docker & Kubernetes Fundamentals', icon: DockerAndKubernetesFundamentals, description: 'Master containerization and orchestration from scratch.', duration: '14 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/docker/' },
    { title: 'AWS Cloud Practitioner', icon: AWSCloudPractitioner, description: 'Build your cloud foundation with core AWS services.', duration: '12 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/aws/' },
    { title: 'CI/CD Pipeline Design', icon: CICDPipelineDesign, description: 'Automate your deployment workflow end to end.', duration: '8 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/cloud-computing/' }
  ],
  'ai-ml-engineer': [
    { title: 'LLM Fundamentals & Prompt Engineering', icon: LLMFundamentalsAndPromptEngineering, description: 'Understand large language models and how to work with them.', duration: '10 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/generative-ai/' },
    { title: 'RAG Pipeline Design', icon: RAGPipelineDesign, description: 'Build retrieval-augmented generation systems for production.', duration: '12 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/artificial-intelligence-tutorial/ibm-rag-and-agentic-ai-professional-certificate-what-is-it/' },
    { title: 'Machine Learning Foundations', icon: MachineLearningFoundations, description: 'Core ML concepts every AI engineer needs.', duration: '20 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/machine-learning/' }
  ],
  'tech-lead': [
    { title: 'System Design Masterclass', icon: SystemDesignMasterclass, description: 'Design systems at scale — the core skill for tech leads.', duration: '16 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/best-system-design-courses/' },
    { title: 'Engineering Leadership', icon: EngineeringLeadership, description: 'Lead teams, run design reviews, and drive technical decisions.', duration: '10 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/software-engineering/senior-software-developer/' },
    { title: 'Architecture Patterns', icon: ArchitecturePatterns, description: 'Microservices, event-driven, CQRS — patterns that matter at scale.', duration: '12 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/software-engineering/software-architecture/' }
  ],
  'default': [
    { title: 'System Design Fundamentals', icon: SystemDesignFundamentals, description: 'Learn how to design scalable systems.', duration: '12 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/best-system-design-courses/' },
    { title: 'Data Structures & Algorithms', icon: DataStructuresAndAlgorithms, description: 'Master DSA — the foundation of every technical interview.', duration: '20 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/data-structures/' },
    { title: 'Backend Development Basics', icon: BackendDevelopmentBasics, description: 'Build APIs and understand server-side programming.', duration: '16 hrs', type: 'Self-paced', free: true, url: 'https://www.scaler.com/topics/software-engineering/backend-developer-roadmap/' }
  ]
};

const MASTERCLASS_PLACEHOLDER = [
  { title: 'How to crack backend interviews at product companies', speaker: 'Anshuman Singh', speakerTitle: 'Ex-Google', day: 'Sat', time: '7 PM', url: '#' },
  { title: 'System design fundamentals: caches, queues, tradeoffs', speaker: 'Naman Bhalla', speakerTitle: 'Ex-Atlassian', day: 'Sun', time: '6 PM', url: '#' },
  { title: 'AI in your day-to-day backend workflow', speaker: 'Tarun Beriwal', speakerTitle: 'Scaler instructor', day: 'Wed', time: '8 PM', url: '#' }
];

const PROGRAMS = {
  'academy': {
    name: 'Modern Software & AI Engineering',
    background: academyBackground,
    description: 'A structured program for early-career engineers to build strong CS fundamentals and land their first product company role.',
    stats: {      
      overallRating: '4.8+',
      ratings: '25K+',
      months: '12'
    },
    features: [
      {
        title: 'Strong engineering fundamentals- ',
        description: 'DSA, system design, and backend architecture built to the depth product company interviews demand.'
      },
      {
        title: 'AI woven into every lab, assignment, and DSA problem - ',
        description: 'with a 24×7 AI Companion that hints, critiques your approach, and pair-programs alongside you.'
      },
      {
        title: 'Specialisation in Generative AI - ',
        description: 'build, evaluate, and ship production AI systems as part of the programme'
      }
    ],
    aiPanel: [
      'Forward Deployed Engineers who embed with customers to build and deploy AI solutions directly within real-world business workflows',
      'AI Solutions Engineers who design and implement end-to-end AI systems that solve specific business problems at scale',
      'Agent Engineers who build autonomous AI agents that can reason, act, and execute tasks across tools and workflows'
    ],
    primaryCta: { label: 'GO TO PROGRAM PAGE →', url: 'https://www.scaler.com/academy/' },
    secondaryCta: { label: 'DOWNLOAD CURRICULUM', url: 'https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/124/701/original/Academy-Broucher-12-05-24.pdf?1747034174' }
  },
  'data-science-course': {
    name: 'Modern Data Science and ML with Specialisation in AI',
    background: dataScienceBackground,
    description: 'Go from data curiosity to data career. Industry mentors, real datasets, and a job guarantee that puts skin in the game.',
    stats: {
      overallRating: '4.7+',
      ratings: '15K+',
      months: '12'
    },
    features: [
      {
        title: 'Data science and ML fundamentals - ',
        description: 'SQL, Python, statistics, machine learning, and MLOps taught as a connected system from raw data to deployed model, built to the depth the role and the market demand'
      },
      {
        title: 'AI-native workflows integrated into every lab and project - ',
        description: 'with a 24×7 AI Companion that trains you to generate, validate, and refine AI outputs at every stage of the work.'
      },
      {
        title: 'Specialisation in Generative AI and AI Engineering - ',
        description: 'build, evaluate, and deploy production AI systems as a core part of the programme.'
      }
    ],
    aiPanel: [
      'Data Scientists who analyze data and build models to uncover insights and inform decision-making',
      'ML Engineers who develop, train, and optimize machine learning models for performance and scalability',
      'Decision Scientists who combine data, experimentation, and business context to drive high-impact decisions'
    ],
    primaryCta: { label: 'GO TO PROGRAM PAGE →', url: 'https://www.scaler.com/courses/data-science-course/' },
    secondaryCta: { label: 'DOWNLOAD CURRICULUM', url: 'https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/105/157/original/DSML_Brochure_2024_compressed.pdf?1738001683' }
  },
  'devops-course': {
    name: 'DevOps, Cloud & AI Platform Engineering specialisation in MLOps and Cybersecurity',
    background: devopsAimlBackground,
    description: 'Master cloud infrastructure, CI/CD, and reliability engineering with mentors who\'ve scaled systems at top companies.',
    stats: {
      overallRating: '4.7+',
      ratings: '8K+',
      months: '12'
    },
    features: [
      {
        title: 'DevOps and Cloud Engineering - ',
        description: 'Linux to Kubernetes, CI/CD, Terraform, and AWS taught as one system for real-world deployment.'
      },
      {
        title: 'AI-native operations across workflows - ',
        description: 'Observability, anomaly detection, and agentic automation to run self-healing, intelligent systems'
      },
      {
        title: 'Specialisation in AI-powered infrastructure - ',
        description: 'Build and deploy AI systems using Kubeflow, KServe, LangChain, Bedrock, and modern cloud tooling'
      }
    ],
    aiPanel: [
      'AIOps Systems Architects who design AI-driven systems to monitor, automate, and optimize complex infrastructure',
      'Agentic Workflow Designers who design AI-powered workflows where agents collaborate to complete tasks end-to-end',
      'AI Gateway Engineers who build and manage secure, scalable interfaces that connect applications with AI models and services'
    ],
    primaryCta: { label: 'GO TO PROGRAM PAGE →', url: 'https://www.scaler.com/courses/devops-course/' },
    secondaryCta: { label: 'DOWNLOAD CURRICULUM', url: 'https://content.interviewbit.com/devops_brochure.pdf' }
  },
  'ai-machine-learning-course': {
    name: 'Advanced AIML with Specialisation in Agentic AI',
    background: devopsAimlBackground,
    description: 'Build production AI systems — from classical ML to LLMs. Mentored by engineers shipping AI at scale.',
    stats: {
      overallRating: '4.6+',
      ratings: '4K+',
      months: '12'
    },
    features: [
      {
        title: 'ML fundamentals to full AI engineering - ',
        description: 'Theory, deep learning, NLP, and computer vision, through to RAG pipelines, fine-tuning, and production deployment with observability and security built in.'
      },
      {
        title: 'Agentic system design as a core discipline - ',
        description: 'LangChain, LangGraph, CrewAI, and Autogen, with the judgement to know when to prompt, when to RAG, and when to fine-tune.'
      },
      {
        title: 'One connected programme - ',
        description: 'The complete AI lifecycle — owned end to end'
      }
    ],
    aiPanel: [
      'AI Engineers who build and integrate AI-powered features into products to deliver intelligent user experiences',
      'Agent Engineers who build autonomous AI agents that can reason, act, and execute tasks across tools and workflows',
      'MLOps Engineers who productionize, deploy, and maintain ML systems with reliable pipelines and monitoring'
    ],
    primaryCta: { label: 'GO TO PROGRAM PAGE →', url: 'https://www.scaler.com/courses/ai-machine-learning-course/' },
    secondaryCta: { label: 'DOWNLOAD CURRICULUM', url: 'https://content.interviewbit.com/AI-Ml-Brochure.pdf' }
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
