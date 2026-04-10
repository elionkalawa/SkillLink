"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabaseClient";
import { useGlobalRealtimeMessages } from "@/hooks/useGlobalRealtimeMessages";

interface PresenceContextType {
  onlineUserIds: Set<string>;
  isOnline: (userId: string) => boolean;
  getLastSeen: (userId: string) => string | null;
  fetchPresence: (userIds: string[]) => Promise<void>;
}

const PresenceContext = createContext<PresenceContextType | undefined>(undefined);

const HEARTBEAT_INTERVAL = 60_000;

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  useGlobalRealtimeMessages();
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [lastSeenMap, setLastSeenMap] = useState<Map<string, string>>(new Map());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const sendHeartbeat = useCallback(async () => {
    try {
      await fetch("/api/user/heartbeat", { method: "POST" });
    } catch {
      // Silently fail
    }
  }, []);

  const fetchPresence = useCallback(async (userIds: string[]) => {
    if (userIds.length === 0) return;
    try {
      const res = await fetch("/api/user/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds }),
      });
      if (res.ok) {
        const data = await res.json() as { users: { id: string; last_seen: string | null }[] };
        const seen = new Map<string, string>();
        for (const u of data.users) {
          if (u.last_seen) {
            seen.set(u.id, u.last_seen);
          }
        }
        setLastSeenMap(prev => {
          const next = new Map(prev);
          seen.forEach((v, k) => next.set(k, v));
          return next;
        });
      }
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase.channel("global-presence", {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const online = new Set<string>();
        Object.keys(state).forEach((key) => online.add(key));
        setOnlineUserIds(online);
      })
      .on("presence", { event: "join" }, ({ key }) => {
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.add(key);
          return next;
        });
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      clearInterval(interval);
      setOnlineUserIds(new Set());
    };
  }, [user?.id, sendHeartbeat]);

  const isOnline = useCallback((userId: string) => onlineUserIds.has(userId), [onlineUserIds]);
  const getLastSeen = useCallback((userId: string) => lastSeenMap.get(userId) || null, [lastSeenMap]);

  return (
    <PresenceContext.Provider value={{ onlineUserIds, isOnline, getLastSeen, fetchPresence }}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence() {
  const context = useContext(PresenceContext);
  if (context === undefined) {
    throw new Error("usePresence must be used within a PresenceProvider");
  }
  return context;
}
