import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Brain,
  GitBranch,
  Settings
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {

  const linkStyle =
    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium";

  return (
    <aside
      className="
      w-64
      rounded-[32px]
      bg-white/65
      backdrop-blur-2xl
      border
      border-white/50
      shadow-lg
      p-5
      flex
      flex-col
      "
    >

      <h2 className="text-3xl font-bold mb-8">
        TrackPort
      </h2>

      <nav className="flex flex-col gap-2">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-violet-100 text-violet-700"
                : "hover:bg-white/60"
            }`
          }
        >
          <LayoutDashboard size={20}/>
          Dashboard
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-violet-100 text-violet-700"
                : "hover:bg-white/60"
            }`
          }
        >
          <FolderKanban size={20}/>
          Projects
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-violet-100 text-violet-700"
                : "hover:bg-white/60"
            }`
          }
        >
          <ListTodo size={20}/>
          Tasks
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-violet-100 text-violet-700"
                : "hover:bg-white/60"
            }`
          }
        >
          <Brain size={20}/>
          Analytics
        </NavLink>

        <NavLink
          to="/github"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-violet-100 text-violet-700"
                : "hover:bg-white/60"
            }`
          }
        >
          <GitBranch size={20}/>
          GitHub
        </NavLink>

      </nav>

      <div className="mt-auto">

        <div className="border-t border-slate-200 pt-5 mb-4">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold">
              C
            </div>

            <div>
              <p className="font-semibold">
                Chirag
              </p>

              <p className="text-xs text-slate-500">
                Developer
              </p>
            </div>

          </div>

        </div>

        <NavLink
          to="/settings"
          className={linkStyle}
        >
          <Settings size={20}/>
          Settings
        </NavLink>

      </div>

    </aside>
  );
};

export default Sidebar;