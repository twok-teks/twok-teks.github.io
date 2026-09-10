import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Interests } from "@/components/interests";
import { about } from "@/content/about";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  ...(site.url ? { alternates: { canonical: "/about" } } : {}),
  description:
    "Meet Khanh Van beyond the résumé: the twok-teks story, favorite games, travel, swimming, and life outside code.",
};

export default function AboutPage() {
  return (
    <div className="container secondary-page about-page">
      <header className="page-hero about-hero-personal">
        <div className="about-hero-copy">
          <p className="eyebrow">Off the clock</p>
          <h1>
            More than the résumé<span className="accent">.</span>
          </h1>
          <p className="lede">{about.intro}</p>
        </div>
        <aside className="handle-card" aria-label="twok-teks name card">
          <div className="handle-card-top">
            <span>ALIAS / 01</span>
            <span className="status-dot" />
          </div>
          <strong>twok-teks</strong>
          <p>The Wrath of Khan × technologies</p>
        </aside>
      </header>

      <section className="section about-grid" aria-labelledby="handle-title">
        <div className="section-heading">
          <span className="section-index">01 / THE HANDLE</span>
          <h2 id="handle-title">A name that stuck.</h2>
        </div>
        <div className="about-story reading-column">
          {about.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <Link className="text-link" href="/projects">
            See what I build <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>

      <section className="section about-grid" aria-labelledby="now-title">
        <div className="section-heading">
          <span className="section-index">02 / RIGHT NOW</span>
          <h2 id="now-title">Current signals.</h2>
          <p className="muted">A small, frequently changing snapshot.</p>
        </div>
        <dl className="currently-cards">
          {about.currently.map((item, index) => (
            <div key={item.label}>
              <span aria-hidden="true">0{index + 1}</span>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section about-grid" aria-labelledby="outside-title">
        <div className="section-heading">
          <span className="section-index">03 / AFTER HOURS</span>
          <h2 id="outside-title">Pick a side quest.</h2>
          <p className="muted">Games, hobbies, and one late-night visitor.</p>
        </div>
        <Interests interests={about.interests} games={about.games} />
      </section>
    </div>
  );
}
