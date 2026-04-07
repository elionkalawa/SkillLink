"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "./QueryProvider";
import { UserProvider } from "./UserProvider";
import { NotificationProvider } from "./NotificationProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <NotificationProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </NotificationProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
