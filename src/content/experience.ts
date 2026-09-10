import type { Experience } from "./types";
export type { Experience } from "./types";

// Source: the owner-supplied Khanh_Resume.pdf. Approximations remain marked.
export const experience: Experience[] = [
  {
    company: "State Farm",
    role: "Software Engineer II",
    period: "Mar 2026 – Present",
    summary:
      "Enterprise policy APIs, cloud modernization, and AI tools for engineering knowledge.",
    highlights: [
      "Built policy APIs handling ~1M requests per day.",
      "Architected a multi-source RAG system for context-aware answers across internal engineering documentation.",
      "Led the first-place team in State Farm’s 2026 Hackathon with an AI collision-reconstruction app selected for productization.",
      "Cut deployment time by ~25% during AWS modernization and reduced cross-domain request latency by up to 150 ms.",
    ],
    technologies: ["Java", "Go", "Python", "AWS", "PostgreSQL", "Kubernetes"],
  },
  {
    company: "Paycom",
    role: "Software Developer II",
    period: "Jun 2025 – Mar 2026",
    summary:
      "Production scheduling, attendance exceptions, and release automation.",
    highlights: [
      "Reduced scheduling bugs and errors by ~30% through stronger validation.",
      "Expanded automated workflow tests and release confidence.",
      "Automated builds, tests, and deployments with GitLab CI/CD.",
    ],
    technologies: ["PHP", "C#", "React", "MySQL", "GitLab CI/CD"],
  },
  {
    company: "Alkami Technology",
    role: "Software Engineer Intern",
    period: "Jun 2024 – Sep 2024",
    summary: "Backend engineering for real-time fraud detection and alerts.",
    highlights: [
      "Built a rule-based, ML-augmented service with over 90% detection accuracy.",
      "Connected PostgreSQL and REST APIs to fraud-alert workflows.",
    ],
    technologies: [
      "Java",
      "Python",
      "scikit-learn",
      "Spring Boot",
      "PostgreSQL",
      "AWS",
    ],
  },
  {
    company: "Royal Dutch Shell",
    role: "Retail IT Intern",
    period: "Jun 2019 – Aug 2020",
    summary: "Location-aware retail features and backend integration.",
    highlights: [
      "Built a geofenced arrival feature with Google Maps for real-time station notifications.",
      "Contributed to REST APIs and helped reduce deployment delays by 12%.",
    ],
    technologies: ["C++", "Google Maps API", "REST APIs", "ServiceNow"],
  },
];

export const researchExperience: Experience[] = [
  {
    company: "The University of Texas at Austin",
    role: "Hallucination Analysis in LLMs",
    period: "Jan 2026 – May 2026",
    summary:
      "Built a four-model benchmark and trained a response-level hallucination detector.",
    highlights: [
      "Collected 892 responses across easy, hard, trap, and adversarial prompts.",
      "Reached 93.3% accuracy on 179 held-out responses within the study distribution.",
    ],
    technologies: ["Python", "PyTorch", "Transformers", "scikit-learn"],
    projectSlug: "llm-hallucination-analysis",
  },
  {
    company: "The University of Texas at Dallas",
    role: "Research Associate",
    period: "Oct 2024 – May 2025",
    summary:
      "Annotated multimodal meme data for dataset construction and AI research.",
    highlights: [],
    technologies: [],
  },
];
