import React from "react";

const ProjectStackBadge = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-all hover:bg-white dark:hover:bg-zinc-800 hover:border-indigo-100 hover:text-indigo-600 cursor-default">
      {children}
    </span>
  );
};

export default ProjectStackBadge;
