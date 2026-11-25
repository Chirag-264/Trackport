import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Code2,
  BarChart3,
  Settings,
  LogOut,
  Layers,
  ChevronDown,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar({ onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Projects", to: "/projects", icon: FolderKanban },
    { label: "Tasks", to: "/tasks", icon: ListTodo },
    { label: "DSA Tracker", to: "/dsa", icon: Code2 },
    { label: "Analytics", to: "/analytics", icon: BarChart3 },
  ];

  const getInitials = (name) => {
    if (!name) return "C";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 1).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
    if (onCloseMobile) onCloseMobile();
  };

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between p-5 lg:p-6 bg-white/55 dark:bg-slate-900/50 backdrop-blur-2xl border-r border-slate-200/50 dark:border-white/10 select-none h-full">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between px-2 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
              <Layers className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
              TrackPort
            </span>
          </div>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#EDE9FE] dark:bg-purple-950/60 text-[#7C3AED] dark:text-purple-300 font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Actions & User Profile */}
      <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/60">
        <nav className="space-y-1">
          <NavLink
            to="/settings"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#EDE9FE] dark:bg-purple-950/60 text-[#7C3AED] dark:text-purple-300 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`
            }
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span>Settings</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-all text-left"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </button>
        </nav>

        {/* Profile Pill matching Image 2 */}
        <div
          onClick={() => {
            navigate("/settings");
            if (onCloseMobile) onCloseMobile();
          }}
          className="flex items-center gap-2.5 p-2 rounded-2xl bg-white/75 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 shadow-xs cursor-pointer hover:bg-white dark:hover:bg-slate-850 transition-all"
        >
          <div className="h-8 w-8 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {user?.name || "Developer"}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {user?.email || "Email unavailable"}
            </p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
