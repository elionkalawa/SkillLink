"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import ProjectTabs from "./components/ProjectTabs";
import TopNav from "../components/TopNav";

const MyProjectsPage = () => {
  const [activeTab, setActiveTab] = useState("projects");

  const counts = {
    projects: 0,
    workspaces: 0,
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
          <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 active:scale-95 group">
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
          <div className="flex flex-col items-center justify-center p-10 md:p-20 bg-slate-50/50 dark:bg-zinc-900/30 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-zinc-800">
             <div className="w-20 h-20 bg-white dark:bg-zinc-800 shadow-xl shadow-slate-100 dark:shadow-none rounded-3xl flex items-center justify-center text-slate-300 dark:text-zinc-600 mb-6">
                <Plus size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2">No Projects Created</h3>
             <p className="text-slate-500 dark:text-zinc-400 font-medium text-center max-w-xs">
                You haven&apos;t posted any projects yet. Create one to start building your team!
             </p>
          </div>
        )}

        {activeTab === "workspaces" && (
          <div className="flex flex-col items-center justify-center p-10 md:p-20 bg-slate-50/50 dark:bg-zinc-900/30 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-zinc-800">
             <div className="w-20 h-20 bg-white dark:bg-zinc-800 shadow-xl shadow-slate-100 dark:shadow-none rounded-3xl flex items-center justify-center text-slate-300 dark:text-zinc-600 mb-6">
                <Plus size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2">No active workspaces</h3>
             <p className="text-slate-500 dark:text-zinc-400 font-medium text-center max-w-xs">
                You haven&apos;t joined any workspaces yet. Browse the marketplace to find projects!
             </p>
          </div>
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
    </div>
  );
};

export default MyProjectsPage;
