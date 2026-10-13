import { site } from "@/content/site";
import { Icon } from "./icon";

export function Footer() {
  const links = [
    { label: "GitHub", href: site.github },
    { label: "LinkedIn", href: site.linkedin },
    { label: "Email", href: site.email ? `mailto:${site.email}` : null },
    { label: "Résumé", href: site.resume },
  ].filter((link) => link.href);
  return (
    <footer className="site-footer container">
      <div className="footer-inner">
        <div className="footer-identity">
          <p>{site.name}</p>
          <span>{site.nickname}</span>
        </div>
        <nav aria-label="Footer">
          {links.map((link) => (
            <a href={link.href!} key={link.label}>
              {link.label}
              <Icon name="arrow-up-right" size={13} />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
