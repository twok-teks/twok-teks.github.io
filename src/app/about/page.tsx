import { permanentRedirect } from "next/navigation";

/** Keep existing bookmarks and shared links working after merging About into Home. */
export default function AboutPage() {
  permanentRedirect("/");
}
