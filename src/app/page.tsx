import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { homeIntro } from "@/content/about";
import { Icon } from "@/components/icon";
import { InteractiveDaisy } from "@/components/interactive-daisy";

export const metadata: Metadata = {
  ...(site.url ? { alternates: { canonical: "/" } } : {}),
};

export default function Home() {
  return (
    <div className="container home-page">
      <section className="home-intro" aria-labelledby="intro-title">
        <div className="intro-copy">
          <p className="eyebrow">
            Software Engineer <span aria-hidden="true">/</span> {site.nickname}
          </p>
          <h1 id="intro-title">{site.name}</h1>
          <p className="intro-background">
            SWE @ <strong>State Farm</strong>
            <br />
            M.S. in Computer Science @ <strong>UT Austin</strong>
          </p>
          <div className="hero-actions">
            {site.resume && (
              <a
                className="button button-secondary"
                href={site.resume}
                download
              >
                Download résumé <Icon name="arrow-down" size={16} />
              </a>
            )}
          </div>
        </div>
        <InteractiveDaisy />
      </section>
      <section
        className="home-experience"
        aria-labelledby="home-experience-title"
      >
        <Link className="experience-invitation" href="/experience">
          <h2 id="home-experience-title">The path so far</h2>
          <span>
            Experience <Icon name="arrow-right" size={17} />
          </span>
        </Link>
      </section>
      <p className="offscreen-note">
        <span>Off-screen</span>
        {homeIntro.offscreen}
      </p>
    </div>
  );
}
