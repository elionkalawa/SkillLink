import React from "react";
export type StartCardsProps = {
  icon: React.ReactElement;
  iconsize: string;
  title: string;
  stats: string;
};
const StatsCards = ({ icon, iconsize, title, stats }: StartCardsProps) => {
  return (
    <div className="bg-white dark:bg-gray-900/60 w-full rounded-xl p-4 md:p-8 shadow-lg shadow-slate-200 dark:shadow-slate-900">
      <div className="flex flex-col justify-center items-start gap-2 md:gap-3">
        <div className={`flex items-center justify-center text-slate-500 dark:text-blue-primary ${iconsize}`}>
          {icon}
        </div>
        <div className="flex flex-col justify-center items-start gap-1 py-2">
          <h1 className="text-sm font-extrabold text-slate-500 dark:text-slate-400">{title.toUpperCase()}</h1>
          <p className="text-4xl text-black dark:text-white font-extrabold">{stats}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
