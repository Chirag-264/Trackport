import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Brain,
  GitBranch,
  Settings,
  Sparkles,
  ListChecks,
  Code2,
  BarChart3,
  Flame,
  ChevronRight
} from "lucide-react";

import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";

import { NavLink } from "react-router-dom";

const Sidebar = ({className}) => {
  const nav = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: FolderKanban, label: "Projects" },
    { icon: ListChecks, label: "Tasks" },
    { icon: Code2, label: "DSA Tracker" },
    { icon: BarChart3, label: "Analytics" },
    { icon: GitBranch, label: "GitBranch" },
    { icon: Settings, label: "Settings" },
  ];

  const linkStyle =
    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium";

  return (
    <aside
      className={`
        sticky top-6 hidden
        h-auto
        w-64 shrink-0
        lg:flex flex-col

        rounded-3xl
        p-5

        ${className}
      `}
    >

          <div className="flex items-center gap-2.5 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-[oklch(0.65_0.22_260)] text-primary-foreground shadow-glow">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-semibold">TrackPort</span>
          </div>

          <nav className="mt-8 flex flex-col gap-1">
            {nav.map((item) => (
              <button
                key={item.label}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-primary-soft text-[oklch(0.35_0.18_278)]"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="rounded-2xl border border-border bg-secondary/50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Flame className="h-3.5 w-3.5 text-[oklch(0.65_0.2_35)]" />
                12 day streak
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Keep going — solve 2 problems today.</p>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center gap-3 px-1">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">CH</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">Chirag</div>
                <div className="truncate text-xs text-muted-foreground">Developer</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </aside>
  );
};

export default Sidebar;