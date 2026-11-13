import React, { useState } from "react";
import { User, Mail, GraduationCap, AtSign, Moon, Sun, Check, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || "Chirag Rajput");
  const [userName, setUserName] = useState(user?.userName || "chirag_dev");
  const [college, setCollege] = useState(user?.college || "Institute of Technology");
  const [branch, setBranch] = useState(user?.branch || "Computer Science");
  const [gradYear, setGradYear] = useState(user?.graduationYear || "2026");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your developer profile, educational background, and app preferences.
        </p>
      </div>

      {/* Profile Form Card */}
      <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-5">
          Student Developer Profile
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Full Name</Label>
              <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl px-3.5 h-11 border border-slate-200/80 dark:border-slate-700 mt-1.5">
                <User className="h-4 w-4 text-slate-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent outline-none w-full text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Username</Label>
              <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl px-3.5 h-11 border border-slate-200/80 dark:border-slate-700 mt-1.5">
                <AtSign className="h-4 w-4 text-slate-400" />
                <input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-transparent outline-none w-full text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email Address (Read-only)</Label>
            <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl px-3.5 h-11 border border-slate-200/60 dark:border-slate-700/60 mt-1.5 opacity-75">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                disabled
                value={user?.email || "chirag@example.com"}
                className="bg-transparent outline-none w-full text-xs sm:text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">College / University</Label>
              <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl px-3.5 h-11 border border-slate-200/80 dark:border-slate-700 mt-1.5">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                <input
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="bg-transparent outline-none w-full text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Graduation Year</Label>
              <input
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                className="h-11 rounded-2xl bg-slate-50 dark:bg-slate-800 px-3.5 border border-slate-200/80 dark:border-slate-700 mt-1.5 w-full text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Button
              type="submit"
              className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-11 px-6 gap-2"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300" /> Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Preferences Card */}
      <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Interface Appearance</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Switch between light mountain theme and dark cosmic stars theme.
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="h-11 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-750 transition-all"
        >
          {dark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-purple-600" />}
          <span>{dark ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </div>
  );
}

