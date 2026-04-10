"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "./QueryProvider";
import { UserProvider } from "./UserProvider";
import { NotificationProvider } from "./NotificationProvider";
import { PresenceProvider } from "./PresenceProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <NotificationProvider>
          <UserProvider>
            <PresenceProvider>
              {children}
            </PresenceProvider>
          </UserProvider>
        </NotificationProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
