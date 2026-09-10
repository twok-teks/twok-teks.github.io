import { site } from "@/content/site";
import Link from "next/link";
import { Icon } from "./icon";

export function Footer() {
  const links = [
    { label: "GitHub", href: site.github },
    { label: "LinkedIn", href: site.linkedin },
    { label: "Email", href: site.email ? `mailto:${site.email}` : null },
    { label: "Resume", href: site.resume },
  ].filter((link) => link.href);
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link href="/" className="footer-identity">
          {site.name}
          <span>{site.role}</span>
        </Link>
        <div className="footer-right">
          <nav aria-label="Footer">
            {links.length ? (
              links.map((link) => (
                <a href={link.href!} key={link.label}>
                  {link.label}
                  <Icon name="arrow-up-right" size={13} />
                </a>
              ))
            ) : (
              <>
                <Link href="/projects">
                  Projects <Icon name="arrow-up-right" size={13} />
                </Link>
                <Link href="/about">
                  About <Icon name="arrow-up-right" size={13} />
                </Link>
              </>
            )}
          </nav>
          <span className="footer-note">
            Thoughtfully built. Always improving.
          </span>
        </div>
      </div>
    </footer>
  );
}
