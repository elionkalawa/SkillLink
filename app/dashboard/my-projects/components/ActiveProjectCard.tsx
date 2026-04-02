"use client";

import React from "react";
import { Clock, Box } from "lucide-react";
import Link from "next/link";

interface ActiveProjectCardProps {
  id: string;
  title: string;
  role: string;
  startedAt: string;
  nextMilestone: {
    name: string;
    dueIn: string;
  };
  tasks: {
    pending: number;
    total: number;
  };
  recentActivity: {
    count: number;
    context: string;
  };
}

const ActiveProjectCard: React.FC<ActiveProjectCardProps> = ({
  id,
  title,
  role,
  startedAt,
  nextMilestone,
  tasks,
  recentActivity,
}) => {
  const taskProgress = tasks.total > 0 ? (tasks.total - tasks.pending) / tasks.total * 100 : 0;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 md:p-10 border border-slate-50 dark:border-zinc-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col md:flex-row items-center gap-10 transition-all hover:shadow-indigo-200/20 dark:hover:shadow-indigo-900/10 duration-500 group">
      {/* Icon/Logo Section */}
      <div className="w-24 h-24 rounded-[32px] bg-indigo-950 flex flex-shrink-0 items-center justify-center text-white text-4xl font-black shadow-inner shadow-black/20 group-hover:scale-105 transition-transform duration-500">
         {title.charAt(0)}
      </div>

      {/* Main Content Info */}
      <div className="flex-1 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{title}</h2>
              <p className="text-sm font-bold text-slate-400 dark:text-zinc-500 mt-1">
                 Role: <span className="text-indigo-600 dark:text-indigo-400">{role}</span> 
                 <span className="mx-2 opacity-50">•</span> 
                 Started {startedAt}
              </p>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
           {/* Section: Next Milestone */}
           <div className="bg-slate-50 dark:bg-zinc-800/40 p-5 rounded-3xl border border-white dark:border-zinc-800 shadow-sm shadow-slate-100 dark:shadow-none">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-widest mb-1 block">Next Milestone</span>
              <h4 className="font-extrabold text-slate-800 dark:text-zinc-100 text-sm">{nextMilestone.name}</h4>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-zinc-400 mt-2">
                 <Clock size={12} className="text-indigo-500" />
                 <span>Due in {nextMilestone.dueIn}</span>
              </div>
           </div>

           {/* Section: Your Tasks */}
           <div className="bg-slate-50 dark:bg-zinc-800/50 p-5 rounded-3xl border border-white dark:border-zinc-800 shadow-sm shadow-slate-100 dark:shadow-none">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-widest mb-1 block">Your Tasks</span>
              <h4 className="font-extrabold text-slate-800 dark:text-zinc-100 text-sm">{tasks.pending} Pending</h4>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
                 <div 
                   className="h-full bg-indigo-500/80 rounded-full" 
                   style={{ width: `${taskProgress}%` }}
                 />
              </div>
           </div>

           {/* Section: Recent Activity */}
           <div className="bg-slate-50 dark:bg-zinc-800/50 p-5 rounded-3xl border border-white dark:border-zinc-800 shadow-sm shadow-slate-100 dark:shadow-none">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-widest mb-1 block">Recent Activity</span>
              <h4 className="font-extrabold text-slate-800 dark:text-zinc-100 text-sm">{recentActivity.count} new comments</h4>
              <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 mt-2">{recentActivity.context}</p>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 pt-4">
           <Link href={`/dashboard/projects/${id}`} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 group/btn">
              <Box size={18} className="group-hover/btn:scale-110 transition-transform" />
              <span>Open Workspace</span>
           </Link>
           <button className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-extrabold text-sm hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all shadow-sm active:scale-95">
              <span>View Repository</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveProjectCard;
