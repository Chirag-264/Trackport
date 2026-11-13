import { TrendingUp } from "lucide-react";
import CardSurface from "@/components/shared/CardSurface";
import CardHeading from "@/components/shared/CardHeading";

const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

const LEVELS = [
  "bg-secondary/80",
  "bg-[oklch(0.68_0.16_155)]/35",
  "bg-[oklch(0.68_0.16_155)]/60",
  "bg-[oklch(0.68_0.16_155)]/85",
  "bg-[oklch(0.68_0.16_155)]",
];

const WEEKS = [
  [0, 2, 1, 3, 2, 1, 0],
  [1, 3, 2, 4, 2, 0, 1],
  [2, 1, 4, 3, 3, 2, 0],
  [1, 3, 2, 4, 1, 3, 2],
  [3, 2, 1, 2, 4, 1, 0],
  [2, 3, 4, 1, 2, 3, 1],
  [1, 2, 3, 3, 2, 4, 0],
];

const totalCommits = WEEKS.flat().reduce((sum, level) => sum + level, 0);

export default function GithubHeatmap() {
  return (
    <CardSurface>
      <div className="flex items-start justify-between gap-2">
        <CardHeading title="GitHub Activity" description="Last 7 weeks" />
        <span className="flex shrink-0 items-center gap-1 rounded-md bg-[oklch(0.94_0.05_155)]/60 px-2 py-0.5 text-caption font-medium text-[oklch(0.38_0.14_155)]">
          <TrendingUp className="h-3 w-3" />
          +18%
        </span>
      </div>

      <div className="mt-3 flex gap-1.5">
        <div className="flex flex-col gap-0.5 pt-4">
          {WEEKDAYS.map((day, i) => (
            <span
              key={i}
              className="flex h-2.5 items-center text-[9px] leading-none text-muted-foreground"
            >
              {day}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex gap-0.5">
            {WEEKS.map((week, wi) => (
              <div key={wi} className="flex flex-1 flex-col gap-0.5">
                {week.map((level, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className={`aspect-square w-full max-h-2.5 rounded-[2px] ${LEVELS[level]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-caption text-muted-foreground">Total commits</span>
        <span className="text-body font-display font-semibold">{totalCommits}</span>
      </div>
    </CardSurface>
  );
}
