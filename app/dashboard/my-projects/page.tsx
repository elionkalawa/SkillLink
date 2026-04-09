"use client";

import React, { useState } from "react";
import { Plus, Loader2, Layout, ArrowRight } from "lucide-react";
import Link from "next/link";
import ProjectTabs from "./components/ProjectTabs";
import TopNav from "../components/TopNav";
import ActiveProjectCard from "./components/ActiveProjectCard";
import CreateProjectModal from "./components/CreateProjectModal";
import { useUserProjects, useUserApplications, useDashboardStats } from "@/hooks";
import Image from "next/image";

interface Application {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  role: string | null;
  joined_at: string;
  project: {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    category: string | null;
    owner: {
      name: string;
      image: string | null;
    };
  };
  project_role: {
    title: string;
  } | null;
}


const MyProjectsPage = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: projects, isLoading } = useUserProjects();
  const { data: userApplications, isLoading: isLoadingApps } = useUserApplications();
  const { data: stats } = useDashboardStats();
  
  const workspaceProjects =
    projects?.filter((project) => (project.workspaces?.length || 0) > 0) || [];

  const counts = {
    projects: projects?.length || 0,
    workspaces: workspaceProjects.length,
    applications: userApplications?.length || stats?.applications || 0,
    invitations: 0,
  };

  return (
    <div className="w-full space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header section */}
      <section className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            My Projects
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-md max-w-2xl leading-relaxed">
            Manage your active work, applications, and invitations.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-end gap-3 md:gap-4 h-full w-full md:w-auto">
          <TopNav />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 active:scale-95 group"
          >
             <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
             <span>Create New Project</span>
          </button>
        </div>
      </section>

      {/* Tabs */}
      <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

      {/* Dynamic Content based on Tab */}
      <div className="min-h-[400px]">
        {activeTab === "projects" && (
          isLoading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 className="animate-spin text-blue-primary mb-4" size={40} />
              <p className="text-slate-500 font-bold">Loading your projects...</p>
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ActiveProjectCard 
                  key={project.id} 
                  id={project.id}
                  title={project.title}
                  description={project.description || "No description provided."}
                  tags={project.tags || []}
                  status={project.status === "open" ? "In Progress" : project.status}
                  workspaceId={project.workspaces?.[0]?.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 md:p-20 bg-slate-50/50 dark:bg-zinc-900/30 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-zinc-800">
               <div className="w-20 h-20 bg-white dark:bg-zinc-800 shadow-xl shadow-slate-100 dark:shadow-none rounded-3xl flex items-center justify-center text-slate-300 dark:text-zinc-600 mb-6">
                  <Plus size={40} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2">No Projects Created</h3>
               <p className="text-slate-500 dark:text-zinc-400 font-medium text-center max-w-xs">
                  You haven&apos;t posted any projects yet. Create one to start building your team!
               </p>
            </div>
          )
        )}

        {activeTab === "workspaces" && (
          isLoading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 className="animate-spin text-blue-primary mb-4" size={40} />
              <p className="text-slate-500 font-bold">Loading your workspaces...</p>
            </div>
          ) : workspaceProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workspaceProjects.map((project) => {
                const workspaceId = project.workspaces?.[0]?.id;
                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/workspaces/${workspaceId}`}
                    className="group bg-white dark:bg-zinc-900 rounded-[28px] p-6 border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-slate-200/30 dark:hover:shadow-none transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          <Layout size={14} />
                          Workspace
                        </div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-zinc-100 truncate">
                          {project.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2">
                          {project.description || "Open workspace for this project."}
                        </p>
                      </div>
                      <ArrowRight
                        size={18}
                        className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 md:p-20 bg-slate-50/50 dark:bg-zinc-900/30 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-zinc-800">
              <div className="w-20 h-20 bg-white dark:bg-zinc-800 shadow-xl shadow-slate-100 dark:shadow-none rounded-3xl flex items-center justify-center text-slate-300 dark:text-zinc-600 mb-6">
                <Plus size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2">No active workspaces</h3>
              <p className="text-slate-500 dark:text-zinc-400 font-medium text-center max-w-xs">
                Create a project first; a workspace will be linked automatically.
              </p>
            </div>
          )
        )}

        {activeTab === "applications" && (
          isLoadingApps ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 className="animate-spin text-blue-primary mb-4" size={40} />
              <p className="text-slate-500 font-bold">Loading your applications...</p>
            </div>
          ) : userApplications && userApplications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userApplications.map((app: Application) => (
                <div key={app.id} className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 overflow-hidden relative">
                      {app.project.image_url ? (
                        <Image fill src={app.project.image_url} alt={app.project.title} className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white font-bold text-xl">
                          {app.project.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-900 dark:text-zinc-100 truncate">{app.project.title}</h4>
                      <p className="text-xs font-bold text-slate-400 capitalize">{app.project.category}</p>
                    </div>
                  </div>
                  
                  <div className="py-3 border-y border-slate-50 dark:border-zinc-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold">Applied for</span>
                      <span className="text-slate-700 dark:text-zinc-300 font-extrabold">{app.project_role?.title || "Team Member"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold">Status</span>
                      <span className={`px-2 py-0.5 rounded-lg font-black uppercase tracking-wider text-[9px] ${
                        app.status === 'pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
                        app.status === 'rejected' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' :
                        'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold">Date</span>
                      <span className="text-slate-700 dark:text-zinc-300 font-extrabold">{new Date(app.joined_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/dashboard/projects/${app.project.id}`}
                    className="flex items-center justify-center w-full py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-xs font-black hover:bg-slate-100 transition-all gap-2"
                  >
                    View Project <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 md:p-20 bg-slate-50/50 dark:bg-zinc-900/30 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-zinc-800">
               <div className="w-20 h-20 bg-white dark:bg-zinc-800 shadow-xl shadow-slate-100 dark:shadow-none rounded-3xl flex items-center justify-center text-slate-300 dark:text-zinc-600 mb-6">
                  <Plus size={40} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2">No Ongoing Applications</h3>
               <p className="text-slate-500 dark:text-zinc-400 font-medium text-center max-w-xs">
                  You haven&apos;t applied to any projects yet. Start exploring to find your next team!
               </p>
               <Link href="/dashboard/explore" className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all">
                  Explore Projects
               </Link>
            </div>
          )
        )}

        {activeTab === "invitations" && (
          <div className="flex flex-col items-center justify-center p-10 md:p-20 bg-indigo-50/30 dark:bg-zinc-900/30 rounded-[40px] border-2 border-dashed border-indigo-100 dark:border-zinc-800">
             <div className="w-20 h-20 bg-white dark:bg-zinc-800 shadow-xl shadow-indigo-50 dark:shadow-none rounded-3xl flex items-center justify-center text-indigo-200 dark:text-zinc-700 mb-6">
                <Plus size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2">Project Invitations</h3>
             <p className="text-slate-500 dark:text-zinc-400 font-medium text-center max-w-xs">
                You have 1 pending invitation to join a new project workspace.
             </p>
          </div>
        )}
      </div>

      {isModalOpen && <CreateProjectModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default MyProjectsPage;
