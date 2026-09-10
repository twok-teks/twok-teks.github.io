"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import type { Game, Interest } from "@/content/types";

type View = "games" | "hobbies" | "midnight";

export function Interests({
  interests,
  games,
}: {
  interests: Interest[];
  games: Game[];
}) {
  const [view, setView] = useState<View>("games");
  const [selectedGame, setSelectedGame] = useState(0);
  const game = games[selectedGame];

  return (
    <div className="personal-console">
      <div
        className="personal-tabs"
        role="tablist"
        aria-label="Personal interests"
      >
        {(
          [
            ["games", "gamepad", "Game shelf"],
            ["hobbies", "waves", "Away from keys"],
            ["midnight", "moon", "12:47 a.m."],
          ] as const
        ).map(([value, icon, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            id={`personal-tab-${value}`}
            aria-selected={view === value}
            aria-controls={`personal-panel-${value}`}
            onClick={() => setView(value)}
          >
            <Icon name={icon} size={17} />
            {label}
          </button>
        ))}
      </div>

      <div
        className="personal-panel"
        role="tabpanel"
        id={`personal-panel-${view}`}
        aria-labelledby={`personal-tab-${view}`}
      >
        {view === "games" && game && (
          <div className="game-browser">
            <div className="game-list" aria-label="Choose a game">
              {games.map((item, index) => (
                <button
                  type="button"
                  key={item.title}
                  aria-pressed={selectedGame === index}
                  onClick={() => setSelectedGame(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.title}
                </button>
              ))}
            </div>
            <article className="game-feature" aria-live="polite">
              <p className="meta-label">{game.aspect}</p>
              <h3>{game.title}</h3>
              <p>{game.comment}</p>
            </article>
          </div>
        )}

        {view === "hobbies" && (
          <div className="hobby-grid">
            {interests.map((interest, index) => (
              <article key={interest.title}>
                <span aria-hidden="true">
                  {index === 0
                    ? "≈"
                    : index === 1
                      ? "↗"
                      : index === 2
                        ? "△"
                        : "□"}
                </span>
                <h3>{interest.title}</h3>
                <p>{interest.description}</p>
              </article>
            ))}
          </div>
        )}

        {view === "midnight" && (
          <div className="midnight-note">
            <div className="imposter-signal" aria-hidden="true">
              <span>00:47</span>
              <strong>ඞ</strong>
            </div>
            <div>
              <p className="meta-label">A familiar crewmate</p>
              <h3>Sometimes imposter syndrome logs on after midnight.</h3>
              <p>
                I let the thought pass, check the evidence, and keep building.
                Usually the suspicious crewmate was just tired.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
