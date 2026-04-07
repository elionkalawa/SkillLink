"use client";

import React, { useState } from "react";
import { 
  Box, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  ChevronRight, 
  Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDeleteProject } from "@/hooks/useProjects";
import { toast } from "sonner";

interface ActiveProjectCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  workspaceId?: string;
  role?: string;
  image_url?: string;
  tasks?: {
    pending: number;
    total: number;
  };
}

const ActiveProjectCard: React.FC<ActiveProjectCardProps> = ({
  id,
  title,
  description,
  tags,
  status,
  workspaceId,
  role,
  image_url,
  tasks,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject();

  const taskProgress = tasks && tasks.total > 0 ? (tasks.total - tasks.pending) / tasks.total * 100 : 0;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project? This will also remove the associated workspace and chat.")) {
      try {
        await deleteProject(id);
        toast.success("Project deleted successfully");
      } catch (err) {
        toast.error("Failed to delete project");
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 md:p-8 border border-slate-100 dark:border-zinc-800 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col items-start gap-6 transition-all hover:shadow-indigo-200/30 dark:hover:shadow-indigo-900/10 duration-500 group relative">
      
      {/* Top Section */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950 flex shrink-0 items-center justify-center text-white text-2xl font-black shadow-inner shadow-black/20 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
             {image_url ? (
               <Image src={image_url} alt={title} width={64} height={64} className="w-full h-full object-cover" />
             ) : (
               title.charAt(0)
             )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight truncate group-hover:text-indigo-600 transition-colors">{title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-wider">
                {status}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {role || "Project Owner"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-slate-400"
          >
            <MoreVertical size={20} />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 font-bold text-sm transition-colors">
                  <Pencil size={16} /> Edit Details
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-rose-50 text-rose-600 font-bold text-sm transition-colors disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Delete Project
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4 w-full">
        <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-medium">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-100/50 dark:border-zinc-700/50 uppercase tracking-tight">
              #{tag}
            </span>
          ))}
          {tags?.length > 3 && <span className="text-[10px] font-bold text-slate-400 px-1">+{tags.length - 3}</span>}
        </div>
      </div>

      {/* Progress / Stats */}
      {tasks && (
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
            <span>Project Progress</span>
            <span>{Math.round(taskProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${taskProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="w-full pt-2">
         {workspaceId ? (
           <Link 
             href={`/dashboard/workspaces/${workspaceId}`} 
             className="flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-[0.98] group/btn overflow-hidden relative"
           >
             <div className="flex items-center gap-3 relative z-10">
               <Box size={20} className="group-hover/btn:rotate-12 transition-transform" />
               <span>Enter Workspace Hub</span>
             </div>
             <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform relative z-10" />
             <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
           </Link>
         ) : (
           <button className="flex items-center justify-center w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 font-black text-sm cursor-not-allowed">
              Setting up workspace...
           </button>
         )}
      </div>
    </div>
  );
};

export default ActiveProjectCard;
