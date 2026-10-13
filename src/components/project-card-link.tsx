"use client";

import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";

/** CSS paints the highlight; pointer updates do not trigger React renders. */
export function ProjectCardLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (
      event.pointerType !== "mouse" ||
      !window.matchMedia(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  }
  return (
    <Link
      className="project-card-link"
      href={href}
      aria-label={label}
      onPointerMove={move}
    >
      {children}
    </Link>
  );
}
