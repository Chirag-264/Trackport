import CardSurface from "@/components/shared/CardSurface";
import CardHeading from "@/components/shared/CardHeading";
import LegendRow from "@/components/shared/LegendRow";

const SEGMENTS = [
  { label: "In Progress", count: 3, color: "oklch(0.55 0.22 278)", dot: "bg-primary" },
  { label: "Completed", count: 2, color: "oklch(0.68 0.16 155)", dot: "bg-[oklch(0.68_0.16_155)]" },
  { label: "Planned", count: 2, color: "oklch(0.68 0.13 235)", dot: "bg-[oklch(0.68_0.13_235)]" },
  { label: "Planning", count: 1, color: "oklch(0.72 0.16 65)", dot: "bg-[oklch(0.72_0.16_65)]" },
];

const TOTAL = SEGMENTS.reduce((sum, s) => sum + s.count, 0);
const R = 56;
const CIRC = 2 * Math.PI * R;

const SEGMENT_ARCS = SEGMENTS.reduce((acc, seg) => {
  const dash = (seg.count / TOTAL) * CIRC;
  const offset = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
  acc.push({ ...seg, dash, offset });
  return acc;
}, []);

export default function ProjectOverview() {
  return (
    <CardSurface>
      <CardHeading title="Project Overview" description="Status breakdown" />

      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={R}
              fill="none"
              stroke="oklch(0.94 0.008 265)"
              strokeWidth="12"
            />
            {SEGMENT_ARCS.map((seg) => (
              <circle
                key={seg.label}
                cx="64"
                cy="64"
                r={R}
                fill="none"
                stroke={seg.color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${seg.dash} ${CIRC - seg.dash}`}
                strokeDashoffset={-seg.offset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-stat font-display">{TOTAL}</span>
            <span className="text-caption">Total</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {SEGMENTS.map((seg) => (
            <LegendRow
              key={seg.label}
              dot={seg.dot}
              label={seg.label}
              value={`${seg.count} (${Math.round((seg.count / TOTAL) * 100)}%)`}
            />
          ))}
        </div>
      </div>
    </CardSurface>
  );
}
