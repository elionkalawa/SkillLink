"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Briefcase } from "lucide-react";
import { FollowButton } from "@/components/FollowButton";
import StackBadge from "../../profile/components/StackBadge";

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
    bio: string | null;
    skills: string[];
    profile_title: string | null;
    role: string | null;
    location: string | null;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  // Generate a consistent gradient based on the user's ID
  const gradients = [
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-blue-600 to-violet-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-orange-500",
    "from-amber-400 to-rose-400"
  ];
  const gradientIdx = user.id.charCodeAt(0) % gradients.length;
  const bannerGradient = gradients[gradientIdx];

  return (
    <Link 
      href={`/dashboard/profile/${user.id}`}
      className="group block bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500"
    >
      {/* Banner */}
      <div className={`h-24 w-full bg-linear-to-br ${bannerGradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
      
      <div className="px-6 pb-6 pt-0">
        <div className="relative flex justify-between items-end -mt-10 mb-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden bg-slate-100 shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-105">
            {user.image ? (
              <Image fill src={user.image} alt={user.name} className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-black bg-slate-200 text-slate-400">
                {user.name?.charAt(0)}
              </div>
            )}
          </div>

          <FollowButton userId={user.id} size="sm" className="relative z-10" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
              {user.name}
            </h3>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 capitalize">
              <Briefcase size={12} />
              {user.profile_title || user.role || "Independent Developer"}
            </p>
          </div>

          <p className="text-xs text-slate-500 dark:text-zinc-500 line-clamp-2 min-h-10 font-medium leading-relaxed">
            {user.bio || "No biography provided yet."}
          </p>

          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {user.location || "Location Private"}
            </span>
          </div>

          {/* Tech Stack (Skills) */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {(user.skills || []).slice(0, 3).map((skill) => (
              <StackBadge key={skill} className="text-[9px] px-2 py-0.5">
                {skill.replace(/^#+/, "").trim()}
              </StackBadge>
            ))}
            {(user.skills || []).length > 3 && (
              <span className="text-[9px] font-black text-slate-300 dark:text-zinc-700 self-center pl-1">
                +{(user.skills || []).length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;
