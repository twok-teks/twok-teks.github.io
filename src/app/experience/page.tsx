import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceCard, SchoolMark } from "@/components/experience-card";
import { Icon } from "@/components/icon";
import { education } from "@/content/education";
import {
  experience as experiences,
  researchExperience,
} from "@/content/experience";
import { publications } from "@/content/publications";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Experience",
  ...(site.url ? { alternates: { canonical: "/experience" } } : {}),
  description:
    "Khanh Van's professional experience, AI research, and computer science education.",
};

export default function ExperiencePage() {
  return (
    <div className="container secondary-page experience-page">
      <header className="page-hero experience-hero">
        <p className="eyebrow">Career record</p>
        <h1>
          From idea to production<span className="accent">.</span>
        </h1>
        <p className="lede">
          Backend systems, reliable releases, and applied AI.
        </p>
        {site.resume && (
          <a className="button button-secondary" href={site.resume}>
            View résumé <Icon name="arrow-up-right" size={16} />
          </a>
        )}
      </header>

      <nav className="experience-jumpbar" aria-label="Experience sections">
        <a href="#industry">
          <Icon name="briefcase" size={19} />
          <span>
            <strong>{experiences.length}</strong> Industry roles
          </span>
        </a>
        <a href="#research">
          <Icon name="research" size={19} />
          <span>
            <strong>{researchExperience.length}</strong> Research tracks
          </span>
        </a>
        <a href="#education">
          <Icon name="school" size={19} />
          <span>
            <strong>{education.length}</strong> Degrees
          </span>
        </a>
      </nav>

      <section
        className="section career-section"
        id="industry"
        aria-labelledby="industry-title"
      >
        <div className="section-heading experience-section-heading">
          <div>
            <span className="section-index">01 / INDUSTRY</span>
            <h2 id="industry-title">Built in production.</h2>
          </div>
          <p className="muted">Select a role to open the details.</p>
        </div>
        <div className="career-list">
          {experiences.map((item, index) => (
            <ExperienceCard
              key={`${item.company}-${item.role}`}
              item={item}
              type="industry"
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </section>

      <section
        className="section career-section"
        id="research"
        aria-labelledby="research-title"
      >
        <div className="section-heading experience-section-heading">
          <div>
            <span className="section-index">02 / RESEARCH</span>
            <h2 id="research-title">Questions worth testing.</h2>
          </div>
        </div>
        <div className="career-list">
          {researchExperience.map((item, index) => {
            const report = item.projectSlug
              ? publications.find(
                  (publication) => publication.projectSlug === item.projectSlug,
                )
              : undefined;
            return (
              <ExperienceCard
                key={`${item.company}-${item.role}`}
                item={item}
                type="research"
                defaultOpen={index === 0}
              >
                {(item.projectSlug || report) && (
                  <div className="publication-actions">
                    {item.projectSlug && (
                      <Link
                        className="text-link"
                        href={`/projects/${item.projectSlug}`}
                      >
                        Study overview <Icon name="arrow-right" size={16} />
                      </Link>
                    )}
                    {report && (
                      <a className="text-link" href={report.href}>
                        Read report <Icon name="arrow-up-right" size={16} />
                      </a>
                    )}
                  </div>
                )}
              </ExperienceCard>
            );
          })}
        </div>
      </section>

      <section
        className="section career-section"
        id="education"
        aria-labelledby="education-title"
      >
        <div className="section-heading experience-section-heading">
          <div>
            <span className="section-index">03 / EDUCATION</span>
            <h2 id="education-title">Foundations.</h2>
          </div>
        </div>
        <div className="education-cards">
          {education.map((item) => (
            <article
              className="education-card"
              key={`${item.institution}-${item.degree}`}
            >
              <SchoolMark institution={item.institution} />
              <p className="meta-label">{item.period}</p>
              <h3>{item.institution}</h3>
              <p>
                {item.degree} · {item.field}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="secondary-closing"
        aria-labelledby="experience-next-title"
      >
        <div>
          <p className="eyebrow">See it in context</p>
          <h2 id="experience-next-title">Explore the implementation.</h2>
        </div>
        <Link className="button button-secondary" href="/projects">
          Browse projects <Icon name="arrow-right" size={16} />
        </Link>
      </section>
    </div>
  );
}
