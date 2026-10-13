import { site } from "@/content/site";

type SocialImageProps = {
  title: string;
  description: string;
  label: string;
  footer?: string;
};

/** Warm editorial composition for Next.js ImageResponse, with no font requests. */
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
        width: "100%",
        height: "100%",
        background: "#f7f5ef",
        color: "#292b26",
        padding: "52px 64px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #deddd2",
          paddingBottom: 24,
        }}
      >
        <span style={{ fontSize: 24 }}>{site.name}</span>
        <span style={{ fontSize: 18, color: "#53664e" }}>{label}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "serif",
            fontSize: title.length > 55 ? 58 : 72,
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-2px",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            lineHeight: 1.5,
            color: "#68695e",
            marginTop: 24,
            maxWidth: 900,
          }}
        >
          {description}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #deddd2",
          paddingTop: 24,
          fontSize: 18,
          color: "#68695e",
        }}
      >
        <span>{footer}</span>
        <span>twok-teks</span>
      </div>
    </div>
  );
}
