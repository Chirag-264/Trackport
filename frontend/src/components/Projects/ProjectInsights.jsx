import { HardDrive, HeartPulse, TrendingUp, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CardSurface from "@/components/shared/CardSurface";
import CardHeading from "@/components/shared/CardHeading";
import {
  contributors,
  languages,
  repoHealth,
  storageUsed,
  commitTrend,
} from "@/data/projects";

function InsightBlock({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-3">
      <div className="flex items-center gap-2 text-caption font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function ProjectInsights() {
  const storagePct = Math.round((storageUsed.used / storageUsed.total) * 100);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <InsightBlock icon={Users} title="Recent Contributors">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {contributors.map((c) => (
              <Avatar key={c.initials} className="h-7 w-7 border-2 border-background">
                <AvatarFallback className="bg-primary-soft text-caption font-semibold text-[oklch(0.4_0.18_278)]">
                  {c.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-caption text-muted-foreground">+2 this week</span>
        </div>
      </InsightBlock>

      <InsightBlock icon={HeartPulse} title="Repository Health">
        <div className="flex items-baseline gap-2">
          <span className="text-stat font-display">{repoHealth.score}</span>
          <span className="text-caption text-[oklch(0.38_0.14_155)]">{repoHealth.trend} pts</span>
        </div>
      </InsightBlock>

      <InsightBlock icon={HardDrive} title="Storage Used">
        <div className="space-y-2">
          <div className="flex justify-between text-caption">
            <span>
              {storageUsed.used} / {storageUsed.total} {storageUsed.unit}
            </span>
            <span>{storagePct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${storagePct}%` }}
            />
          </div>
        </div>
      </InsightBlock>

      <InsightBlock icon={TrendingUp} title="Commit Trend">
        <div className="flex items-end gap-1.5">
          {commitTrend.map((bar) => (
            <div key={bar.week} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-[oklch(0.68_0.16_155)]/70"
                style={{ height: `${bar.count}px` }}
              />
              <span className="text-[10px] text-muted-foreground">{bar.week}</span>
            </div>
          ))}
        </div>
      </InsightBlock>

      <div className="rounded-xl border border-border bg-background/50 p-3 sm:col-span-2">
        <p className="text-caption font-medium text-muted-foreground">Languages Used</p>
        <div className="mt-2 flex h-2 overflow-hidden rounded-full">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className={lang.color}
              style={{ width: `${lang.pct}%` }}
              title={`${lang.name} ${lang.pct}%`}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {languages.map((lang) => (
            <span key={lang.name} className="flex items-center gap-1.5 text-caption">
              <span className={`h-2 w-2 rounded-full ${lang.color}`} />
              {lang.name} {lang.pct}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsTableFooter() {
  return (
    <div className="space-y-4 border-t border-border pt-4">
      <div className="flex justify-center">
        <Button variant="outline" className="rounded-xl bg-background shadow-soft">
          Load More
        </Button>
      </div>
      <CardHeading title="Workspace Insights" description="Summary across all repositories" />
      <ProjectInsights />
    </div>
  );
}
