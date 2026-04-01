import React from "react";
import { Users, Calendar, ArrowRight } from "lucide-react";
import { Project } from "@/types";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Sustainability": return "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "AI/ML": return "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400";
      case "Web3": return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      default: return "bg-slate-50 text-slate-600 dark:bg-zinc-800 dark:text-slate-400";
    }
  };

  return (
    <div className="group relative flex flex-col p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-blue-primary/5 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(project.category)}`}>
          {project.category}
        </span>
        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
          <Users size={14} />
          <span>{project.current_members_count}/{project.max_team_size}</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1 group-hover:text-blue-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-xs font-bold text-slate-400 capitalize">{project.organization}</p>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 font-medium leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map(tag => (
          <span key={tag} className="text-[9px] font-extrabold text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-800/50 px-2.5 py-1.5 rounded-lg tracking-widest">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-8">
        {project.skills_required.map(skill => (
          <span key={skill} className="text-[10px] font-bold text-slate-500 dark:text-slate-300 bg-slate-100/50 dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-50 dark:border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
          <Calendar size={12} />
          <span>{project.deadline}</span>
        </div>
        <Link 
          href={`/dashboard/projects/${project.id}`}
          className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-primary transition-all hover:underline active:scale-95"
        >
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
