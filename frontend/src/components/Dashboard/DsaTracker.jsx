import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";

export default function DsaTracker() {

  const streak = 12;
  const bestStreak = 23;

  return (
    <Card className="rounded-3xl p-6 bg-white/90">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="font-semibold">
            DSA Tracker
          </h2>

          <p className="text-sm text-muted-foreground">
            Consistency matters
          </p>
        </div>

        <Flame className="text-orange-500" />
      </div>

      <div className="mt-6">

        <h3 className="text-5xl font-bold">
          {streak}
        </h3>

        <p className="text-muted-foreground">
          Current Streak
        </p>

      </div>

      <div className="mt-4 flex justify-between text-sm">

        <span>Best Streak</span>

        <span className="font-medium">
          {bestStreak} days
        </span>

      </div>

      <div className="mt-6 flex gap-2">

        {[1,1,1,1,0,1,1].map((day,index)=>(
          <div
            key={index}
            className={`h-8 flex-1 rounded-lg ${
              day
                ? "bg-green-500"
                : "bg-slate-200"
            }`}
          />
        ))}

      </div>

    </Card>
  );
}