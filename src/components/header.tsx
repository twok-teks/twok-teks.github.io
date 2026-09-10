"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Icon } from "./icon";
import { ThemeControl } from "./theme-control";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [openedPath, setOpenedPath] = useState<string | null>(null);
  const open = openedPath === pathname;
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpenedPath(null);
        menuButton.current?.focus();
      }
    }
    function outside(event: PointerEvent) {
      if (open && !header.current?.contains(event.target as Node))
        setOpenedPath(null);
    }
    window.addEventListener("keydown", escape);
    window.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", escape);
      window.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header className="site-header" ref={header}>
      <div className="container header-inner">
        <Link
          className="wordmark"
          href="/"
          aria-label={`${site.name}, home`}
          onClick={() => setOpenedPath(null)}
        >
          <Image
            className="brand-mark"
            src="/brand/daisy-logo.png"
            alt=""
            width={28}
            height={28}
            priority
            aria-hidden="true"
          />
          <span>
            {site.name}
            <span className="wordmark-period">.</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-utilities">
          {site.resume ? (
            <a
              className="resume-link"
              href={site.resume}
              target="_blank"
              rel="noreferrer"
            >
              Resume <Icon name="arrow-up-right" size={15} />
            </a>
          ) : (
            <span
              className="resume-unavailable"
              title="A resume has not been supplied yet"
            >
              Resume <span className="availability-dot" aria-hidden="true" />
              <span className="sr-only"> unavailable</span>
            </span>
          )}
          <span className="utility-divider" aria-hidden="true" />
          <ThemeControl />
          <button
            ref={menuButton}
            className="icon-button menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpenedPath(open ? null : pathname)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
      <nav
        className="mobile-nav"
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {[{ href: "/", label: "Home" }, ...links].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
            onClick={() => setOpenedPath(null)}
          >
            {link.label}
            <Icon name="arrow-right" size={16} />
          </Link>
        ))}
      </nav>
    </header>
  );
}
