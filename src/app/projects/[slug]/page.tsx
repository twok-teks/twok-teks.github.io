import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { ProjectMedia } from "@/components/project-media";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  const image = `/projects/${project.slug}/opengraph-image`;
  return {
    title: project.title,
    description: project.summary,
    ...(site.url
      ? { alternates: { canonical: `/projects/${project.slug}` } }
      : {}),
    ...(!site.configured ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [image],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const sections = [
    { id: "problem", title: "The problem", body: project.problem },
    { id: "solution", title: "What I built", body: project.solution },
    ...project.sections.map((section, index) => ({
      ...section,
      id: `detail-${index + 1}`,
    })),
    { id: "result", title: "The result", body: project.impact },
  ].filter((section) => section.body);

  const currentIndex = projects.findIndex(
    (candidate) => candidate.slug === project.slug,
  );
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <div className="container secondary-page case-study-page">
      <header className="detail-hero">
        <Link className="breadcrumb text-link" href="/projects">
          <Icon name="arrow-left" size={16} /> All projects
        </Link>
        <p className="eyebrow">Project case study</p>
        <h1>{project.title}</h1>
        <p className="detail-descriptor">{project.descriptor}</p>
        <p className="lede">{project.summary}</p>
        <dl className="detail-meta">
          <div>
            <dt className="meta-label">Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt className="meta-label">Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt className="meta-label">Status</dt>
            <dd>{project.status}</dd>
          </div>
        </dl>
        {(project.demo || project.github || project.publication) && (
          <div className="detail-actions">
            {project.publication && (
              <a className="button button-primary" href={project.publication}>
                Read paper <Icon name="arrow-up-right" size={16} />
              </a>
            )}
            {project.demo && (
              <a className="button button-primary" href={project.demo}>
                Try the project <Icon name="arrow-up-right" size={16} />
              </a>
            )}
            {project.github && (
              <a className="button button-secondary" href={project.github}>
                View source <Icon name="arrow-up-right" size={16} />
              </a>
            )}
          </div>
        )}
      </header>

      <div className="case-study-media">
        <ProjectMedia project={project} variant="detail" />
      </div>

      <div className="detail-layout">
        <aside className="detail-sidebar" aria-label="Project information">
          <nav aria-label="On this page">
            <p className="meta-label">On this page</p>
            <ol className="case-study-toc">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="case-study-stack">
            <p className="meta-label">Built with</p>
            <ul className="technology-list" aria-label="Technologies">
              {project.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="case-study-prose reading-column">
          {sections.map((section, index) => (
            <section
              className="detail-section"
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              key={section.id}
            >
              <p className="section-index">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>

      <nav className="secondary-closing" aria-label="More projects">
        <div>
          <p className="eyebrow">Next project</p>
          <h2>{nextProject.title}</h2>
        </div>
        <Link
          className="button button-secondary"
          href={`/projects/${nextProject.slug}`}
        >
          Continue <Icon name="arrow-right" size={16} />
        </Link>
      </nav>
    </div>
  );
}
