export default function PageHeading({ title, description, children }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-page-title font-display">{title}</h1>
        {description && (
          <p className="text-body mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {children}
        </div>
      )}
    </div>
  );
}
