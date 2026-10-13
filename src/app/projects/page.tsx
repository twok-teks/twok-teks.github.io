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
        <h1>Projects</h1>
      </section>
      <section className="projects-index" aria-label="Project collection">
        <ProjectFilter projects={projects} />
      </section>
    </div>
  );
}
