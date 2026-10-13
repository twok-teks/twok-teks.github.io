import Link from "next/link";
import { Icon } from "@/components/icon";

export default function NotFound() {
  return (
    <div className="container not-found">
      <span className="eyebrow">404 / A LOOSE END</span>
      <h1>
        This page took
        <br />a different path
      </h1>
      <p className="lede">This page isn’t here, but there’s more to explore</p>
      <Link className="button button-primary" href="/projects">
        Back to the projects <Icon name="arrow-right" />
      </Link>
    </div>
  );
}
