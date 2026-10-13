import Image from "next/image";
import type { Project } from "@/content/projects";
import { ProjectCardLink } from "./project-card-link";
import { Icon } from "./icon";

export function ProjectFeature({ project }: { project: Project }) {
  const preview = project.media.find((item) => item.type === "image");
  return (
    <article className="project-card">
      <ProjectCardLink
        href={`/projects/${project.slug}`}
        label={`Open ${project.title} case study`}
      >
        <div className={`project-preview preview-${project.kind}`}>
          {preview?.type === "image" ? (
            <Image
              src={preview.src}
              alt={preview.alt}
              width={preview.width}
              height={preview.height}
              sizes="(max-width: 600px) 90vw, 420px"
            />
          ) : (
            <div className="research-cover" aria-hidden="true">
              <span className="research-cover-label">
                Notes on AI reliability
              </span>
              <span className="research-cover-title">
                Confidence
                <br />
                <em>≠ correctness.</em>
              </span>
              <span className="research-cover-rule" />
              <span className="research-cover-foot">
                A four-model hallucination study · 2026
              </span>
            </div>
          )}
        </div>
        <div className="project-card-copy">
          <p className="project-category">
            {project.descriptor} <span>· {project.year}</span>
          </p>
          <h3>
            {project.title}
            <Icon name="arrow-up-right" size={19} />
          </h3>
          <p className="project-summary">
            {project.summary.replace(/\.$/, "")}
          </p>
          <ul className="technology-list" aria-label="Technologies">
            {project.technologies.slice(0, 3).map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>
      </ProjectCardLink>
    </article>
  );
}
