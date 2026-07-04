import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock3,
  CalendarDays,
} from "lucide-react";

import StatCard from "./StatCard";

export default function StatsGrid({ userData }) {
  const stats = [
    {
      title: "Total Projects",
      value: userData.totalProjects,
      subtitle: `${userData.inProgressProjects || 0} in progress`,
      icon: FolderKanban,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },

    {
      title: "Total Tasks",
      value: userData.totalTasks,
      subtitle: "All tasks",
      icon: ListTodo,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },

    {
      title: "Completed Tasks",
      value: userData.completedTasks,
      subtitle: `${Math.round(
        (userData.completedTasks / userData.totalTasks) * 100 || 0
      )}% completed`,
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
      title: "Pending Tasks",
      value: userData.pendingTasks,
      subtitle: "Need attention",
      icon: Clock3,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },

    {
      title: "Deadlines",
      value: userData.upcomingDeadlines || 0,
      subtitle: "Next 7 days",
      icon: CalendarDays,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          {...stat}
        />
      ))}
    </div>
  );
}