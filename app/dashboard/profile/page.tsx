"use client";

import React from "react";
import { useUser } from "@/hooks/useUser";
import { 
  Mail, 
  Github, 
  Globe, 
  MapPin, 
  Pencil, 
  MoreHorizontal
} from "lucide-react";
import Image from "next/image";
import ProfileSkeleton from "./components/ProfileSkeleton";
import SkillCard from "./components/SkillCard";
import ContributionCard from "./components/ContributionCard";
import StackBadge from "./components/StackBadge";

const ProfilePage = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // Mock data for missing fields in the User type
  const mockProfile = {
    tagline: "Senior Full Stack Developer",
    location: "San Francisco, CA",
    buildingInPublic: true,
    isPro: true,
    coverImage: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", // Gradient as backdrop
    website: "arivera.design",
    github: "github.com/arivera",
    currentStack: ["React", "Next.js", "Tailwind CSS", "Docker", "Redis", "Figma"],
    skills: [
      { name: "React", level: "EXPERT" },
      { name: "TypeScript", level: "ADVANCED" },
      { name: "Node.js", level: "EXPERT" },
      { name: "PostgreSQL", level: "ADVANCED" },
      { name: "System Design", level: "ADVANCED" },
    ],
    contributions: [
      {
        name: "SolarOS Dashboard",
        role: "Lead Frontend",
        tag: "SUSTAINABILITY",
        icon: "S"
      },
      {
        name: "Sentience AI Agent",
        role: "Lead Frontend",
        tag: "AI/ML",
        icon: "S"
      },
      {
        name: "Vault Protocol v2",
        role: "Lead Frontend",
        tag: "WEB3",
        icon: "V"
      }
    ]
  };

  const displayName = user?.name || "Alex Rivera";
  const bio = user?.bio || "Engineering high-performance web systems with a focus on developer experience and sustainable architecture. Currently deep-diving into decentralized protocols and AI agent orchestration.";
  
  // Handle Google profile image resolution (default is 96px, which is too small for this UI)
  let profileImage = user?.image || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800&h=800&fit=crop";
  if (user?.image?.includes("googleusercontent.com")) {
    profileImage = user.image.replace("=s96-c", "=s400-c");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-zinc-800">
        <div 
          className="h-48 w-full" 
          style={{ background: mockProfile.coverImage }}
        />
        
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row md:items-end -mt-16 gap-6">
            {/* Profile Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-zinc-900 overflow-hidden bg-slate-100 shadow-lg group-hover:scale-105 transition-transform duration-500 cursor-pointer">
                <Image 
                  src={profileImage} 
                  alt={displayName} 
                  width={256} 
                  height={256} 
                  quality={95}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-1 pb-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {displayName}
                </h1>
                {mockProfile.isPro && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-[10px] font-bold text-white uppercase tracking-wider">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {mockProfile.tagline}
              </p>
              <div className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {mockProfile.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                  Building in public
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pb-2">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-200 dark:shadow-none active:scale-95">
                <Pencil size={16} />
                Edit profile
              </button>
              <button className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                <MoreHorizontal size={20} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: About & Stack */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">About {displayName.split(' ')[0]}</h2>
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-slate-200 dark:border-zinc-800 space-y-8">
              <p className="text-sm leading-relaxed font-medium text-slate-600 dark:text-slate-300">
                {bio}
              </p>
              
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <a href={`mailto:${user?.email}`} className="flex items-center gap-3 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                  <Mail size={16} />
                  {user?.email || "alex.r@skilllink.io"}
                </a>
                <a href={`https://${mockProfile.github}`} className="flex items-center gap-3 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                  <Github size={16} />
                  {mockProfile.github}
                </a>
                <a href={`https://${mockProfile.website}`} className="flex items-center gap-3 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                  <Globe size={16} />
                  {mockProfile.website}
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Stack</h2>
            <div className="flex flex-wrap gap-2">
              {mockProfile.currentStack.map(tech => (
                <StackBadge key={tech}>{tech}</StackBadge>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skills & History */}
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Skills & Level</h2>
              <p className="text-sm font-medium text-slate-400">Based on verified project contributions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProfile.skills.map((skill) => (
                <SkillCard 
                  key={skill.name} 
                  name={skill.name} 
                  level={skill.level} 
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Contribution History</h2>
              <p className="text-sm font-medium text-slate-400">Verified project involvements</p>
            </div>

            <div className="space-y-4">
              {mockProfile.contributions.map((project) => (
                <ContributionCard 
                  key={project.name}
                  name={project.name}
                  role={project.role}
                  tag={project.tag}
                  icon={project.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;