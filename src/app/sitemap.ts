import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.configured || !site.url) return [];

  const routes = [
    "",
    "/projects",
    "/experience",
    "/about",
    ...projects.map((project) => `/projects/${project.slug}`),
  ];

  return routes.map((route) => ({ url: `${site.url}${route}` }));
}
