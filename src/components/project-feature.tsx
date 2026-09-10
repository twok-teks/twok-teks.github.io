import Link from "next/link";
import type { Project } from "@/content/projects";
import { ProjectMedia } from "./project-media";
import { Icon } from "./icon";

export function ProjectFeature({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const prominent = index === 0;
  return (
    <article
      className={`project-feature ${prominent ? "project-flagship" : "project-secondary"}`}
    >
      <ProjectMedia project={project} />
      <div className="project-story">
        <div className="project-kicker">
          <span className="meta-label">
            {String(index + 1).padStart(2, "0")} / {project.descriptor}
          </span>
          <span className="project-year">{project.year}</span>
        </div>
        <h3>
          <Link href={`/projects/${project.slug}`}>
            {project.title}
            <Icon name="arrow-up-right" size={23} />
          </Link>
        </h3>
        <p className="project-summary">{project.summary}</p>
        {project.impact && (
          <p className="project-evidence">
            {project.previewImpact || project.impact}
          </p>
        )}
        <ul className="technology-list" aria-label="Technologies">
          {project.technologies.slice(0, 4).map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className="project-actions">
          <Link className="text-link" href={`/projects/${project.slug}`}>
            Case study <Icon name="arrow-right" size={16} />
          </Link>
          {project.demo && (
            <a className="text-link" href={project.demo}>
              Try it <Icon name="arrow-up-right" size={15} />
            </a>
          )}
          {project.github && (
            <a className="text-link" href={project.github}>
              Code <Icon name="arrow-up-right" size={15} />
            </a>
          )}
          {project.publication && (
            <a className="text-link" href={project.publication}>
              Paper <Icon name="arrow-up-right" size={15} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
