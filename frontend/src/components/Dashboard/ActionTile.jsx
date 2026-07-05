import React from 'react'

function ActionTile({ icon: Icon, title, sub, primary }) {
  return (
    <button
      className={`group flex items-center gap-3 rounded-2xl border p-3 text-left transition-all hover:-translate-y-0.5 ${
        primary
          ? "border-transparent bg-linear-to-br from-primary to-[oklch(0.62_0.22_265)] text-primary-foreground shadow-glow"
          : "border-border bg-background hover:border-primary/30 hover:shadow-soft"
      }`}
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${primary ? "bg-white/20" : "bg-primary-soft text-[oklch(0.4_0.18_278)]"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className={`text-[11px] ${primary ? "text-white/80" : "text-muted-foreground"}`}>{sub}</div>
      </div>
    </button>
  );
}

export default ActionTile