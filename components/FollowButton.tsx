"use client";

import React from "react";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface FollowButtonProps {
  userId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const FollowButton: React.FC<FollowButtonProps> = ({ 
  userId, 
  className = "",
  size = "md"
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading: isStatusLoading } = useQuery({
    queryKey: ["users", userId, "follow-status"],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/follow/status`);
      if (!res.ok) throw new Error("Failed to fetch follow status");
      return res.json() as Promise<{ isFollowing: boolean; followerCount: number; followingCount: number }>;
    },
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/users/${userId}/follow`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to toggle follow");
      }
      return res.json() as Promise<{ following: boolean }>;
    },
    onSuccess: (data) => {
      // Refresh the followed user's status/counts
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      queryClient.invalidateQueries({ queryKey: ["users", userId, "follow-status"] });
      // Also refresh the current user's profile info/counts if they are viewing it
      queryClient.invalidateQueries({ queryKey: ["users", "pending-followers"] });
      // A more broad invalidation to ensure all counts on all tabs/views are fresh
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      toast.success(data.following ? "Followed user" : "Unfollowed user");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isFollowing = data?.isFollowing ?? false;
  const isLoading = isStatusLoading || followMutation.isPending;

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-8 py-3.5 text-base rounded-2xl gap-3",
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        followMutation.mutate();
      }}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center font-black transition-all active:scale-95 disabled:opacity-70
        ${isFollowing 
          ? "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700" 
          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={size === "sm" ? 14 : 18} />
      ) : isFollowing ? (
        <>
          <UserMinus size={size === "sm" ? 14 : 18} />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus size={size === "sm" ? 14 : 18} />
          Follow
        </>
      )}
    </button>
  );
};
