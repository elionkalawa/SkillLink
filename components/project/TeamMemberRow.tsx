import React from "react";
import Image from "next/image";

interface TeamMemberRowProps {
  name: string;
  role: string;
  image?: string;
  is_hiring?: boolean;
}

const TeamMemberRow = ({ name, role, image, is_hiring }: TeamMemberRowProps) => {
  return (
    <div className={`p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl flex items-center justify-between group transition-all ${is_hiring ? 'bg-slate-50/50 dark:bg-zinc-950/20' : ''}`}>
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center text-slate-300 font-bold shadow-sm group-hover:scale-105 transition-transform ${is_hiring ? 'border-2 border-dashed border-slate-200' : ''}`}>
          {image ? (
            <Image src={image} alt={name} width={56} height={56} className="object-cover w-full h-full" />
          ) : (
            <span className="text-2xl text-slate-400">👤</span>
          )}
        </div>
        <div className="space-y-1">
          <h3 className={`text-xl font-black text-slate-900 dark:text-white leading-tight ${is_hiring ? 'text-slate-400' : ''}`}>{name}</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{role}</p>
        </div>
      </div>
      {is_hiring && (
        <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
          HIRING
        </span>
      )}
    </div>
  );
};

export default TeamMemberRow;
