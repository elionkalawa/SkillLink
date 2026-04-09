"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  ChevronLeft,
  Share2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useJoinProject } from "@/hooks/useProjects";
import { useQuery } from "@tanstack/react-query";
import TopNav from "../../components/TopNav";
import { toast } from "sonner";
import Image from "next/image";
import { Project, ProjectRole } from "@/types";
import { projectService } from "@/lib/services/project";
import { useUser } from "@/hooks/useUser";
import EditProjectModal from "./components/EditProjectModal";

interface ExtendedProject extends Project {
  roles?: ProjectRole[];
  owner: {
    id: string;
    name: string;
    image: string;
    username: string;
    role: string;
    location: string;
  };
  membership?: {
    status: string;
    role: string;
  } | null;
  workspace?: {
    id: string;
  } | null;
}

export default function ProjectDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { mutateAsync: joinProject, isPending: isJoining } = useJoinProject();
  const [hasApplied, setHasApplied] = useState(false);
  const [appliedRoles, setAppliedRoles] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useUser();

  const { data: project, isLoading } = useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const data = await projectService.getProjectById(id);
      return data as unknown as ExtendedProject;
    },
  });

  const handleApply = async (roleId?: string) => {
    try {
      await joinProject({ projectId: id, roleId });
      setHasApplied(true);
      if (roleId) setAppliedRoles([...appliedRoles, roleId]);
      toast.success("Application sent successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to apply";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-primary" size={48} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center space-y-4 text-center">
        <h2 className="text-3xl font-black">Project not found</h2>
        <p className="text-slate-400 font-bold max-w-sm">
          It might have been removed or you may have the wrong link.
        </p>
        <button
          onClick={() => router.back()}
          className="px-8 py-3 bg-slate-100 rounded-2xl font-black"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        {/* Navigation / Top Bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-zinc-900 hover:scale-105 transition-all text-slate-400"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-4">
            {user && project.owner_id === user.id && (
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all"
              >
                Edit Project
              </button>
            )}
            <button className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 font-bold text-sm text-slate-500 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
              <Share2 size={16} /> Share
            </button>
            <TopNav />
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Hub: Visual Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative group rounded-[48px] overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-2xl h-[400px] md:h-[500px]">
              {project.image_url ? (
                <Image
                  fill
                  src={project.image_url}
                  alt={project.title}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-blue-500 opacity-90 flex items-center justify-center text-8xl font-black text-white/20 select-none">
                  {project.title.charAt(0)}
                </div>
              )}

              <div className="absolute top-8 left-8">
                <span className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest shadow-2xl">
                  {project.category}
                </span>
              </div>
            </div>

            <div className="space-y-6 px-4 md:px-0">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {project.title}
              </h1>

              <div className="flex flex-wrap gap-3">
                {project.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 text-xs font-bold border border-slate-100 dark:border-zinc-800 uppercase tracking-tight"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none pt-4">
                <p className="text-lg text-slate-600 dark:text-zinc-300 font-medium leading-relaxed">
                  {project.full_description || project.description}
                </p>
              </div>

              <div className="space-y-6 pt-10">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Sparkles className="text-indigo-500" size={20} /> Required
                  Skills
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.skills_required?.map((skill: string) => (
                    <div
                      key={skill}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-50 dark:border-zinc-800 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="font-bold text-slate-700 dark:text-zinc-200">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* project roles section */}
              {project.roles && project.roles.length > 0 && (
                <div className="space-y-6 pt-10 mt-10 border-t border-slate-100 dark:border-zinc-800">
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <Users className="text-indigo-500" size={20} /> Open Roles ({project.roles.filter(r => r.is_open).length})
                  </h3>
                  <div className="grid gap-4">
                    {project.roles.map((role) => (
                      <div key={role.id} className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-black text-lg text-slate-900 dark:text-white">{role.title}</h4>
                            {!role.is_open && (
                              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 text-[10px] font-black uppercase tracking-widest">Filled</span>
                            )}
                          </div>
                          {role.description && <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">{role.description}</p>}
                          {role.skills_required && role.skills_required.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {role.skills_required.map((s: string) => (
                                <span key={s} className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-500/20">{s}</span>
                              ))}
                            </div>
                          )}
                          <p className="text-xs font-bold text-slate-400">Total Vacancies: {role.vacancies}</p>
                        </div>
                        <button
                          onClick={() => handleApply(role.id)}
                          disabled={isJoining || appliedRoles.includes(role.id) || !role.is_open}
                          className="px-6 py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-200 dark:shadow-none min-w-[140px]"
                        >
                          {appliedRoles.includes(role.id) ? "Applied" : !role.is_open ? "Filled" : "Apply for Role"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Application & Owner */}
          <div className="lg:col-span-5 space-y-8">
            {/* Application Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-[48px] p-8 md:p-10 border border-slate-100 dark:border-zinc-800 shadow-2xl shadow-indigo-100/50 dark:shadow-none sticky top-8">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Team Progress
                    </span>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-indigo-500" />
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        {project.current_members_count}/{project.max_team_size}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Deadline
                    </span>
                    <div className="flex items-center gap-2 justify-end">
                      <Calendar size={16} className="text-rose-500" />
                      <span className="font-black text-slate-700 dark:text-zinc-200">
                        {project.deadline
                          ? new Date(project.deadline).toLocaleDateString()
                          : "Continuous"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-2 w-full bg-slate-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{
                      width: `${(project.current_members_count / project.max_team_size) * 100}%`,
                    }}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  {user && (project.owner_id === user.id || project.membership?.status === 'approved') ? (
                    <button
                      onClick={() => {
                        const workspaceId = project.workspace?.id;
                        if (workspaceId) {
                          router.push(`/dashboard/workspaces/${workspaceId}`);
                        } else {
                          toast.error("Workspace still initializing...");
                        }
                      }}
                      className="w-full py-5 rounded-3xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-[0.98] flex items-center justify-center gap-3 group/btn relative overflow-hidden"
                    >
                      <Sparkles size={24} className="text-white animate-pulse" />
                      <span>View Workspace</span>
                      <ArrowRight
                        className="group-hover/btn:translate-x-2 transition-transform"
                        size={24}
                      />
                    </button>
                  ) : hasApplied || project.membership?.status === 'pending' ? (
                    <div className="w-full flex flex-col items-center justify-center p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-2">
                        <CheckCircle2 size={32} />
                      </div>
                      <h4 className="font-black text-lg">Application Sent!</h4>
                      <p className="text-xs font-bold opacity-80">
                        The project host will review your profile shortly.
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply()}
                      disabled={isJoining}
                      className="w-full py-5 rounded-3xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-[0.98] flex items-center justify-center gap-3 group/btn relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isJoining ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        <>
                          <span>{project.roles && project.roles.length > 0 ? "Apply as General Member" : "Apply to Join Team"}</span>
                          <ArrowRight
                            className="group-hover/btn:translate-x-2 transition-transform"
                            size={24}
                          />
                        </>
                      )}
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-all duration-300" />
                    </button>
                  )}

                  <button className="w-full py-5 rounded-3xl border border-slate-100 dark:border-zinc-800 font-black text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-3">
                    <MessageSquare size={20} />
                    Contact Host
                  </button>
                </div>

                <div className="pt-8 border-t border-slate-50 dark:border-zinc-800 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 overflow-hidden shrink-0 border-2 border-slate-50">
                    {project.owner?.image && (
                      <Image
                        width={64}
                        height={64}
                        src={project.owner.image}
                        alt="Host"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-slate-900 dark:text-white truncate">
                        {project.owner?.name}
                      </h4>
                      <ShieldCheck
                        size={14}
                        className="text-blue-500 shrink-0"
                      />
                    </div>
                    <p className="text-xs font-bold text-slate-400 truncate tracking-tight">
                      {project.owner?.role || "Project Host"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isEditModalOpen && (
        <EditProjectModal 
          project={project} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </div>
  );
}
