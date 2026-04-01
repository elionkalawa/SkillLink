"use client";

import React from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PositionCard from "@/components/project/PositionCard";
import TeamMemberRow from "@/components/project/TeamMemberRow";
import ProjectSidebar from "@/components/project/ProjectSidebar";
import ProjectStackBadge from "@/components/project/ProjectStackBadge";

const ProjectDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;

  // Mock project data matching the reference image
  const project = {
    id,
    title: "Sentience AI Agent",
    category: "AI/ML",
    postedDate: "OCT 2023",
    overview: `An open-source framework for building multi-modal AI agents that can browse the web and execute local scripts. Focused on extreme security and privacy.

We are seeking dedicated builders who are excited about decentralized systems and sustainable tech. This project is currently in early-stage prototyping and offers significant ownership over core features.`,
    host: {
      name: "NeuralFlow",
      image: undefined,
      verified: true
    },
    positions: [
      { id: "1", title: "LLM Ops", experience_level: "ENTRY TO MID" },
      { id: "2", title: "Rust", experience_level: "ENTRY TO MID" },
      { id: "3", title: "Security", experience_level: "ENTRY TO MID" }
    ],
    stack: ["Gemini API", "Rust", "Python", "WASM"],
    team: [
      { id: "t1", name: "Sarah Chen", role: "PRODUCT LEAD", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
      { id: "t2", name: "Marcus Wright", role: "BACKEND ENGINEER", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
      { id: "t3", name: "You?", role: "FULL STACK", is_hiring: true }
    ],
    progress: {
      current: 12,
      max: 20
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-in-out">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 group">
        <Link 
          href="/dashboard/explore" 
          className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-indigo-600 transition-all active:scale-95 py-2 px-1 rounded-xl"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Back to Marketplace
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-16 lg:pb-32">
          {/* Project Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 font-black text-[10px] uppercase tracking-widest leading-none">
                {project.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest">
                <Calendar size={14} className="mt-[-2px]" />
                POSTED {project.postedDate}
              </div>
            </div>
            
            <div className="space-y-4">
               <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                 {project.title}
               </h1>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-lg">
                    N
                  </div>
                  <span className="text-xl font-bold text-indigo-600">{project.host.name}</span>
               </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Overview</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {project.overview}
              </p>
            </div>
          </div>

          {/* Open Positions Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Open Positions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               {project.positions.map((pos) => (
                 <PositionCard 
                    key={pos.id} 
                    title={pos.title} 
                    experience_level={pos.experience_level} 
                 />
               ))}
            </div>
          </div>

          {/* The Stack Section */}
          <div className="space-y-8">
             <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">The Stack</h2>
             <div className="flex flex-wrap gap-4">
                {project.stack.map(tech => (
                  <ProjectStackBadge key={tech}>{tech}</ProjectStackBadge>
                ))}
             </div>
          </div>

          {/* Current Team Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Current Team</h2>
            <div className="space-y-4">
               {project.team.map((member) => (
                 <TeamMemberRow 
                    key={member.id}
                    name={member.name}
                    role={member.role}
                    image={member.image}
                    is_hiring={member.is_hiring}
                 />
               ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 relative">
          <ProjectSidebar 
            current_slots={project.progress.current}
            max_slots={project.progress.max}
            host_name={project.host.name}
            host_image={project.host.image}
            host_verified={project.host.verified}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
