import { AssessmentTest, StudentProfile } from '../types';
import { ALL_ASSESSMENTS } from './assessments';

export const ASSESSMENTS: AssessmentTest[] = ALL_ASSESSMENTS;

export const DEMO_PROFILE: StudentProfile = {
  id: 'student-alex-rivera-2026',
  passportId: 'PSK-2026-89421-AR',
  name: 'Alex Rivera',
  headline: 'Aspiring Systems & Full-Stack Engineer | Distributed Systems & Web',
  bio: 'Computer Science senior focused on production-grade software engineering, event-driven distributed backends, and responsive modern web applications. Passionate about verifiable engineering over resume buzzwords.',
  university: 'University of Washington',
  degree: 'B.S. in Computer Science',
  graduationYear: '2026',
  location: 'Seattle, WA, USA',
  email: 'alex.rivera@cs.washington.edu',
  githubUrl: 'https://github.com/alexrivera-eng',
  linkedinUrl: 'https://linkedin.com/in/alexrivera-dev',
  portfolioUrl: 'https://alexrivera.dev',
  targetRole: 'Junior / Associate Software Engineer (Full-Stack & Systems)',
  isPublic: true,
  verificationHash: '0x7F9E3A4B89C1D2E0F571829A03BCDE148209841B',
  skills: [
    {
      id: 'skill-python',
      name: 'Python',
      category: 'Backend',
      level: 'Advanced',
      verificationStatus: 'assessment_passed',
      assessmentScore: 90,
      assessmentSkillLevel: 'Advanced',
      assessmentDate: '2026-10-14',
      linkedProjectIds: ['proj-cloudscale']
    },
    {
      id: 'skill-java',
      name: 'Java',
      category: 'Backend',
      level: 'Advanced',
      verificationStatus: 'assessment_passed',
      assessmentScore: 80,
      assessmentSkillLevel: 'Proficient',
      assessmentDate: '2026-10-18',
      linkedProjectIds: ['proj-cloudscale']
    },
    {
      id: 'skill-c',
      name: 'C Programming',
      category: 'Algorithms',
      level: 'Intermediate',
      verificationStatus: 'assessment_passed',
      assessmentScore: 70,
      assessmentSkillLevel: 'Proficient',
      assessmentDate: '2026-10-20',
      linkedProjectIds: []
    },
    {
      id: 'skill-dsa',
      name: 'Data Structures and Algorithms',
      category: 'Algorithms',
      level: 'Advanced',
      verificationStatus: 'recruiter_verified',
      assessmentScore: 90,
      assessmentSkillLevel: 'Advanced',
      assessmentDate: '2026-10-22',
      linkedProjectIds: ['proj-cloudscale']
    },
    {
      id: 'skill-webdev',
      name: 'Web Development',
      category: 'Frontend',
      level: 'Expert',
      verificationStatus: 'recruiter_verified',
      assessmentScore: 100,
      assessmentSkillLevel: 'Advanced',
      assessmentDate: '2026-10-25',
      linkedProjectIds: ['proj-devflow', 'proj-secureauth']
    },
    {
      id: 'skill-aiml',
      name: 'Artificial Intelligence and Machine Learning',
      category: 'AI / ML',
      level: 'Intermediate',
      verificationStatus: 'assessment_passed',
      assessmentScore: 80,
      assessmentSkillLevel: 'Proficient',
      assessmentDate: '2026-10-28',
      linkedProjectIds: []
    }
  ],
  projects: [
    {
      id: 'proj-cloudscale',
      title: 'CloudScale: Event-Driven Distributed Order Pipeline',
      tagline: 'High-throughput async transaction processor handling 12,000 req/sec with zero loss.',
      description: 'Built a resilient event-driven microservices backend utilizing Python, Kafka topics, and PostgreSQL with idempotent consumer offsets. Designed with dead-letter queue routing and Redis deduplication.',
      category: 'Distributed Systems & Backend',
      githubUrl: 'https://github.com/alexrivera-eng/cloudscale-pipeline',
      liveUrl: 'https://cloudscale-demo.run.app',
      skillsProved: ['Python', 'Java', 'Data Structures and Algorithms'],
      architectureNotes: 'Dual-write prevention via Transactional Outbox pattern. Kafka partition-key hashing by tenant ID ensures sequential guarantee. Automatic horizontal pod autoscaling tested under Locust load.',
      challengesSolved: 'Resolved consumer lag spikes during burst traffic by tuning batch sizes and offloading DB writes to pooled unlogged buffer tables before commit.',
      testCoveragePercent: 91,
      commitsCount: 148,
      completedDate: '2026-09-28',
      verifiedByRecruiter: true,
      artifacts: [
        {
          id: 'art-1',
          type: 'github_pr',
          title: 'PR #42: Implement Transactional Outbox & Resilient Consumer Lag Recovery',
          url: 'https://github.com/alexrivera-eng/cloudscale-pipeline/pull/42',
          description: 'Core architectural pull request reviewing commit diffs, idempotency tests, and DB connection pool configuration.'
        },
        {
          id: 'art-2',
          type: 'test_report',
          title: 'End-to-End Stress Test & Locust Benchmark Summary (12.4k rps, p99 < 42ms)',
          url: 'https://cloudscale-demo.run.app/benchmarks.html',
          description: 'Formal load test telemetry with Grafana dashboard snapshots verifying zero packet loss.'
        },
        {
          id: 'art-3',
          type: 'architecture_spec',
          title: 'System Design RFC: Fault-Tolerant Outbox Pattern',
          url: 'https://github.com/alexrivera-eng/cloudscale-pipeline/blob/main/docs/ARCHITECTURE.md',
          description: 'Comprehensive technical specification including failure mode analysis and schema migrations.'
        }
      ]
    },
    {
      id: 'proj-devflow',
      title: 'DevFlow: Real-Time Collaborative Code Review Workspace',
      tagline: 'Browser-based diff reviewer with operational transform syntax syncing and inline voice room.',
      description: 'A modern developer collaboration tool with live multi-cursor code reviews, Monaco editor integration, and WebRTC audio rooms. Built with modern Web Development stacks and TypeScript.',
      category: 'Frontend & Real-Time Web',
      githubUrl: 'https://github.com/alexrivera-eng/devflow-collaborative',
      liveUrl: 'https://devflow-workspace.vercel.app',
      skillsProved: ['Web Development', 'Data Structures and Algorithms'],
      architectureNotes: 'Custom CRDT engine for sub-15ms character synchronization across geographic regions. State management powered by lightweight immutable proxies.',
      challengesSolved: 'Tackled cursor jitter and scroll desynchronization across variable screen DPI by calculating normalized line/character coordinates.',
      testCoveragePercent: 88,
      commitsCount: 112,
      completedDate: '2026-08-15',
      verifiedByRecruiter: true,
      artifacts: [
        {
          id: 'art-4',
          type: 'live_demo',
          title: 'Interactive Live Sandbox Instance',
          url: 'https://devflow-workspace.vercel.app/session/demo-room',
          description: 'Public test session with simulated multi-user typing and comment threads.'
        },
        {
          id: 'art-5',
          type: 'commit_log',
          title: 'Git Commit Tree: Custom Virtualized Diff Parser',
          url: 'https://github.com/alexrivera-eng/devflow-collaborative/commit/9f81a42',
          description: 'Implemented zero-allocation string chunking to render 10,000-line git diffs in 60fps.'
        }
      ]
    },
    {
      id: 'proj-secureauth',
      title: 'SecureAuth: Zero-Trust Multi-Tenant Auth Service',
      tagline: 'Production-ready authentication microservice with Passkeys (WebAuthn), MFA, and RBAC.',
      description: 'Implemented enterprise security standards including FIDO2 WebAuthn passkey registration, short-lived JWT token rotation with cryptographic refresh tokens, and rate-limiting using sliding window Redis counter.',
      category: 'Security & Cloud',
      githubUrl: 'https://github.com/alexrivera-eng/secure-auth-service',
      liveUrl: 'https://secureauth-api.fly.dev',
      skillsProved: ['Web Development', 'Python'],
      architectureNotes: 'OWASP Top 10 compliance audit passed. Argon2id password hashing parameters tuned to 64MB memory cost. Role-Based Access Control enforced at middleware boundary.',
      challengesSolved: 'Handled clock skew discrepancies in distributed environments by enforcing a 30-second leeway in asymmetric JWT validation.',
      testCoveragePercent: 94,
      commitsCount: 86,
      completedDate: '2026-07-04',
      verifiedByRecruiter: false,
      artifacts: [
        {
          id: 'art-6',
          type: 'github_pr',
          title: 'PR #19: WebAuthn Challenge-Response Cryptographic Validation',
          url: 'https://github.com/alexrivera-eng/secure-auth-service/pull/19',
          description: 'Implemented CBOR decoder and attestation verification for biometrics.'
        }
      ]
    }
  ],
  assessmentResults: [
    {
      id: 'res-web-demo',
      assessmentId: 'assessment-web-development',
      category: 'Web Development',
      skillName: 'Web Development',
      score: 100,
      totalQuestions: 10,
      correctCount: 10,
      incorrectCount: 0,
      percentage: 100,
      skillLevel: 'Advanced',
      timeTakenSeconds: 480,
      passed: true,
      completedAt: '2026-10-25T11:20:00Z',
      userAnswers: { 'web-q1': 1, 'web-q2': 1, 'web-q3': 1, 'web-q4': 0, 'web-q5': 1, 'web-q6': 1, 'web-q7': 2, 'web-q8': 1, 'web-q9': 1, 'web-q10': 1 }
    },
    {
      id: 'res-py-demo',
      assessmentId: 'assessment-python',
      category: 'Python',
      skillName: 'Python',
      score: 90,
      totalQuestions: 10,
      correctCount: 9,
      incorrectCount: 1,
      percentage: 90,
      skillLevel: 'Advanced',
      timeTakenSeconds: 520,
      passed: true,
      completedAt: '2026-10-14T14:32:00Z',
      userAnswers: { 'py-q1': 1, 'py-q2': 1, 'py-q3': 2, 'py-q4': 0, 'py-q5': 1, 'py-q6': 1, 'py-q7': 2, 'py-q8': 0, 'py-q9': 0, 'py-q10': 0 }
    },
    {
      id: 'res-dsa-demo',
      assessmentId: 'assessment-dsa',
      category: 'Data Structures and Algorithms',
      skillName: 'Data Structures and Algorithms',
      score: 90,
      totalQuestions: 10,
      correctCount: 9,
      incorrectCount: 1,
      percentage: 90,
      skillLevel: 'Advanced',
      timeTakenSeconds: 610,
      passed: true,
      completedAt: '2026-10-22T10:15:00Z',
      userAnswers: { 'dsa-q1': 1, 'dsa-q2': 1, 'dsa-q3': 1, 'dsa-q4': 1, 'dsa-q5': 1, 'dsa-q6': 0, 'dsa-q7': 1, 'dsa-q8': 0, 'dsa-q9': 1, 'dsa-q10': 0 }
    },
    {
      id: 'res-java-demo',
      assessmentId: 'assessment-java',
      category: 'Java',
      skillName: 'Java',
      score: 80,
      totalQuestions: 10,
      correctCount: 8,
      incorrectCount: 2,
      percentage: 80,
      skillLevel: 'Proficient',
      timeTakenSeconds: 560,
      passed: true,
      completedAt: '2026-10-18T16:45:00Z',
      userAnswers: { 'java-q1': 0, 'java-q2': 1, 'java-q3': 0, 'java-q4': 1, 'java-q5': 1, 'java-q6': 3, 'java-q7': 2, 'java-q8': 1, 'java-q9': 0, 'java-q10': 1 }
    },
    {
      id: 'res-aiml-demo',
      assessmentId: 'assessment-ai-ml',
      category: 'Artificial Intelligence and Machine Learning',
      skillName: 'Artificial Intelligence and Machine Learning',
      score: 80,
      totalQuestions: 10,
      correctCount: 8,
      incorrectCount: 2,
      percentage: 80,
      skillLevel: 'Proficient',
      timeTakenSeconds: 590,
      passed: true,
      completedAt: '2026-10-28T14:10:00Z',
      userAnswers: { 'aiml-q1': 1, 'aiml-q2': 0, 'aiml-q3': 1, 'aiml-q4': 1, 'aiml-q5': 1, 'aiml-q6': 1, 'aiml-q7': 1, 'aiml-q8': 1, 'aiml-q9': 2, 'aiml-q10': 0 }
    },
    {
      id: 'res-c-demo',
      assessmentId: 'assessment-c-programming',
      category: 'C Programming',
      skillName: 'C Programming',
      score: 70,
      totalQuestions: 10,
      correctCount: 7,
      incorrectCount: 3,
      percentage: 70,
      skillLevel: 'Proficient',
      timeTakenSeconds: 640,
      passed: true,
      completedAt: '2026-10-20T09:30:00Z',
      userAnswers: { 'c-q1': 1, 'c-q2': 1, 'c-q3': 1, 'c-q4': 2, 'c-q5': 1, 'c-q6': 1, 'c-q7': 1, 'c-q8': 0, 'c-q9': 0, 'c-q10': 0 }
    }
  ],
  recruiterNotes: [
    {
      recruiterName: 'Elena Rostova',
      company: 'Datacore Systems',
      rating: 5,
      note: 'Alex shows rare systems maturity for a fresher. Inspecting PR #42 in CloudScale showed solid outbox pattern mastery and benchmark rigor. Fast-tracked for Technical Round 2.',
      decision: 'interview_scheduled',
      evaluatedAt: '2026-10-29T15:20:00Z'
    }
  ]
};

export const BLANK_PROFILE: StudentProfile = {
  id: 'student-new-user',
  passportId: 'PSK-2026-00000-NEW',
  name: 'New Candidate',
  headline: 'Software Engineer in Training',
  bio: 'Add your summary here. Tell recruiters about your engineering journey, university focus, and target roles.',
  university: 'Enter University Name',
  degree: 'Bachelor of Technology / Computer Science',
  graduationYear: '2027',
  location: 'City, Country',
  email: 'candidate@university.edu',
  githubUrl: '',
  linkedinUrl: '',
  portfolioUrl: '',
  targetRole: 'Software Engineer',
  isPublic: true,
  verificationHash: '0x0000000000000000000000000000000000000000',
  skills: [],
  projects: [],
  assessmentResults: [],
  recruiterNotes: []
};
