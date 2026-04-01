import Image from "next/image";
import Link from "next/link";
import React from "react";

export type WorkspaceListCardProps = {
  id: string;
  image?: string;
  title: string;
  description: string;
  tags?: string[];
  status: string;
  progress: string | number;
  profiles: string[];
};

const WorkspaceListCard = ({
  id,
  image,
  title,
  description,
  status,
  progress,
  profiles,
}: WorkspaceListCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
      {/* Left section */}
      <div className="flex items-center gap-5 w-full md:w-auto">
        {/* Placeholder for Logo/Image */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-white text-3xl font-extrabold shrink-0 overflow-hidden relative shadow-inner">
          {image ? (
            <Image src={image} alt={title} fill className="object-cover" />
          ) : (
            title.charAt(0)
          )}
        </div>

        <div className="flex flex-col gap-1 w-full py-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {title}
          </h1>
          <p className="text-sm font-medium text-slate-500 line-clamp-1">
            {description}
          </p>

          <div className="flex items-center gap-3 mt-2">
            {/* Profiles overlap */}
            <div className="flex -space-x-2">
              {profiles.slice(0, 3).map((profile, idx) => {
                const isValidImage = profile.startsWith("http") || profile.startsWith("/");
                return (
                  <div
                    key={idx}
                    className="w-7 h-7 rounded-full relative overflow-hidden border-[2.5px] border-white dark:border-gray-900 bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-700"
                  >
                    {isValidImage ? (
                      <Image src={profile} alt="Profile" fill className="object-cover" />
                    ) : (
                      profile.charAt(0).toUpperCase()
                    )}
                  </div>
                );
              })}
            </div>
            {profiles.length > 3 && (
              <span className="text-xs font-bold text-slate-400">
                +{profiles.length - 3} OTHERS
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex flex-col items-start md:items-end justify-between w-full md:w-1/3 mt-6 md:mt-0 gap-6 md:gap-4">
        <div className="flex flex-col items-start md:items-end w-full gap-2">
          {/* Progress Bar */}
          <div className="w-full max-w-[200px] h-[10px] rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
            {status}
          </span>
        </div>

        <Link href={`/dashboard/projects/${id}`} className="w-full md:w-auto">
          <button className="px-5 py-2 rounded-full border-2 border-gray-100 dark:border-gray-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full">
            Open Workspace
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WorkspaceListCard;