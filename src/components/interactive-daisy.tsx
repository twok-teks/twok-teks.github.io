"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/** A small, event-driven interaction — no animation loop while the pointer is idle. */
export function InteractiveDaisy() {
  const flower = useRef<HTMLDivElement>(null);
  const [turns, setTurns] = useState(0);

  useEffect(() => {
    const element = flower.current;
    if (!element) return;
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    function reset() {
      cancelAnimationFrame(frame);
      element!.style.setProperty("--daisy-x", "0px");
      element!.style.setProperty("--daisy-y", "0px");
      element!.style.setProperty("--daisy-lean", "0deg");
    }
    function move(event: PointerEvent) {
      if (!media.matches || event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = element!.getBoundingClientRect();
        const x = Math.max(
          -1,
          Math.min(1, (event.clientX - rect.left - rect.width / 2) / 360),
        );
        const y = Math.max(
          -1,
          Math.min(1, (event.clientY - rect.top - rect.height / 2) / 360),
        );
        element!.style.setProperty("--daisy-x", `${x * 12}px`);
        element!.style.setProperty("--daisy-y", `${y * 8}px`);
        element!.style.setProperty("--daisy-lean", `${x * 18}deg`);
      });
    }
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    media.addEventListener("change", reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      media.removeEventListener("change", reset);
    };
  }, []);

  return (
    <div className="daisy-playground">
      <div className="daisy-follow" ref={flower}>
        <button
          className="daisy-button"
          type="button"
          aria-label="Spin the daisy"
          onClick={() => setTurns((value) => value + 1)}
        >
          <span
            className="daisy-spin"
            style={{ "--daisy-turn": `${turns * 360}deg` } as CSSProperties}
          >
            <Image
              src="/brand/daisy-logo.png"
              alt=""
              width={176}
              height={176}
              priority
              draggable={false}
            />
          </span>
        </button>
      </div>
      <span className="daisy-hint" aria-hidden="true">
        Give it a spin <span>↗</span>
      </span>
    </div>
  );
}
