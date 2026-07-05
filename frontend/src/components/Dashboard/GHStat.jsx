import React from 'react'

function GHStat({ icon: Icon, value, label }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3">
      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/70">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>

        <div>
          <div className="text-[11px] text-muted-foreground">
            {label}
          </div>

          <div className="font-display text-2xl font-semibold leading-none">
            {value}
          </div>
        </div>

      </div>
    </div>
  );
}

export default GHStat;