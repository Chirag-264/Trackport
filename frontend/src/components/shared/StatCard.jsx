export default function StatCard({ label, value, icon: Icon, tint }) {
  return (
    <div className="card-surface px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tint}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <span className="truncate text-body font-medium">{label}</span>
          <span className="text-stat font-display shrink-0">{value}</span>
        </div>
      </div>
    </div>
  );
}
