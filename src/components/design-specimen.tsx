"use client";

import { useState } from "react";
import { Icon } from "./icon";
import { useResolvedTheme } from "./theme-control";

export function DesignSpecimen() {
  const [selection, setSelection] = useState<"light" | "dark" | null>(null);
  const siteTheme = useResolvedTheme();
  const dark = (selection || siteTheme) === "dark";
  return (
    <div
      className="design-specimen"
      data-preview-theme={selection || undefined}
    >
      <div className="specimen-top">
        <span>
          <span className="specimen-logo" /> THE PORTFOLIO SYSTEM
        </span>
        <span>v.01</span>
      </div>
      <div className="specimen-body">
        <div className="specimen-label">
          A SMALL SYSTEM. A CLEAR POINT OF VIEW.
        </div>
        <p className="specimen-title">
          Built with intent<span>.</span>
        </p>
        <p className="specimen-description">
          A little structure.
          <br />
          Room for the work to speak.
        </p>
        <div className="specimen-rule" />
        <div className="specimen-bottom">
          <div className="specimen-type">
            <span>Aa</span>
            <div>
              Inter Variable<small>Precise. Readable. Human.</small>
            </div>
          </div>
          <div
            className="specimen-swatches"
            role="img"
            aria-label="Design palette: near black, gray, off-white, and blue"
          >
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <div className="specimen-controls">
        <span>EXPLORE THE TWO THEMES</span>
        <div role="group" aria-label="Project design preview theme">
          <button
            aria-label="Preview light design"
            aria-pressed={!dark}
            onClick={() => setSelection("light")}
          >
            <Icon name="sun" size={14} />
            <span>Light</span>
          </button>
          <button
            aria-label="Preview dark design"
            aria-pressed={dark}
            onClick={() => setSelection("dark")}
          >
            <Icon name="moon" size={14} />
            <span>Dark</span>
          </button>
        </div>
      </div>
    </div>
  );
}
