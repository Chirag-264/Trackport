import React from 'react'
import { Button } from '../ui/button';
import { ArrowUpRight } from 'lucide-react';

const OngoingTasks = ({ongoingTasks}) => {
    const VISIBLE_TASKS = 4;
    const visibleTasks = ongoingTasks.slice(0, VISIBLE_TASKS);
    const hasMore = ongoingTasks.length > VISIBLE_TASKS;
  return (
    <div className="card-surface flex flex-col p-6">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="font-display text-base font-semibold">Ongoing Tasks</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Currently in progress</p>
            </div>
                {hasMore && (
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground">
                        View all <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                )}
        </div>
        <ul className="mt-3 divide-y divide-border">
            {visibleTasks.map((d) => (
                <li key={d.name} className="flex items-center gap-3 py-2">
                    <span
                        className={`h-7 w-1 rounded-full ${
                            d.priority === "high" ? "bg-[oklch(0.62_0.22_25)]" : d.priority === "med" ? "bg-[oklch(0.72_0.16_65)]" : "bg-border"
                        }`}
                    />
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{d.name}</div>
                    </div>
                    <div className="text-right">
                        <div className={`text-sm font-medium ${d.days <= 3 ? "text-[oklch(0.55_0.22_25)]" : "text-foreground"}`}>{d.due}</div>
                        <div className="text-[10px] text-muted-foreground">{d.days} days left</div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default OngoingTasks