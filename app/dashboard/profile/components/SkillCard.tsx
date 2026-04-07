import React from "react";

interface SkillCardProps {
  name: string;
}

const SkillCard = ({ name }: SkillCardProps) => {
  return (
    <div className="flex items-center p-4 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 font-black text-lg">
          {name.charAt(0)}
        </div>
        <span className="font-bold text-slate-900 dark:text-white">{name}</span>
      </div>
    </div>
  );
};

export default SkillCard;
