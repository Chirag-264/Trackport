export default function CardHeading({ title, description }) {
  return (
    <div>
      <h3 className="text-section-title font-display">{title}</h3>
      {description && (
        <p className="text-caption mt-0.5">{description}</p>
      )}
    </div>
  );
}
