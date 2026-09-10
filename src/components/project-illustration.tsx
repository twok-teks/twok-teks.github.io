import { Icon } from "./icon";

export function ProjectIllustration({ slug }: { slug: string }) {
  if (slug === "git-guide")
    return (
      <div className="project-media project-illustration gitguide-illustration">
        <div className="illustration-label">
          <span>GITGUIDE</span>
          <span>ILLUSTRATED WORKFLOW</span>
        </div>
        <div className="gitguide-diagram">
          <div className="diagram-wordmark">
            <Icon name="code" size={24} />
            <span>
              Understand the branch.
              <br />
              <strong>Then make the commit.</strong>
            </span>
          </div>
          <svg
            className="git-branch-diagram"
            viewBox="0 0 360 120"
            role="img"
            aria-label="A Git branch splits from the main line, receives commits, and merges back."
          >
            <path className="git-main-line" d="M24 85H336" />
            <path
              className="git-topic-line"
              d="M88 85C118 85 118 32 150 32H216C246 32 246 85 280 85"
            />
            <g className="git-main-node">
              <circle cx="24" cy="85" r="6" />
              <circle cx="88" cy="85" r="6" />
              <circle cx="192" cy="85" r="6" />
              <circle cx="280" cy="85" r="6" />
              <circle cx="336" cy="85" r="6" />
            </g>
            <g className="git-topic-node">
              <circle cx="150" cy="32" r="6" />
              <circle cx="216" cy="32" r="6" />
            </g>
            <text x="26" y="112">
              main
            </text>
            <text x="148" y="14">
              try-an-idea
            </text>
          </svg>
          <div className="git-assistant-note">
            <span className="assistant-spark" aria-hidden="true">
              ✦
            </span>
            <p>
              A Git question?<span>Git-panion helps connect the dots.</span>
            </p>
            <Icon name="arrow-up-right" size={16} />
          </div>
        </div>
        <p className="illustration-caption">
          VISUAL LESSONS · REAL GIT SANDBOX · AI GUIDE
        </p>
      </div>
    );

  if (slug === "fall-foliage")
    return (
      <div className="project-media project-illustration foliage-illustration">
        <div className="illustration-label">
          <span>FALL FOLIAGE</span>
          <span>MODEL WORKFLOW</span>
        </div>
        <div className="foliage-flow">
          <div className="weather-inputs">
            <span>Temperature</span>
            <span>Precipitation</span>
            <span>Daylight</span>
          </div>
          <span className="flow-connector" aria-hidden="true" />
          <div className="foliage-leaf" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none">
              <path d="M49 9C25 8 9 19 13 35c3 12 22 14 30 3 6-9 4-18 6-29Z" />
              <path d="M12 53 40 23m-18 18-1-12m10 2 12-1" />
            </svg>
          </div>
          <span className="flow-connector" aria-hidden="true" />
          <div className="foliage-result">
            Peak
            <br />
            <strong>window</strong>
          </div>
        </div>
        <p className="illustration-caption">
          WEATHER PATTERNS → SEASONAL PREDICTIONS
        </p>
      </div>
    );

  if (slug === "llm-hallucination-analysis")
    return (
      <div className="project-media project-illustration research-illustration">
        <div className="illustration-label">
          <span>LLM RELIABILITY</span>
          <span>RESEARCH STUDY</span>
        </div>
        <div className="research-statement">
          <span>Confidence</span>
          <span className="not-equal" aria-hidden="true">
            ≠
          </span>
          <span>Correctness</span>
          <span className="sr-only">
            Confidence does not equal correctness.
          </span>
        </div>
        <div className="research-pipeline">
          <span>Prompt</span>
          <Icon name="arrow-right" size={14} />
          <span>Response</span>
          <Icon name="arrow-right" size={14} />
          <span className="detector-label">Detector</span>
        </div>
        <p className="illustration-caption">
          BENCHMARK · BEHAVIOR · RESPONSE-LEVEL DETECTION
        </p>
      </div>
    );

  return null;
}
