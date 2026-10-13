"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Icon } from "./icon";
import { ThemeControl } from "./theme-control";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
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
          <span>{site.name}</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={
                (
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href)
                )
                  ? "page"
                  : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-utilities">
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
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={
              (
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)
              )
                ? "page"
                : undefined
            }
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
