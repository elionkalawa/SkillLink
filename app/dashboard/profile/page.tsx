"use client";

import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { 
  Mail, 
  Github, 
  Linkedin,
  Globe, 
  MapPin, 
  Pencil, 
  MoreHorizontal,
  X,
  Save,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import ProfileSkeleton from "./components/ProfileSkeleton";
import SkillCard from "./components/SkillCard";
import StackBadge from "./components/StackBadge";
import TopNav from "../components/TopNav";
import FollowListModal from "@/components/FollowListModal";
import { toast } from "sonner";

interface ProfileFormState {
  name: string;
  username: string;
  bio: string;
  profile_title: string;
  location: string;
  years_of_experience: string;
  experience_level: string;
  skills: string;
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
}

const ProfilePage = () => {
  const { user, isLoading, refreshUser } = useUser();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);
  const [form, setForm] = useState<ProfileFormState>({
    name: "",
    username: "",
    bio: "",
    profile_title: "",
    location: "",
    years_of_experience: "",
    experience_level: "",
    skills: "",
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
  });

  const { data: socialStatus } = useQuery({
    queryKey: ["users", user?.id, "follow-status"],
    queryFn: async () => {
      const res = await fetch(`/api/users/${user?.id}/follow/status`);
      if (!res.ok) throw new Error("Failed to fetch follow status");
      return res.json() as Promise<{ isFollowing: boolean; followerCount: number; followingCount: number }>;
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const openEditor = () => {
    setForm({
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
      profile_title: user?.profile_title || user?.role || "",
      location: user?.location || "",
      years_of_experience:
        user?.years_of_experience !== undefined && user?.years_of_experience !== null
          ? String(user.years_of_experience)
          : "",
      experience_level: user?.experience_level || "",
      skills: (user?.skills || []).map((skill) => skill.replace(/^#+/, "").trim()).join(", "),
      github_url: user?.github_url || "",
      linkedin_url: user?.linkedin_url || "",
      portfolio_url: user?.portfolio_url || "",
    });
    setIsEditOpen(true);
  };

  const closeEditor = () => setIsEditOpen(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const skills = form.skills
        .split(",")
        .map((skill) => skill.replace(/^#+/, "").trim())
        .filter(Boolean);

      const years =
        form.years_of_experience.trim() === ""
          ? null
          : Number(form.years_of_experience.trim());

      if (years !== null && Number.isNaN(years)) {
        throw new Error("Years of experience must be a number");
      }

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim() || null,
          username: form.username.trim() || null,
          bio: form.bio.trim() || null,
          profile_title: form.profile_title.trim() || null,
          location: form.location.trim() || null,
          years_of_experience: years,
          experience_level: form.experience_level || null,
          skills,
          github_url: form.github_url.trim() || null,
          linkedin_url: form.linkedin_url.trim() || null,
          portfolio_url: form.portfolio_url.trim() || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update profile");
      }

      await refreshUser();
      toast.success("Profile updated");
      setIsEditOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = user?.name || "Alex Rivera";
  const bio = user?.bio || "Add your bio from Settings so collaborators can understand your background and goals.";
  const displayRole = user?.profile_title || user?.role || "Independent Developer";
  const displayLocation = user?.location || "Location not set";
  const displayExperienceLevel = user?.experience_level || "not set";
  const currentStack = (user?.skills || []).map((skill) => skill.replace(/^#+/, "").trim());
  
  // Handle Google profile image resolution (default is 96px, which is too small for this UI)
  let profileImage = user?.image || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800&h=800&fit=crop";
  if (user?.image?.includes("googleusercontent.com")) {
    profileImage = user.image.replace("=s96-c", "=s400-c");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <FollowListModal 
        userId={user?.id || ""}
        type={modalType || "followers"}
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
      />
      <div className="w-full flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Profile
          </h1>
        </div>
        <TopNav />
      </div>
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-zinc-800">
        <div className="h-40 w-full bg-slate-100 dark:bg-zinc-800" />
        
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
                {user?.username && (
                  <span className="text-sm font-bold text-slate-400">@{user.username}</span>
                )}
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

              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 pt-1 transition-all leading-tight">
                {displayRole}
              </p>
              
              <div className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {displayLocation}
                </span>
                <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-xs font-bold capitalize">
                  {displayExperienceLevel}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pb-2">
              <button
                onClick={openEditor}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-200 dark:shadow-none active:scale-95"
              >
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
                {user?.github_url && (
                  <a href={user.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                    <Github size={16} />
                    {user.github_url}
                  </a>
                )}
                {user?.linkedin_url && (
                  <a href={user.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                    <Linkedin size={16} />
                    {user.linkedin_url}
                  </a>
                )}
                {user?.portfolio_url && (
                  <a href={user.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                    <Globe size={16} />
                    {user.portfolio_url}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Stack</h2>
            <div className="flex flex-wrap gap-2">
              {currentStack.map(tech => (
                <StackBadge key={tech}>{tech}</StackBadge>
              ))}
              {currentStack.length === 0 && (
                <span className="text-xs text-slate-400 font-bold">No skills added yet.</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Skills & History */}
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Skills</h2>
              <p className="text-sm font-medium text-slate-400">Your current skill set</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStack.slice(0, 6).map((skill) => (
                <SkillCard 
                  key={skill} 
                  name={skill} 
                />
              ))}
              {currentStack.length === 0 && (
                <div className="col-span-full p-6 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 text-center text-sm text-slate-400 font-bold">
                  Add skills from Settings to build your profile.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Contribution History</h2>
              <p className="text-sm font-medium text-slate-400">Verified project involvements</p>
            </div>

            <div className="p-8 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800 text-center">
              <p className="text-sm font-bold text-slate-400">No contribution history yet.</p>
            </div>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeEditor} />
          <div className="absolute inset-x-3 top-3 bottom-3 md:inset-x-auto md:left-1/2 md:top-8 md:bottom-8 md:w-[760px] md:-translate-x-1/2 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="text-lg md:text-xl font-black">Edit Profile</h3>
              <button
                onClick={closeEditor}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-500 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium" />
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium" />
                <input value={form.profile_title} onChange={(e) => setForm({ ...form, profile_title: e.target.value })} placeholder="Profile title (e.g. Frontend Developer)" className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium md:col-span-2" />
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium" />
                <input value={form.years_of_experience} onChange={(e) => setForm({ ...form, years_of_experience: e.target.value })} placeholder="Years of experience" className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium" />
                <select value={form.experience_level} onChange={(e) => setForm({ ...form, experience_level: e.target.value })} className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium md:col-span-2">
                  <option value="">Experience level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" rows={4} className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium md:col-span-2" />
                <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Skills (comma separated, no # tags)" className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium md:col-span-2" />
                <input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="GitHub URL" className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium md:col-span-2" />
                <input value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} placeholder="LinkedIn URL" className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium md:col-span-2" />
                <input value={form.portfolio_url} onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })} placeholder="Portfolio URL" className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium md:col-span-2" />
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-slate-100 dark:border-zinc-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button onClick={closeEditor} className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 font-black text-sm">
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving} className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;