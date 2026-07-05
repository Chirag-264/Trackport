import React from 'react'
import { Button } from '../ui/button'
import { ArrowUpRight, Badge } from 'lucide-react'

const RecentProjects = ({projects}) => {
  return (
    <div className="card-surface p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold">Recent Projects</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">Your latest projects</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground">
                  View all <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </div>
              <ul className="mt-4 space-y-3">
                {projects.map((p) => (
                  <li key={p.name} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 p-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground">Updated {p.updated}</div>
                    </div>
                    <Badge variant="secondary" className={`rounded-full ${p.tone} hover:${p.tone}`}>{p.status}</Badge>
                  </li>
                ))}
              </ul>
            </div>
  )
}

export default RecentProjects