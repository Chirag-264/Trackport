import WelcomeBanner from "@/components/Dashboard/WelcomeBanner.jsx";
import StatsGrid from "@/components/Dashboard/StatsGrid.jsx";
import TaskCompletionCard from "@/components/Dashboard/TaskCompletionCard.jsx";
import UpcomingDeadlines from "@/components/Dashboard/UpcomingDeadlines.jsx";
import DsaTracker from "@/components/Dashboard/DsaTracker.jsx";
import GithubOverview from "@/components/Dashboard/GithubOverview.jsx";
import RecentProjects from "@/components/Dashboard/RecentProjects.jsx";
import QuickActions from "@/components/Dashboard/QuickActions.jsx";

export default function Dashboard() {

  const User = {
    name: "Chirag",
  };

  const userData = {
    totalProjects: 12,
    totalTasks: 48,
    completedTasks: 29,
    pendingTasks: 19,
    upcomingDeadlines: 4,
  };

  return (
    <div className="space-y-5">

      <WelcomeBanner user={User} />

      <StatsGrid userData={userData} />

      <div className="grid grid-cols-12 gap-5">

        <div className="col-span-4">
          <TaskCompletionCard userData={userData} />
        </div>

        <div className="col-span-4">
          <UpcomingDeadlines />
        </div>

        <div className="col-span-4">
          <DsaTracker />
        </div>

      </div>

      <div className="grid grid-cols-12 gap-5">

        <div className="col-span-5">
          <GithubOverview />
        </div>

        <div className="col-span-4">
          <RecentProjects userData={userData}/>
        </div>

        <div className="col-span-3">
          <QuickActions />
        </div>

      </div>

    </div>
  );
}