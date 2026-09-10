import type { Project } from "./types";
export type { Project } from "./types";

// Sources: public repositories and the owner-supplied April 2026 report.
export const projects: Project[] = [
  {
    slug: "git-guide",
    previewImpact:
      "13 visual lessons · 8 missions · AI help when you get stuck",
    title: "GitGuide",
    descriptor: "AI learning product",
    summary:
      "A visual Git course with a browser sandbox, guided missions, and an AI companion.",
    year: "2026",
    role: "Application development",
    status: "Live",
    featured: true,
    kind: "ai-product",
    problem:
      "Git commands are easy to memorize and hard to understand. Learners need to see repository state change and practice safely.",
    solution:
      "I built a visual roadmap, a browser-based Git sandbox, state-validated missions, and a read-only AI companion for explanations.",
    impact:
      "The learning flow includes 13 lessons and eight validated missions. Learners can inspect repository state while practicing a focused set of Git commands.",
    technologies: ["Next.js", "TypeScript", "isomorphic-git", "Groq", "React"],
    github: "https://github.com/twok-teks/git-guide",
    demo: "https://git-guide-sand.vercel.app",
    media: [
      {
        type: "image",
        src: "/projects/git-guide/homepage.png",
        alt: "GitGuide home page introducing its visual Git learning experience",
        width: 1440,
        height: 900,
        caption: "Start with a visual path through Git.",
        priority: true,
      },
      {
        type: "image",
        src: "/projects/git-guide/learning-roadmap.png",
        alt: "GitGuide learning roadmap connecting Git lessons",
        width: 1200,
        height: 1500,
        caption: "A branch-style roadmap connects thirteen lessons.",
      },
      {
        type: "image",
        src: "/projects/git-guide/staging-area-lesson.png",
        alt: "GitGuide staging area lesson with an interactive repository diagram",
        width: 1440,
        height: 1050,
        caption: "Lessons turn Git state into something learners can see.",
      },
      {
        type: "image",
        src: "/projects/git-guide/playground-sandbox.png",
        alt: "GitGuide browser sandbox for practicing Git commands",
        width: 1600,
        height: 1200,
        caption: "The browser sandbox provides a safe place to practice.",
      },
      {
        type: "image",
        src: "/projects/git-guide/playground-predict.png",
        alt: "GitGuide prediction exercise in the interactive playground",
        width: 1600,
        height: 1300,
        caption: "Prediction exercises test the learner's mental model.",
      },
      {
        type: "image",
        src: "/projects/git-guide/playground-quickfire.png",
        alt: "GitGuide quick-fire practice exercise",
        width: 1440,
        height: 1100,
        caption: "Quick-fire practice reinforces core commands.",
      },
    ],
    sections: [
      {
        title: "See the mental model",
        body: "The branch-style roadmap ties each lesson to the Git concept it teaches: working tree, staging area, commits, and branches.",
      },
      {
        title: "Practice in the browser",
        body: "isomorphic-git and LightningFS create repository state in the browser. Missions validate the result, and remote operations stay simulated.",
      },
      {
        title: "Ask Git-panion",
        body: "A server-side Groq integration explains Git and points learners to related lessons. It cannot run commands or inspect a personal repository.",
      },
    ],
  },
  {
    slug: "fall-foliage",
    previewImpact: "17 locations · 3 foliage stages · weather-based estimates",
    title: "Fall Foliage",
    descriptor: "Applied machine learning",
    summary:
      "A machine learning app that estimates fall-color timing from weather and daylight inputs.",
    year: "2025",
    role: "Modeling & application development",
    status: "Live",
    featured: true,
    kind: "applied-ml",
    problem:
      "Peak foliage changes with local conditions. A useful planner needs to translate weather signals into clear seasonal windows.",
    solution:
      "I connected location-specific scikit-learn models to a Flask interface using temperature, precipitation, and daylight inputs.",
    impact:
      "The app supports 17 U.S. locations and returns early-, mid-, or late-month windows for three foliage stages from September through November.",
    technologies: ["Python", "scikit-learn", "Flask", "pandas", "NumPy"],
    github: "https://github.com/twok-teks/Fall_Foliage_ML_Model",
    demo: "https://fall-foliage-ml-model.vercel.app",
    media: [
      {
        type: "image",
        src: "/projects/fall-foliage/fallml1.png",
        alt: "Fall Foliage prediction app location and weather input screen",
        width: 2094,
        height: 1269,
        caption: "Location and weather inputs feed the prediction pipeline.",
        priority: true,
      },
      {
        type: "image",
        src: "/projects/fall-foliage/fallml2.png",
        alt: "Fall Foliage app displaying predicted seasonal color windows",
        width: 1944,
        height: 1265,
        caption: "Model output becomes a practical seasonal window.",
      },
    ],
    sections: [
      {
        title: "Model local conditions",
        body: "Each supported location has a saved model and daylight groups. The app assembles the feature columns expected by that model.",
      },
      {
        title: "Translate the output",
        body: "The prediction layer converts model output into nine seasonal windows and keeps the three foliage stages in order.",
      },
      {
        title: "Ship the full flow",
        body: "Flask serves the forms and results, pandas structures inputs, joblib loads models, and NumPy applies output constraints.",
      },
      {
        title: "Read it as an estimate",
        body: "The project demonstrates the implementation and its 17-location scope. It does not claim independent forecast accuracy or current conditions.",
      },
    ],
  },
  {
    slug: "llm-hallucination-analysis",
    previewImpact: "93.3% held-out accuracy · 892 responses · 4 LLMs",
    title: "When LLMs get it wrong",
    descriptor: "AI reliability research",
    summary:
      "A four-model hallucination benchmark and a lightweight response-level detector.",
    year: "2026",
    role: "Research author",
    status: "Research report",
    featured: true,
    kind: "research",
    problem:
      "Fluent answers can still be wrong. I examined hallucination, confidence, and refusal together, then tested whether response-level signals could identify failures.",
    solution:
      "I evaluated four models on 223 prompts, collected 892 responses, and compared Logistic Regression with Random Forest detectors.",
    impact:
      "On 179 held-out responses, Random Forest reached 93.3% accuracy, 87.5% recall, and 70.0% precision. These are within-distribution benchmark results.",
    technologies: [
      "Python",
      "PyTorch",
      "Transformers",
      "scikit-learn",
      "pandas",
    ],
    github: "https://github.com/twok-teks/llm-hallucination-analysis",
    publication: "/research/hallucination-analysis.pdf",
    media: [
      {
        type: "pdf",
        src: "/research/hallucination-analysis.pdf",
        label:
          "Demonstrating Hallucination in Modern LLMs and Training a Response-Level Detector",
        pageCount: 26,
        caption: "Browse the complete 26-page research report.",
      },
    ],
    sections: [
      {
        title: "Build a shared benchmark",
        body: "TinyLlama, Phi-3 Mini, Mistral 7B, and LLaMA 3.1 received the same easy, hard, trap, and adversarial prompts.",
      },
      {
        title: "Detect after generation",
        body: "The detector uses confidence, refusal, length, prompt category, and model identity. It scores completed responses rather than verifying claims against external evidence.",
      },
      {
        title: "Read the result carefully",
        body: "At a 0.40 threshold, Random Forest found 21 of 24 held-out hallucinations with nine false positives—eleven fewer than Logistic Regression at the same recall.",
      },
      {
        title: "Know the limits",
        body: "This is a demonstration study. Simple prompts, heuristic labels, and a four-model distribution limit generalization; token confidence is not truth probability.",
      },
    ],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const additionalProjects = projects.filter(
  (project) => !project.featured,
);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
