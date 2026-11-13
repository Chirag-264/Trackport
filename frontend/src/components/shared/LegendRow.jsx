export default function LegendRow({ dot, label, value }) {
  return (
    <div className="flex items-center gap-2 text-body">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <span className="truncate text-muted-foreground">{label}</span>
      <span className="ml-auto shrink-0 font-medium">{value}</span>
    </div>
  );
}
