import React from 'react'
import { GitBranch, ArrowUpRight, GitCommit, GitPullRequest } from 'lucide-react'
import { Button } from '../ui/button'
import GHStat from './GHStat'

const GithubOverview = ({activity}) => {
    return (
        <div className="card-surface p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <h3 className="font-display text-base font-semibold flex items-center gap-2">
                        <GitBranch className="h-4 w-4" /> GitHub Overview
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">Your coding activity at a glance</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground">
                    View details <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                    <GHStat icon={GitCommit} value="124" label="Commits" />
                    <GHStat icon={GitBranch} value="8" label="Repos" />
                    <GHStat icon={GitPullRequest} value="3" label="PRs" />
                </div>

                <ul className="mt-5 space-y-3">
                    {activity.map((a, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <a.icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                        <div className="text-sm">
                            <span className="text-muted-foreground">{a.text}</span>{" "}
                            <span className="font-medium">{a.target}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">{a.time}</div>
                        </div>
                    </li>
                    ))}
                </ul>
                </div>
    )
}

export default GithubOverview