import React, { useState } from "react";
import Sidebar from "@/components/Sidebar.jsx";
import Navbar from "@/components/layout/Navbar.jsx";
import { Outlet } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

export default function AppLayout() {
  const { dark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[url('/mountainLight.jpg')] dark:bg-[url('/starsDark.jpg')] bg-cover bg-center p-2.5 sm:p-3 lg:p-4 transition-colors duration-300">
      {/* Translucent Glassmorphic Container matching Image 2 */}
      <div className="flex h-full w-full rounded-[28px] sm:rounded-[32px] lg:rounded-[36px] bg-white/75 dark:bg-slate-950/75 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl overflow-hidden relative">
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden lg:flex shrink-0 h-full">
          <Sidebar />
        </div>

        {/* Mobile Slide-Over Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Right Content Section */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/40 dark:bg-slate-950/40">
          {/* Top Navbar */}
          <Navbar
            dark={dark}
            toggleTheme={toggleTheme}
            onOpenMobileSidebar={() => setMobileMenuOpen(true)}
          />

          {/* Dynamic Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 scrollbar-thin">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
