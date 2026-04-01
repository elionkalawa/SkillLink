import React from "react";
import { ExternalLink } from "lucide-react";

interface ContributionCardProps {
  name: string;
  role: string;
  tag: string;
  icon: string;
}

const ContributionCard = ({ name, role, tag, icon }: ContributionCardProps) => {
  return (
    <div className="group flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none transition-all cursor-pointer">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-2xl group-hover:scale-105 transition-transform font-sans">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{name}</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-indigo-600">{role}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tag}</span>
          </div>
        </div>
      </div>
      <button className="flex items-center gap-2 text-xs font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">
        View details
        <ExternalLink size={14} />
      </button>
    </div>
  );
};

export default ContributionCard;
