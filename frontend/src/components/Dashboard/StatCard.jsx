import { Card } from "@/components/ui/card";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <Card
      className="
      h-32
      rounded-[28px]
      bg-white/70
      backdrop-blur-2xl
      border
      border-white/40
      shadow-lg
      px-5
      py-4
      "
    >

      <div className="flex justify-between h-full">

        <div>

          <p className="text-xs text-slate-500 font-medium">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>

          <p className="text-xs text-slate-500 mt-2">
            {subtitle}
          </p>

        </div>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>

      </div>

    </Card>
  );
}