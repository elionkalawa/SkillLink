"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Mail, 
  Github, 
  Linkedin,
  Globe, 
  MapPin, 
  ChevronLeft,
  Briefcase,
  Star,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import TopNav from "../../components/TopNav";
import SkillCard from "../components/SkillCard";
import StackBadge from "../components/StackBadge";
import ProfileSkeleton from "../components/ProfileSkeleton";

import { FollowButton } from "@/components/FollowButton";
import FollowListModal from "@/components/FollowListModal";
import { useState } from "react";

export default function PublicProfilePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error("User not found");
      return response.json();
    }
  });

  const { data: socialStatus } = useQuery({
    queryKey: ["users", id, "follow-status"],
    queryFn: async () => {
      const res = await fetch(`/api/users/${id}/follow/status`);
      if (!res.ok) throw new Error("Failed to fetch follow status");
      return res.json() as Promise<{ isFollowing: boolean; followerCount: number; followingCount: number }>;
    },
    enabled: !!id
  });

  if (isLoading) return <ProfileSkeleton />;

  if (!user) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-black mb-4">User not found</h2>
        <button onClick={() => router.back()} className="px-6 py-2 bg-slate-100 rounded-xl font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-10 py-6 md:py-8 px-3 sm:px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <FollowListModal 
        userId={id}
        type={modalType || "followers"}
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
      />
      
      {/* Header / Actions */}
      <div className="flex items-center justify-between gap-3">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:scale-105 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <TopNav />
      </div>

      {/* Hero Section */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-[28px] md:rounded-[48px] overflow-hidden shadow-2xl shadow-indigo-100/50 dark:shadow-none border border-slate-100 dark:border-zinc-800">
        <div className="h-40 w-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90" />
        
        <div className="px-4 sm:px-6 md:px-12 pb-8 md:pb-12">
          <div className="relative flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 gap-6 md:gap-8">
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-[26px] md:rounded-[40px] border-[5px] md:border-[6px] border-white dark:border-zinc-900 overflow-hidden bg-slate-100 shadow-2xl relative z-10">
              {user.image ? (
                <Image fill src={user.image} alt={user.name} className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-black bg-slate-200">
                   {user.name?.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 pb-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white wrap-break-word">
                  {user.name}
                </h1>
                <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                  Verified Skill
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-wider pt-2">
                <button 
                  onClick={() => setModalType("followers")}
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors group"
                >
                  <span className="text-slate-900 dark:text-white group-hover:text-indigo-600">{socialStatus?.followerCount || 0}</span>
                  <span className="text-slate-400 font-bold">Followers</span>
                </button>
                <button 
                  onClick={() => setModalType("following")}
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors group"
                >
                  <span className="text-slate-900 dark:text-white group-hover:text-indigo-600">{socialStatus?.followingCount || 0}</span>
                  <span className="text-slate-400 font-bold">Following</span>
                </button>
              </div>

              <p className="text-base sm:text-lg md:text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 pt-1 transition-all">
                <Briefcase size={20} />
                {user.profile_title || user.role || "Independent Developer"}
              </p>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  {user.location || "Location Private"}
                </span>
                {user.experience_level && (
                  <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-xs font-bold capitalize">
                    {user.experience_level}
                  </span>
                )}
                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-800">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  Skill Score: 94
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pb-2 w-full md:w-auto">
               <FollowButton userId={id} size="lg" className="w-full sm:w-auto shadow-xl" />
               <button className="w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-slate-900 dark:text-white font-black text-sm hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
                  <Mail size={18} className="text-indigo-600" /> Message
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">About</h2>
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-slate-100 dark:border-zinc-800 shadow-sm leading-relaxed text-slate-600 dark:text-zinc-300 font-medium">
               {user.bio || "No biography provided yet."}
               
               <div className="mt-8 pt-8 border-t border-slate-50 dark:border-zinc-800 space-y-4">
                 {user.github_url && (
                   <a href={user.github_url} target="_blank" className="flex items-center justify-between text-xs font-bold text-slate-400 hover:text-indigo-600 transition-all group">
                     <span className="flex items-center gap-3"><Github size={18} /> GitHub</span>
                     <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </a>
                 )}
                 {user.linkedin_url && (
                   <a href={user.linkedin_url} target="_blank" className="flex items-center justify-between text-xs font-bold text-slate-400 hover:text-indigo-600 transition-all group">
                     <span className="flex items-center gap-3"><Linkedin size={18} /> LinkedIn</span>
                     <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </a>
                 )}
                 {user.portfolio_url && (
                   <a href={user.portfolio_url} target="_blank" className="flex items-center justify-between text-xs font-bold text-slate-400 hover:text-indigo-600 transition-all group">
                     <span className="flex items-center gap-3"><Globe size={18} /> Portfolio</span>
                     <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </a>
                 )}
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills?.map((skill: string) => (
                <StackBadge key={skill}>{skill.replace(/^#+/, "").trim()}</StackBadge>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skills & History */}
        <div className="lg:col-span-8 space-y-12">
           <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {user.skills?.slice(0, 4).map((skill: string) => (
                   <SkillCard key={skill} name={skill.replace(/^#+/, "").trim()} />
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Verified Contributions</h2>
              <div className="p-12 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-zinc-800 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-slate-300">
                    <Briefcase size={32} />
                 </div>
                 <div className="space-y-1">
                    <h4 className="font-black text-slate-900 dark:text-white">No Public History</h4>
                    <p className="text-sm font-medium text-slate-400">Past projects will appear here once verified.</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
