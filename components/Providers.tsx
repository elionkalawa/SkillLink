"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/context/UserContext";
import { QueryProvider } from "@/providers/QueryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
