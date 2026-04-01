import React from "react";

interface PositionCardProps {
  title: string;
  experience_level: string;
  onApply?: () => void;
}

const PositionCard = ({ title, experience_level, onApply }: PositionCardProps) => {
  return (
    <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl group hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none transition-all">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 font-black text-2xl group-hover:scale-105 transition-transform">
          💼
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{title}</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{experience_level}</p>
        </div>
      </div>
      <button 
        onClick={onApply}
        className="px-4 py-2 text-[10px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest border border-slate-100 dark:border-zinc-800 group-hover:border-indigo-100 rounded-xl"
      >
        APPLY
      </button>
    </div>
  );
};

export default PositionCard;
