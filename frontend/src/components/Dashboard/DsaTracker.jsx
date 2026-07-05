import React, { useState } from "react";
import { Flame, Target } from "lucide-react";

const DsaTracker = () => {
const [dailyGoal, setDailyGoal] = useState(2);
const solvedToday = 2;
const solvedDates = [
  "2026-07-01",
  "2026-07-02",
  "2026-07-03",
  "2026-07-05",
  "2026-07-06",
  "2026-07-08",
];

const monthGrid = getMonthGrid(solvedDates);

const weekdays = [
  "M",
  "T",
  "W",
  "T",
  "F",
  "S",
  "S",
];

const goalPct = Math.min(
100,
Math.round((solvedToday / Math.max(1, dailyGoal)) * 100)
);

function getMonthGrid(solvedDates) {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);

  const lastDay = new Date(year, month + 1, 0);

  const startOffset =
    (firstDay.getDay() + 6) % 7;

  const totalDays = lastDay.getDate();

  const cells = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);

    const key = date.toISOString().split("T")[0];

    cells.push({
      day,
      solved: solvedDates.includes(key),
    });
  }

  return cells;
}

return ( <div className="card-surface relative overflow-hidden p-5"> <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-primary-soft/50 blur-3xl" />

  <div className="relative">
    {/* Header */}
    <div className="flex items-start justify-between">
        <div>
            <h3 className="flex items-center gap-1.5 font-display text-base font-semibold">
            DSA Progress
            <Flame className="h-4 w-4 text-[oklch(0.65_0.2_35)]" />
            </h3>

            <p className="mt-0.5 text-xs text-muted-foreground">
            Keep the streak alive
            </p>
        </div>

        <div className="rounded-lg px-3 py-1 font-semibold text-base">
            {new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
            })}
        </div>
        </div>

    {/* Stats */}
    <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border bg-background/60 p-3">
            <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-[oklch(0.65_0.2_35)]" />

            <span className="font-display text-2xl font-semibold">
                12
            </span>

            <span className="text-xs text-muted-foreground">
                Day Streak
            </span>
            </div>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-3">
            <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />

            <span className="font-display text-2xl font-semibold">
                48
            </span>

            <span className="text-xs text-muted-foreground">
                Solved Month
            </span>
            </div>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-3">
            <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[oklch(0.68_0.16_155)]" />

            <span className="font-display text-2xl font-semibold">
                {solvedToday}/{dailyGoal}
            </span>

            <span className="text-xs text-muted-foreground">
                Daily Goal
            </span>
            </div>
        </div>
        </div>
    {/* Heatmap */}
    <div className="mt-4 ml-6">

        <div className="mb-1 grid grid-cols-7 gap-1.5">
            {weekdays.map((day, i) => (
                <div
                key={i}
                className="flex h-6 w-6 items-center justify-center text-[9px] text-muted-foreground"
                >
                {day}
                </div>
            ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
            {monthGrid.map((cell, index) => (
                <div
                key={index}
                className={`
                    h-6
                    w-6
                    rounded-md
                    transition-all

                    ${
                    !cell
                        ? "opacity-0"
                        : cell.solved
                        ? "bg-[oklch(0.68_0.16_155)]"
                        : "bg-gray-300"
                    }
                `}
                />
            ))}
        </div>
        </div>

    {/* Goal */}
    
  </div>
</div>


);
};

export default DsaTracker;
