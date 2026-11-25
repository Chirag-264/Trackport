import React, { useRef, useEffect, useState } from "react";
import { Search, Bell, Sun, Moon, ChevronDown, LogOut, User, FolderKanban, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ dark, toggleTheme, onOpenMobileSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch(new URLSearchParams(location.search).get('search') || '');
  }, [location.search]);

  // Global ⌘K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (searchInputRef.current && window.innerWidth >= 768) {
          searchInputRef.current.focus();
        } else {
          navigate("/projects");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const updateSearch = (value) => {
    setSearch(value);
    const query = value ? `?search=${encodeURIComponent(value)}` : '';
    navigate(`/projects${query}`, { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return "C";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 1).toUpperCase();
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "Developer";

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 sm:px-6 pt-5 pb-3 shrink-0">
      {/* Left: Mobile Menu Trigger + Dynamic Greeting matching Image 2 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="font-bold text-xl sm:text-2xl lg:text-[1.65rem] tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Welcome back, {firstName}!{" "}
            <span className="inline-block animate-bounce" role="img" aria-label="wave">
              👋
            </span>
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
            Let's build, learn and ship. You've got this! 🚀
          </p>
        </div>
      </div>

      {/* Right: Search + Theme + Notification + User Pill */}
      <div className="flex items-center gap-2 sm:gap-2.5 self-end sm:self-auto">
        {/* Search Input with ⌘K Badge */}
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
            onFocus={() => { if (!location.pathname.startsWith('/projects')) navigate(`/projects${location.search}`); }}
            aria-label="Search projects"
            className="h-10 w-60 lg:w-72 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 pl-10 pr-10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
            ⌘K
          </kbd>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title="Toggle color theme"
          className="h-10 w-10 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs transition-all active:scale-95"
        >
          {dark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
        </button>

        {/* Notifications Bell */}
        <button
          title="Notifications"
          onClick={() => navigate('/tasks')}
          aria-label="View tasks and deadlines"
          className="relative h-10 w-10 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs transition-all active:scale-95"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* User Pill Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 h-10 pl-1 pr-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-850 transition-all">
              <div className="h-8 w-8 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {getInitials(user?.name)}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 hidden sm:inline">
                {firstName}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5 shadow-xl">
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.name || "Developer"}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email || "student@dev.com"}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/projects")} className="cursor-pointer rounded-xl text-xs py-2">
              <FolderKanban className="h-3.5 w-3.5 mr-2 text-slate-500" />
              My Projects
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer rounded-xl text-xs py-2">
              <User className="h-3.5 w-3.5 mr-2 text-slate-500" />
              Settings & Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate("/auth/login");
              }}
              className="cursor-pointer text-destructive focus:text-destructive rounded-xl text-xs py-2"
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
