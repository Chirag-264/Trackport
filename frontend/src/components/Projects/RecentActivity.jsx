import CardSurface from "@/components/shared/CardSurface";
import CardHeading from "@/components/shared/CardHeading";

export default function RecentActivity({ activity }) {
  return (
    <CardSurface>
      <CardHeading title="Recent Activity" description="Latest updates" />

      <ul className="mt-3 space-y-0">
        {activity.map((item, i) => {
          const Icon = item.icon;
          const isLast = i === activity.length - 1;

          return (
            <li key={i} className="relative flex gap-2.5 py-2">
              {!isLast && (
                <span className="absolute left-[11px] top-6 h-[calc(100%-4px)] w-px bg-border" />
              )}
              <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                <Icon className="h-3 w-3" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="truncate text-body leading-snug">
                  {item.title}{" "}
                  {item.target && <span className="font-medium">{item.target}</span>}
                </p>
                <p className="text-caption">{item.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </CardSurface>
  );
}
