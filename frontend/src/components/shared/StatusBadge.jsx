import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  "In Progress": "bg-primary-soft text-[oklch(0.4_0.18_278)] hover:bg-primary-soft",
  Completed: "bg-[oklch(0.94_0.05_155)] text-[oklch(0.38_0.14_155)] hover:bg-[oklch(0.94_0.05_155)]",
  Planned: "bg-[oklch(0.95_0.03_235)] text-[oklch(0.4_0.15_235)] hover:bg-[oklch(0.95_0.03_235)]",
  Planning: "bg-[oklch(0.96_0.05_65)] text-[oklch(0.42_0.14_65)] hover:bg-[oklch(0.96_0.05_65)]",
};

export default function StatusBadge({ status, className }) {
  return (
    <Badge
      variant="secondary"
      className={cn("rounded-full text-caption font-medium", STATUS_STYLES[status], className)}
    >
      {status}
    </Badge>
  );
}

export { STATUS_STYLES };
