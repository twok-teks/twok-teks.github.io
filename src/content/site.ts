import type { Site } from "./types";

/** A canonical origin, never a relative URL or a deployment subdirectory. */
export function resolveSiteUrl(value: string | undefined): string | null {
  if (!value || !/^https?:\/\//i.test(value.trim())) return null;

  try {
    const url = new URL(value.trim());
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    const publicHostname =
      /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      (!local &&
        (url.protocol !== "https:" || !publicHostname.test(url.hostname)))
    ) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

// Public identity and origin verified against the owner-supplied resume and site.
export const site: Site = {
  name: "Khanh Van",
  nickname: "twok-teks",
  initials: "KV",
  role: "Software engineer · Applied AI",
  description:
    "Khanh Van builds dependable software and applied AI tools. Explore selected projects, engineering experience, and research on LLM hallucination.",
  email: "vnqkhanh02@gmail.com",
  github: "https://github.com/twok-teks",
  linkedin: "https://www.linkedin.com/in/vnqkhanh/",
  resume: "/resume.pdf",
  url:
    resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    "https://twok-teks.space",
  configured: true,
};
