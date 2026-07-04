import { Card } from "@/components/ui/card";

export default function RecentProjects({userData}) {
  console.log(userData.recentProjects);
  const projects = userData?.recentProjects || [];
  return (
      <Card className="rounded-3xl p-6 bg-white/90">

        <div className="flex justify-between items-center mb-5">

          <h2 className="font-semibold">
            Recent Projects
          </h2>

          <span className="text-sm text-violet-600">
            View all
          </span>

        </div>

        <div className="space-y-4">

          {projects.map(project => (

            <div
              key={project._id}
              className="rounded-xl border p-4 hover:bg-slate-50"
            >

              <div className="flex justify-between">

                <h3 className="font-medium">
                  {project.title}
                </h3>

                <span className="text-xs text-slate-500">
                  Active
                </span>

              </div>

              <div className="mt-3 h-2 bg-slate-100 rounded-full">

                <div
                  className="h-2 bg-violet-500 rounded-full w-3/5"
                />

              </div>

            </div>

          ))}

        </div>

      </Card>
      );
}