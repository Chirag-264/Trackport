import React from 'react'
import Row from './Row';

const TaskCompletion = () => {
    const completion = 61.8;
    const circ = 2 * Math.PI * 70;
    const dash = (completion / 100) * circ;
  return (
    <div className="card-surface p-6">
        <div className="flex items-start justify-between">
            <div>
                <h3 className="font-display text-base font-semibold">Task Completion</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Overall progress this cycle</p>
            </div>
        </div>
        <div className="mt-4 flex items-center gap-6">
            <div className="relative h-42 w-42 shrink-0">
                <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="oklch(0.94 0.008 265)" strokeWidth="14" />
                    <circle
                        cx="80" cy="80" r="70" fill="none"
                        stroke="url(#g1)" strokeWidth="14" strokeLinecap="round"
                        strokeDasharray={`${dash} ${circ}`}
                    />
                    <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="oklch(0.55 0.22 278)" />
                        <stop offset="100%" stopColor="oklch(0.68 0.16 200)" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="font-display text-3xl font-semibold">{completion}%</div>
                    <div className="text-[11px] text-muted-foreground">Completed</div>
                </div>
            </div>
            <div className="flex-1 space-y-3 text-sm">
                <Row dot="bg-primary" label="Completed" value="21 (61.8%)" />
                <Row dot="bg-[oklch(0.68_0.16_200)]" label="In Progress" value="8 (23.5%)" />
                <Row dot="bg-border" label="To Do" value="5 (14.7%)" />
            </div>
        </div>
    </div>
  )
}

export default TaskCompletion