import { ImageResponse } from "next/og";
import { SocialImage } from "@/components/social-image";
import { site } from "@/content/site";

export const alt = "Khanh Van. Thoughtful software. Built for the real world.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <SocialImage
      title="Thoughtful software. Built for the real world."
      description={site.description}
      label="Software engineering / Applied AI"
    />,
    size,
  );
}
