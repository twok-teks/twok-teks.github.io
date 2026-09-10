"use client";

import { useState } from "react";
import { ProjectFeature } from "./project-feature";
import type { Project, ProjectKind } from "@/content/types";

const labels: Record<ProjectKind, string> = {
  "ai-product": "AI product",
  "applied-ml": "Applied ML",
  research: "Research",
};

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const filters = [
    { value: "all", label: "All work" },
    ...Array.from(new Set(projects.map((project) => project.kind))).map(
      (kind) => ({ value: kind, label: labels[kind] }),
    ),
  ];
  const [filter, setFilter] = useState("all");
  const visible = projects.filter(
    (project) => filter === "all" || project.kind === filter,
  );

  return (
    <>
      <div
        className="project-filters"
        role="group"
        aria-label="Filter projects"
      >
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
            <span>
              {
                projects.filter(
                  (project) =>
                    item.value === "all" || project.kind === item.value,
                ).length
              }
            </span>
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>
      <div className="selected-projects">
        {visible.map((project) => (
          <ProjectFeature
            key={project.slug}
            project={project}
            index={projects.indexOf(project)}
          />
        ))}
      </div>
    </>
  );
}
