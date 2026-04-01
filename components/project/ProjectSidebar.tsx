import React from "react";
import { Users, Info, ChevronRight } from "lucide-react";
import Image from "next/image";

interface ProjectSidebarProps {
  current_slots: number;
  max_slots: number;
  host_name: string;
  host_image?: string;
  host_verified?: boolean;
}

const ProjectSidebar = ({ current_slots, max_slots, host_name, host_image, host_verified }: ProjectSidebarProps) => {
  const progressPercent = (current_slots / max_slots) * 100;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-slate-200 dark:border-zinc-800 space-y-12 shadow-sm sticky top-10">
      {/* Progress Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">PROGRESS</h2>
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
            <Users size={16} className="text-slate-400" />
            <span>{current_slots} / {max_slots} slots</span>
          </div>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button className="w-full flex items-center justify-center p-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 text-lg">
          Join Project
        </button>
        <button className="w-full flex items-center justify-center p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-black hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all active:scale-95 text-lg shadow-sm">
          Save Project
        </button>
      </div>

      {/* Host Information */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">PROJECT HOST</h2>
        <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/20 border border-slate-100 dark:border-zinc-800 rounded-2xl group transition-all cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl border border-slate-100 dark:border-zinc-800 overflow-hidden bg-slate-900 flex items-center justify-center text-white font-black text-xl group-hover:scale-105 transition-transform">
               {host_image ? (
                 <Image src={host_image} alt={host_name} width={48} height={48} className="object-cover w-full h-full" />
               ) : (
                 <span>{host_name.charAt(0)}</span>
               )}
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white leading-tight">{host_name}</h3>
              {host_verified && <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">Verified Org</p>}
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-300 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* Info Alert */}
      <div className="p-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl flex gap-4">
        <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" strokeWidth={3} />
        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 leading-relaxed">
          Applying to this project will share your public SkillLink profile with the organizers.
        </p>
      </div>
    </div>
  );
};

export default ProjectSidebar;
