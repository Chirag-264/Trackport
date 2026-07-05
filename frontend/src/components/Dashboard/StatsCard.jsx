import React from 'react'

const StatsCard = ({ s }) => {
  return (
    <div className="card-surface px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex items-center gap-3">

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.tint}`}
        >
          <s.icon className="h-5 w-5" />
        </div>

        <div className="flex flex-1 items-center justify-between min-w-0">
          <span className="truncate text-lg font-semibold">
            {s.label}
          </span>

          <span className="font-display text-2xl font-semibold">
            {s.value}
          </span>
        </div>

      </div>
    </div>
  )
}

export default StatsCard