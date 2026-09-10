export function SectionHeading({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          <span className="section-index">{index}</span> / {title}
        </p>
        <h2>{title}</h2>
      </div>
      {description && <p className="muted">{description}</p>}
    </div>
  );
}
