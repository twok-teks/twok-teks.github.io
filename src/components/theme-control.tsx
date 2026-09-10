"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "./icon";

type Theme = "system" | "light" | "dark";
const choices: Theme[] = ["system", "light", "dark"];
const event = "portfolio-theme-change";

function current(): Theme {
  const value = document.documentElement.dataset.preference;
  return choices.includes(value as Theme) ? (value as Theme) : "system";
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  function sync() {
    applyTheme(current());
    callback();
  }
  function storage(e: StorageEvent) {
    if (e.key === "portfolio-theme" || e.key === null) {
      applyTheme(
        choices.includes(e.newValue as Theme)
          ? (e.newValue as Theme)
          : "system",
      );
      callback();
    }
  }
  window.addEventListener(event, callback);
  window.addEventListener("storage", storage);
  media.addEventListener("change", sync);
  return () => {
    window.removeEventListener(event, callback);
    window.removeEventListener("storage", storage);
    media.removeEventListener("change", sync);
  };
}

function applyTheme(preference: Theme) {
  const resolved =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference;
  document.documentElement.dataset.preference = preference;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", resolved === "dark" ? "#141517" : "#fafaf9");
}

export function ThemeControl() {
  const theme = useSyncExternalStore(
    subscribe,
    current,
    () => "system" as Theme,
  );
  function cycle() {
    const next = choices[(choices.indexOf(theme) + 1) % choices.length];
    applyTheme(next);
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      /* Theme still works without storage. */
    }
    window.dispatchEvent(new Event(event));
  }
  return (
    <button
      className="icon-button theme-control"
      onClick={cycle}
      aria-label={`Theme: ${theme}. Switch to ${choices[(choices.indexOf(theme) + 1) % choices.length]} theme.`}
      title={`Theme: ${theme}`}
    >
      <Icon
        name={
          theme === "system" ? "monitor" : theme === "dark" ? "moon" : "sun"
        }
      />
    </button>
  );
}

export function useResolvedTheme() {
  return useSyncExternalStore(
    subscribe,
    () =>
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    () => "light",
  );
}
