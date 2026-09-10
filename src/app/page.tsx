import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { featuredProjects, additionalProjects } from "@/content/projects";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { publications } from "@/content/publications";
import { about } from "@/content/about";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";
import { ProjectFeature } from "@/components/project-feature";

export const metadata: Metadata = {
  ...(site.url ? { alternates: { canonical: "/" } } : {}),
};

export default function Home() {
  return (
    <>
      <section className="home-hero technical-grid">
        <div className="container hero-inner">
          <div className="hero-topline">
            <p className="eyebrow">
              <span className="status-dot" /> {site.role}
            </p>
            <span className="hero-handle">twok-teks / Khanh Van</span>
          </div>
          <h1>
            Practical software.
            <br />
            <span>Thoughtful engineering.</span>
          </h1>
          <div className="hero-lower">
            <div>
              <p className="hero-description">
                I’m Khanh, a software engineer at State Farm.
                <br />I build backend systems and applied AI.
              </p>
              <div className="hero-actions">
                <Link href="#work" className="button button-primary">
                  View my work <Icon name="arrow-down" />
                </Link>
                {site.github && (
                  <a className="text-link" href={site.github}>
                    GitHub <Icon name="arrow-up-right" size={16} />
                  </a>
                )}
                {site.linkedin && (
                  <a className="text-link" href={site.linkedin}>
                    LinkedIn <Icon name="arrow-up-right" size={16} />
                  </a>
                )}
              </div>
            </div>
            <div className="hero-note">
              <span className="note-cross" aria-hidden="true">
                +
              </span>
              <span>BUILDING AT STATE FARM</span>
              <div className="note-rule" />
              <span>
                M.S. Computer Science
                <br />
                UT Austin · Expected 2027
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <section
          id="work"
          className="section work-section"
          aria-labelledby="work-title"
        >
          <div className="work-heading">
            <div>
              <p className="eyebrow">01 / SELECTED WORK</p>
              <h2 id="work-title">
                Built to be useful<span className="accent">.</span>
              </h2>
            </div>
            <Link className="text-link" href="/projects">
              All projects <Icon name="arrow-right" size={17} />
            </Link>
          </div>
          <div className="selected-projects home-selected-projects">
            {featuredProjects.slice(0, 3).map((project, index) => (
              <ProjectFeature
                key={project.slug}
                project={project}
                index={index}
              />
            ))}
          </div>
          {additionalProjects.length > 0 && (
            <div className="additional-projects">
              <h3>Also built</h3>
              {additionalProjects.map((project) => (
                <Link
                  className="additional-project"
                  href={`/projects/${project.slug}`}
                  key={project.slug}
                >
                  <span>
                    {project.title}
                    <small>{project.summary}</small>
                  </span>
                  <span className="meta-label">
                    {project.technologies.slice(0, 3).join(" · ")}
                  </span>
                  <span>{project.year}</span>
                  <Icon name="arrow-up-right" />
                </Link>
              ))}
            </div>
          )}
        </section>
        <section
          className="section experience-section"
          id="experience"
          aria-labelledby="experience-title"
        >
          <div className="work-heading">
            <div>
              <p className="eyebrow">02 / EXPERIENCE</p>
              <h2 id="experience-title">Engineering in practice.</h2>
            </div>
            <Link className="text-link" href="/experience">
              Full experience <Icon name="arrow-right" size={17} />
            </Link>
          </div>
          <div className="editorial-list">
            {experience.slice(0, 3).map((item) => (
              <article
                className="editorial-row"
                key={`${item.company}-${item.role}`}
              >
                <span className="meta-label">{item.period}</span>
                <div>
                  <h3>{item.company}</h3>
                  <p className="experience-role">{item.role}</p>
                  <ul className="achievement-list">
                    {item.highlights.slice(0, 2).map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  {item.projectSlug && (
                    <Link
                      className="text-link"
                      href={`/projects/${item.projectSlug}`}
                    >
                      Related project <Icon name="arrow-right" />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="section story-section"
          aria-labelledby="story-title"
        >
          <div>
            <p className="eyebrow">03 / THE PERSON</p>
            <h2 id="story-title">
              Khanh, a.k.a.
              <br />
              <span className="accent">twok-teks.</span>
            </h2>
          </div>
          <div className="story-copy">
            <p>{about.story[0] || about.intro}</p>
            <Link className="text-link" href="/about">
              The story behind the name <Icon name="arrow-right" size={17} />
            </Link>
          </div>
        </section>
        {publications.length > 0 && (
          <section className="section">
            <SectionHeading index="04" title="Research" />
            <div className="editorial-list">
              {publications.map((item) => (
                <article className="editorial-row" key={item.title}>
                  <span className="meta-label">{item.year}</span>
                  <div>
                    <h3>
                      <a href={item.href}>
                        {item.title} <Icon name="arrow-up-right" />
                      </a>
                    </h3>
                    <p className="muted">
                      {item.venue} · {item.authors.join(", ")}
                    </p>
                    <div className="publication-actions">
                      <a className="text-link" href={item.href}>
                        Read paper <Icon name="arrow-up-right" size={16} />
                      </a>
                      {item.projectSlug && (
                        <Link
                          className="text-link"
                          href={`/projects/${item.projectSlug}`}
                        >
                          Study overview <Icon name="arrow-right" size={16} />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {education.length > 0 && (
          <section className="section">
            <SectionHeading index="05" title="Education" />
            <div className="education-grid">
              {education.map((item) => (
                <article key={`${item.institution}-${item.degree}`}>
                  <span className="meta-label">{item.period}</span>
                  <h3>{item.institution}</h3>
                  <p>
                    {item.degree} · {item.field}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
