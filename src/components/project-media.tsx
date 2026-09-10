import type { Project } from "@/content/projects";
import { ProjectGallery } from "./project-gallery";

export function ProjectMedia({
  project,
  variant = "preview",
}: {
  project: Project;
  variant?: "preview" | "detail";
}) {
  return (
    <ProjectGallery
      items={project.media}
      title={project.title}
      variant={variant}
    />
  );
}
