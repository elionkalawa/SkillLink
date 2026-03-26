"use client";

import { useEffect } from "react";
import "./globals.css";
import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Sync initial theme on mount (server-side safe)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const isDark = saved === "dark" || (!saved && systemDark);

      if (isDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
