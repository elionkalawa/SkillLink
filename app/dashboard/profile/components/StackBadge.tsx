import React from "react";

const StackBadge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={`px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider transition-all hover:border-indigo-200 dark:hover:border-indigo-900 cursor-default ${className}`}>
      {children}
    </span>
  );
};

export default StackBadge;
