import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { ProjectFilter } from "@/components/project-filter";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Khanh Van’s projects in applied AI, machine learning, and software engineering.",
  ...(site.url ? { alternates: { canonical: "/projects" } } : {}),
};

export default function ProjectsPage() {
  return (
    <div className="container">
      <section className="page-hero">
        <p className="eyebrow">PROJECTS</p>
        <h1>
          Ideas, made tangible<span className="accent">.</span>
        </h1>
        <p className="lede">
          Useful software. Open code. Lessons from building both.
        </p>
      </section>
      <section className="projects-index" aria-label="Project collection">
        <ProjectFilter projects={projects} />
      </section>
    </div>
  );
}
