import { site } from "@/content/site";

type SocialImageProps = {
  title: string;
  description: string;
  label: string;
  footer?: string;
};

/** Shared composition for Next.js ImageResponse; no browser or font requests. */
export function SocialImage({
  title,
  description,
  label,
  footer = site.role,
}: SocialImageProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#fafaf9",
        color: "#191b20",
        padding: "52px 64px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          display: "flex",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {Array.from({ length: 31 }, (_, index) => (
          <div
            key={`vertical-${index}`}
            style={{
              position: "absolute",
              top: 0,
              left: index * 40,
              height: "100%",
              width: 1,
              background: "#eceeed",
            }}
          />
        ))}
        {Array.from({ length: 16 }, (_, index) => (
          <div
            key={`horizontal-${index}`}
            style={{
              position: "absolute",
              top: index * 40,
              left: 0,
              height: 1,
              width: "100%",
              background: "#eceeed",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          fontSize: 23,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: "#2855d9",
            }}
          />
          <span>{site.name}</span>
        </div>
        <span style={{ color: "#62656e", fontSize: 18 }}>{label}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: title.length > 55 ? 58 : 72,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-3px",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 25,
            lineHeight: 1.5,
            color: "#62656e",
            marginTop: 25,
            maxWidth: 880,
          }}
        >
          {description}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #dedfdf",
          paddingTop: 24,
          fontSize: 18,
          color: "#62656e",
        }}
      >
        <span>{footer}</span>
        <span>
          {site.configured ? "Engineering portfolio" : "Content preview"}
        </span>
      </div>
    </div>
  );
}
