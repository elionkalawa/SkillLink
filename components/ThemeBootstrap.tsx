"use client";

import { useEffect } from "react";

/**
 * Runs once on the client to apply the saved or system theme before
 * the first paint, preventing a flash of the wrong theme.
 */
export function ThemeBootstrap() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const isDark = saved === "dark" || (!saved && systemDark);

      if (isDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  return null;
}
