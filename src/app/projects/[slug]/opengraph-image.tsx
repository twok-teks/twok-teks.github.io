import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { SocialImage } from "@/components/social-image";
import { getProject, projects } from "@/content/projects";

export const alt = "Project title and summary from Khanh Van's portfolio.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return new ImageResponse(
    <SocialImage
      title={project.title}
      description={project.summary}
      label="Project case study"
      footer={project.descriptor}
    />,
    size,
  );
}
