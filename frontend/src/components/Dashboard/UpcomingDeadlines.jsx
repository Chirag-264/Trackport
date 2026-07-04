import { Card } from "@/components/ui/card";

const deadlines = [
  {
    project: "TrackPort UI",
    days: 2,
  },
  {
    project: "Authentication",
    days: 5,
  },
  {
    project: "Portfolio Website",
    days: 8,
  },
];

export default function UpcomingDeadlines() {
  return (
    <Card className="p-6">

      <h2 className="font-semibold text-lg mb-4">
        Upcoming Deadlines
      </h2>

      <div className="space-y-4">

        {deadlines.map((item) => (
          <div
            key={item.project}
            className="flex justify-between"
          >
            <span>{item.project}</span>

            <span className="text-muted-foreground">
              {item.days} days
            </span>
          </div>
        ))}

      </div>

    </Card>
  );
}