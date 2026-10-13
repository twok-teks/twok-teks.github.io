"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Key by the full path so transitions also cover sibling project details. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="page-transition" key={pathname}>
      {children}
    </div>
  );
}
