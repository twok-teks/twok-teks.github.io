import { about } from "@/content/about";
import { education } from "@/content/education";
import { experience, researchExperience } from "@/content/experience";
import { projects } from "@/content/projects";
import { publications } from "@/content/publications";
import { site } from "@/content/site";
import github from "./github-snapshot.json";
import research from "./research-snapshot.json";
import resume from "./resume-snapshot.json";
import { loadPublicReadmes } from "./github";
import {
  MAX_SOURCE_CHARACTERS,
  type ChatMessage,
  type SourceDocument,
} from "./types";

const researchPageNumbers = new Set([1, 5, 7, 9, 13, 16, 19, 22, 23, 24, 25]);
const aiResumeExcerpts = resume.text
  .split(/\r?\n/)
  .filter((line) =>
    /\b(?:AI|RAG|LLM|ML-augmented|machine learning|hallucination|multimodal)\b/i.test(
      line,
    ),
  );

/** Imported exclusively by the server route. Public source text is never bundled into the chat UI. */
export function getStaticPortfolioSources(): SourceDocument[] {
  const report = publications.find(
    (publication) => publication.projectSlug === "llm-hallucination-analysis",
  );
  return [
    {
      id: "profile",
      label: "Khanh Van · portfolio",
      url: "/about",
      content: JSON.stringify({
        name: site.name,
        role: site.role,
        description: site.description,
        email: site.email,
        github: site.github,
        linkedin: site.linkedin,
      }),
    },
    {
      id: "resume",
      label: "Khanh Van · résumé",
      url: site.resume || "/resume.pdf",
      content: JSON.stringify(resume),
    },
    {
      id: "ai-experience",
      label: "AI career and research experience",
      url: "/experience",
      content: JSON.stringify({
        resumeExcerpts: aiResumeExcerpts,
        research: researchExperience,
      }),
    },
    {
      id: "ai-projects",
      label: "AI and machine learning projects",
      url: "/projects",
      content: JSON.stringify(
        projects
          .filter((project) =>
            ["ai-product", "applied-ml", "research"].includes(project.kind),
          )
          .map((project) => ({
            title: project.title,
            summary: project.summary,
            impact: project.impact,
            technologies: project.technologies,
          })),
      ),
    },
    {
      id: "experience",
      label: "Professional experience",
      url: "/experience",
      content: `Owner-supplied public professional history. Outcome metrics are résumé claims, not independently audited measurements.\n${JSON.stringify(experience)}`,
    },
    {
      id: "research-experience",
      label: "Research experience",
      url: "/experience",
      content: JSON.stringify(researchExperience),
    },
    {
      id: "education",
      label: "Education",
      url: "/experience",
      content: JSON.stringify(education),
    },
    {
      id: "about",
      label: "About Khanh",
      url: "/about",
      content: JSON.stringify(about),
    },
    {
      id: "research-report",
      label: "LLM hallucination · supplied research report",
      url: report?.href || "/research/hallucination-analysis.pdf",
      content: JSON.stringify({
        source: research.source,
        pages: research.pages.filter((page) =>
          researchPageNumbers.has(page.page),
        ),
      }),
    },
    {
      id: "publications",
      label: "Research and writing",
      url: "/experience",
      content: JSON.stringify(publications),
    },
    {
      id: "github-repositories",
      label: "twok-teks · public GitHub repositories",
      url: "https://github.com/twok-teks",
      content: JSON.stringify({
        source: github.source,
        repositories: github.repositories.map((repository) => ({
          name: repository.name,
          url: repository.url,
          description: repository.description,
          language: repository.language,
          topics: repository.topics,
          archived: repository.archived,
        })),
      }),
    },
    ...projects.map((project) => ({
      id: `project:${project.slug}`,
      label: `${project.title} · case study`,
      url: `/projects/${encodeURIComponent(project.slug)}`,
      content: JSON.stringify({
        title: project.title,
        descriptor: project.descriptor,
        summary: project.summary,
        year: project.year,
        role: project.role,
        status: project.status,
        problem: project.problem,
        solution: project.solution,
        impact: project.impact,
        technologies: project.technologies,
        github: project.github,
        demo: project.demo,
        publication: project.publication,
        sections: project.sections,
      }),
    })),
  ];
}

/** Optional README excerpts yield space before any supplied source is shortened. */
export function combineSourceDocuments(
  required: SourceDocument[],
  optional: SourceDocument[],
): SourceDocument[] {
  const remaining =
    MAX_SOURCE_CHARACTERS -
    required.reduce((sum, source) => sum + source.content.length, 0);
  if (!optional.length || remaining < optional.length * 500) return required;
  if (
    optional.reduce((sum, source) => sum + source.content.length, 0) <=
    remaining
  )
    return [...required, ...optional];
  const perDocument = Math.floor(remaining / optional.length);
  const note =
    "\n[Additional README text omitted to fit the source budget; supplied documents remain complete.]";
  return [
    ...required,
    ...optional.map((source) => ({
      ...source,
      content:
        source.content.length <= perDocument
          ? source.content
          : source.content.slice(0, perDocument - note.length) + note,
    })),
  ];
}

const SELECTED_SOURCE_LIMIT = 18_000;

/** Sends only sources related to the active conversation so provider requests stay small. */
export function selectPortfolioSources(
  sources: SourceDocument[],
  messages: ChatMessage[],
): SourceDocument[] {
  const normalized = messages
    .filter((message) => message.role === "user")
    .slice(-4)
    .map((message) => message.content)
    .join(" ")
    .normalize("NFKC")
    .toLowerCase();
  const catalogue = new Map(sources.map((source) => [source.id, source]));
  const selected: SourceDocument[] = [];
  const selectedIds = new Set<string>();
  let characters = 0;

  const add = (id: string) => {
    const source = catalogue.get(id);
    if (
      !source ||
      selectedIds.has(id) ||
      characters + source.content.length > SELECTED_SOURCE_LIMIT
    )
      return;
    selected.push(source);
    selectedIds.add(id);
    characters += source.content.length;
  };

  const researchQuestion =
    /\b(?:hallucination|research|paper|publication|benchmark|classifier|random forest|logistic regression|confidence|refusal)\b/.test(
      normalized,
    );
  const researchDetailQuestion =
    /\b(?:method|methodology|dataset|prompt design|feature|accuracy|precision|recall|limitation|scope|conclusion|finding|result)\b/.test(
      normalized,
    );
  const aiQuestion =
    /\b(?:ai|artificial intelligence|machine learning|ml|llm|rag|model|fraud detection|data annotation)\b/.test(
      normalized,
    );
  const gitGuideQuestion = /\b(?:gitguide|git guide|git-panion)\b/.test(
    normalized,
  );
  const foliageQuestion = /\b(?:fall foliage|foliage|seasonal window)\b/.test(
    normalized,
  );
  const githubQuestion =
    /\b(?:github|repositories|repository|repos|source code)\b/.test(normalized);
  const projectQuestion = /\b(?:project|projects|build|built|portfolio)\b/.test(
    normalized,
  );
  const experienceQuestion =
    /\b(?:experience|career|work|job|employment|state farm|paycom|alkami|shell|intern)\b/.test(
      normalized,
    );
  const educationQuestion =
    /\b(?:education|school|university|degree|gpa|ut austin|ut dallas)\b/.test(
      normalized,
    );
  const aboutQuestion =
    /\b(?:who is|background|about|nickname|twok-teks|twok teks|interests|hobbies|hobby|games?|gaming|red dead|rdr2|wukong|clair obscur|pragmata|gta|swimming|travel|outdoors|imposter syndrome)\b/.test(
      normalized,
    );
  const matched =
    researchQuestion ||
    aiQuestion ||
    gitGuideQuestion ||
    foliageQuestion ||
    githubQuestion ||
    projectQuestion ||
    experienceQuestion ||
    educationQuestion ||
    aboutQuestion;

  add("profile");

  if (researchQuestion) {
    add("project:llm-hallucination-analysis");
    add("research-experience");
    add("publications");
    if (researchDetailQuestion) add("research-report");
  }
  if (aiQuestion && !researchQuestion) {
    add("ai-experience");
    add("ai-projects");
  }
  if (gitGuideQuestion) {
    add("project:git-guide");
    add("github-repositories");
  }
  if (foliageQuestion) add("project:fall-foliage");
  if (githubQuestion) {
    add("github-repositories");
    add("project:git-guide");
    add("project:fall-foliage");
    add("project:llm-hallucination-analysis");
  }
  if (projectQuestion) {
    add("project:git-guide");
    add("project:fall-foliage");
    add("project:llm-hallucination-analysis");
  }
  if (experienceQuestion && !aiQuestion) {
    add("resume");
    add("experience");
    add("research-experience");
  }
  if (educationQuestion) {
    add("resume");
    add("education");
  }
  if (aboutQuestion) {
    add("resume");
    add("about");
    add("education");
  }
  if (!matched) {
    add("resume");
    add("about");
  }

  return selected;
}
export async function getPortfolioSources(
  signal: AbortSignal,
  messages: ChatMessage[] = [],
): Promise<SourceDocument[]> {
  return selectPortfolioSources(
    combineSourceDocuments(
      getStaticPortfolioSources(),
      await loadPublicReadmes(signal),
    ),
    messages,
  );
}
