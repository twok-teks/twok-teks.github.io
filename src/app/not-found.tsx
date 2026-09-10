import Link from "next/link";
import { Icon } from "@/components/icon";

export default function NotFound() {
  return (
    <div className="container not-found">
      <span className="eyebrow">404 / A LOOSE END</span>
      <h1>
        This page took
        <br />a different path.
      </h1>
      <p className="lede">
        The link may have changed, or this page doesn’t exist.
        <br />
        There’s still work worth exploring.
      </p>
      <Link className="button button-primary" href="/projects">
        Back to the projects <Icon name="arrow-right" />
      </Link>
    </div>
  );
}
