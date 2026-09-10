import { ImageResponse } from "next/og";
import { SocialImage } from "@/components/social-image";
import { site } from "@/content/site";

export const alt =
  "Practical software. Thoughtful engineering. Engineering portfolio.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <SocialImage
      title="Practical software. Thoughtful engineering."
      description={site.description}
      label="Software engineering / Applied AI"
    />,
    size,
  );
}
