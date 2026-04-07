"use client";

import React, { useState } from "react";
import { Plus, Loader2, Layout, ArrowRight } from "lucide-react";
import Link from "next/link";
import ProjectTabs from "./components/ProjectTabs";
import TopNav from "../components/TopNav";
import ActiveProjectCard from "./components/ActiveProjectCard";
import CreateProjectModal from "./components/CreateProjectModal";
import { useUserProjects } from "@/hooks";

const MyProjectsPage = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: projects, isLoading } = useUserProjects();
  const workspaceProjects =
    projects?.filter((project) => (project.workspaces?.length || 0) > 0) || [];

  const counts = {
    projects: projects?.length || 0,
    workspaces: workspaceProjects.length,
    applications: 2,
    invitations: 1,
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header section */}
      <section className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            My Projects
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-md max-w-2xl leading-relaxed">
            Manage your active work, applications, and invitations.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-end gap-4 h-full">
          <TopNav />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 active:scale-95 group"
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
          <div className="flex flex-col items-center justify-center p-10 md:p-20 bg-slate-50/50 dark:bg-zinc-900/30 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-zinc-800">
             <div className="w-20 h-20 bg-white dark:bg-zinc-800 shadow-xl shadow-slate-100 dark:shadow-none rounded-3xl flex items-center justify-center text-slate-300 dark:text-zinc-600 mb-6">
                <Plus size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2">Ongoing Applications</h3>
             <p className="text-slate-500 dark:text-zinc-400 font-medium text-center max-w-xs">
                You have 2 applications waiting for approval. Check back soon for updates!
             </p>
          </div>
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
