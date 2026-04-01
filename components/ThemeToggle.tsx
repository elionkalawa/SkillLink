"use client";

import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeToggle() {
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
    return (
      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
        <div className="w-5 h-5 opacity-0" />
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
