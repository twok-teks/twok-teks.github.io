import Image from "next/image";
import type { ReactNode } from "react";
import type { Experience } from "@/content/types";
import { Icon } from "./icon";

const marks: Record<string, string> = {
  "State Farm": "SF",
  Paycom: "P",
  "Alkami Technology": "A",
  "Royal Dutch Shell": "S",
  "The University of Texas at Austin": "UT",
  "The University of Texas at Dallas": "UTD",
};

const organizationLogos: Record<string, string> = {
  "State Farm": "/organizations/state-farm.png",
  Paycom: "/organizations/paycom.png",
  "Alkami Technology": "/organizations/alkami.png",
  "Royal Dutch Shell": "/organizations/shell.svg",
  "The University of Texas at Austin": "/organizations/ut-austin.png",
  "The University of Texas at Dallas": "/organizations/ut-dallas.svg",
};

function OrganizationMark({
  organization,
  fallbackIcon,
  school = false,
}: {
  organization: string;
  fallbackIcon: "briefcase" | "research" | "school";
  school?: boolean;
}) {
  const logo = organizationLogos[organization];

  return (
    <span
      className={`organization-mark${school ? " organization-mark-school" : ""}${logo ? " organization-mark-logo" : ""}`}
      role="img"
      aria-label={`${organization} logo`}
      data-organization={organization}
    >
      {logo ? (
        <Image src={logo} alt="" width={44} height={44} unoptimized />
      ) : (
        <>
          <Icon name={fallbackIcon} size={18} />
          <b>{marks[organization] || organization.slice(0, 2)}</b>
        </>
      )}
    </span>
  );
}

export function ExperienceCard({
  item,
  type,
  defaultOpen = false,
  children,
}: {
  item: Experience;
  type: "industry" | "research";
  defaultOpen?: boolean;
  children?: ReactNode;
}) {
  return (
    <details className="career-card" open={defaultOpen || undefined}>
      <summary>
        <OrganizationMark
          organization={item.company}
          fallbackIcon={type === "industry" ? "briefcase" : "research"}
        />
        <span className="career-card-heading">
          <span className="eyebrow">{item.company}</span>
          <h3>{item.role}</h3>
          <span>{item.summary}</span>
        </span>
        <span className="career-card-period">{item.period}</span>
        <span className="career-card-toggle" aria-hidden="true">
          <Icon name="plus" size={18} />
        </span>
      </summary>
      <div className="career-card-details">
        {item.highlights.length > 0 && (
          <ul>
            {item.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        )}
        {item.technologies.length > 0 && (
          <ul className="technology-list" aria-label="Technologies">
            {item.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        )}
        {children}
      </div>
    </details>
  );
}

export function SchoolMark({ institution }: { institution: string }) {
  return (
    <OrganizationMark organization={institution} fallbackIcon="school" school />
  );
}
