import { Card } from "@/components/ui/card";

export default function TaskCompletionCard({ userData }) {

  const completed = userData.completedTasks;
  const total = userData.totalTasks;

  const percentage = Math.round(
    (completed / total) * 100
  );

  return (
    <Card
      className="
      h-[260px]
      rounded-[28px]
      bg-white/70
      backdrop-blur-2xl
      border
      border-white/40
      shadow-lg
      p-6
      "
    >

      <h2 className="font-semibold text-lg mb-6">
        Task Completion
      </h2>

      <div className="flex justify-center items-center h-[170px]">

        <div
          className="
          h-40
          w-40
          rounded-full
          border-[14px]
          border-violet-500
          flex
          items-center
          justify-center
          "
        >

          <div className="text-center">

            <h3 className="text-5xl font-bold">
              {percentage}%
            </h3>

            <p className="text-slate-500 text-sm">
              Completed
            </p>

          </div>

        </div>

      </div>

    </Card>
  );
}