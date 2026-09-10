/**
 * Public portfolio content. Only add facts and links verified by the owner.
 * Keep unavailable destinations null or undefined rather than inventing URLs.
 */
export interface Site {
  nickname?: string;
  name: string;
  initials: string;
  role: string;
  description: string;
  email: string | null;
  github: string | null;
  linkedin: string | null;
  resume: string | null;
  url: string | null;
  configured: boolean;
}

export interface ProjectSection {
  title: string;
  body: string;
}

/** Serializable project media; React diagrams belong in presentation components. */
export type ContentMedia =
  | {
      type: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      caption: string;
      priority?: boolean;
    }
  | {
      type: "video";
      src: string;
      poster?: string;
      label: string;
      captions: string;
      caption: string;
    }
  | {
      type: "code";
      code: string;
      language: string;
      caption: string;
    }
  | {
      type: "pdf";
      src: string;
      label: string;
      pageCount: number;
      caption: string;
    };

export type ProjectKind = "ai-product" | "applied-ml" | "research";

export interface Project {
  slug: string;
  title: string;
  descriptor: string;
  summary: string;
  year: string;
  role: string;
  status: string;
  featured: boolean;
  kind: ProjectKind;
  problem: string;
  solution: string;
  impact: string;
  previewImpact?: string;
  technologies: string[];
  github?: string;
  demo?: string;
  media: ContentMedia[];
  company?: string;
  confidential?: boolean;
  publication?: string;
  sections: ProjectSection[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
  technologies: string[];
  projectSlug?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  period: string;
}

export interface Publication {
  title: string;
  year: string;
  venue: string;
  authors: string[];
  href: string;
  projectSlug?: string;
}

export interface Interest {
  title: string;
  description: string;
}

export interface Game {
  title: string;
  comment: string;
  aspect?: string;
}

export interface Pet {
  name: string;
  role: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}

export interface About {
  intro: string;
  story: string[];
  currently: { label: string; value: string }[];
  interests: Interest[];
  games: Game[];
  pets: Pet[];
}
