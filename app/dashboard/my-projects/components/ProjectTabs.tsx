"use client";

import React from "react";
import { Briefcase, Send, Mail, Layout } from "lucide-react";

interface ProjectTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    projects: number;
    workspaces: number;
    applications: number;
    invitations: number;
  };
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { id: "projects", label: "My Projects", icon: <Briefcase size={18} />, count: counts.projects },
    { id: "workspaces", label: "Workspaces", icon: <Layout size={18} />, count: counts.workspaces },
    { id: "applications", label: "Applications", icon: <Send size={18} />, count: counts.applications },
    { id: "invitations", label: "Invitations", icon: <Mail size={18} />, count: counts.invitations },
  ];

  return (
    <div className="flex border-b border-slate-100 dark:border-zinc-800 gap-8 mb-10 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2.5 pb-4 px-1 text-sm font-bold transition-all relative whitespace-nowrap ${
            activeTab === tab.id
              ? "text-indigo-600 dark:text-indigo-400 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600 dark:after:bg-indigo-400"
              : "text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-400"
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-tighter ${
            activeTab === tab.id
              ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
              : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400"
          }`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ProjectTabs;
