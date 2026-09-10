import type { CSSProperties } from "react";

const paths: Record<string, React.ReactNode> = {
  "arrow-down": <path d="M12 4v16m-6-6 6 6 6-6" />,
  "arrow-right": <path d="M4 12h16m-6-6 6 6-6 6" />,
  "arrow-left": <path d="M20 12H4m6-6-6 6 6 6" />,
  "arrow-up-right": <path d="M6 18 18 6M6 6h12v12" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  moon: <path d="M20.5 14.5A9 9 0 0 1 9.5 3.5a9 9 0 1 0 11 11Z" />,
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8m-4-4v4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  github: (
    <path
      d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.8c3.3-.4 6.7-1.6 6.7-7.2A5.6 5.6 0 0 0 19.2 4a5 5 0 0 0-.2-4s-1.2-.4-4 1.5a14 14 0 0 0-7 0C5.2-.4 4 0 4 0a5 5 0 0 0-.2 4A5.6 5.6 0 0 0 2.3 8c0 5.6 3.4 6.8 6.7 7.2A3.5 3.5 0 0 0 8 18v4"
      transform="translate(1 2) scale(.86)"
    />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  code: <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" />
    </>
  ),
  school: (
    <>
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11.5V17c3 3 9 3 12 0v-5.5M22 9v6" />
    </>
  ),
  research: (
    <>
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />
      <path d="M7 16h10" />
    </>
  ),
  gamepad: (
    <>
      <path d="M8 8h8a5 5 0 0 1 4.8 6.4l-1 3A2.2 2.2 0 0 1 16.2 19L14 17h-4l-2.2 2a2.2 2.2 0 0 1-3.6-1.6l-1-3A5 5 0 0 1 8 8Z" />
      <path d="M7 12v4m-2-2h4m6-1h.01m2 3h.01" />
    </>
  ),
  waves: (
    <path d="M2 8c2 2 4 2 6 0s4-2 6 0 4 2 8 0M2 13c2 2 4 2 6 0s4-2 6 0 4 2 8 0M2 18c2 2 4 2 6 0s4-2 6 0 4 2 8 0" />
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
};

export function Icon({
  name,
  size = 18,
  style,
  className = "",
}: {
  name: string;
  size?: number;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <svg
      className={`icon ${className}`}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths["arrow-up-right"]}
    </svg>
  );
}
