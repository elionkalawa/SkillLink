"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { User } from "@/types";
import { createClient } from "@supabase/supabase-js";

// Initialize the public supabase client safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn("UserProvider: Supabase keys are missing. Detailed user info will not be available.");
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      if (!supabase) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .schema('next_auth')
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      if (data) setUser(data as User);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (session?.user?.id) {
      await fetchUserData(session.user.id);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchUserData(session.user.id);
    } else if (status === "unauthenticated") {
      setUser(null);
      setIsLoading(false);
    } else if (status === "loading") {
      setIsLoading(true);
    }
  }, [session, status]);

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}
