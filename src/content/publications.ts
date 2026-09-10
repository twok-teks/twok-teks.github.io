import type { Publication } from "./types";
export type { Publication } from "./types";

// Author research report, not a claim of peer-reviewed publication.
export const publications: Publication[] = [
  {
    title:
      "Demonstrating Hallucination in Modern LLMs and Training a Response-Level Detector",
    year: "2026",
    venue: "UT Austin · Research report",
    authors: ["Khanh Van"],
    href: "/research/hallucination-analysis.pdf",
    projectSlug: "llm-hallucination-analysis",
  },
];
