"use client";

import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeToggle({ variant = "icon", collapsed = false }: { variant?: "icon" | "sidebar", collapsed?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMounted(true);
      const theme = localStorage.getItem("theme");
      if (theme === "dark" || (!theme && document.documentElement.classList.contains("dark"))) {
        setIsDark(true);
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    if (variant === "sidebar") {
      return (
        <button className={`w-full flex items-center p-4 font-bold rounded-2xl transition-all text-sm bg-gray-200/50 dark:bg-gray-800/50 text-slate-600 dark:text-slate-200 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-[22px] h-[22px] opacity-0 text-xl" />
          {!collapsed && (
            <div className="ml-3 w-full whitespace-nowrap flex justify-start items-center px-2 opacity-0">
              Dark Mode
            </div>
          )}
        </button>
      )
    }
    return (
      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
        <div className="w-5 h-5 opacity-0" />
      </button>
    );
  }

  if (variant === "sidebar") {
    return (
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className={`w-full flex items-center p-4 font-bold rounded-2xl transition-all text-sm hover:bg-slate-100 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-slate-200 ${collapsed ? "justify-center" : ""}`}
      >
        <div className="relative flex items-center justify-center w-[22px] h-[22px] text-xl">
          <Sun
            className={`w-[22px] h-[22px] absolute transition-all duration-500 ease-in-out text-amber-500 ${
              isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <Moon
            className={`w-[22px] h-[22px] absolute transition-all duration-500 ease-in-out text-blue-400 ${
              isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
            }`}
          />
        </div>
        {!collapsed && (
          <div className="ml-3 w-full whitespace-nowrap flex justify-start items-center px-2">
            {isDark ? "Dark Mode" : "Light Mode"}
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="w-10 h-10 flex items-center bg-slate-100 dark:bg-gray-800/50 justify-center rounded-full text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="relative flex items-center justify-center">
        <Sun
          className={`w-5 h-5 absolute transition-all duration-500 ease-in-out text-amber-300 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`w-5 h-5 transition-all duration-500 ease-in-out text-blue-300 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </button>
  );
}
