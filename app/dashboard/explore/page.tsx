"use client";

import React, { useState } from "react";
import { 
  Search, 
  Settings2, 
  ArrowUpDown, 
  Search as SearchIcon,
  Loader2
} from "lucide-react";
import ProjectCard from "./components/ProjectCard";
import { useProjects } from "@/hooks";
import TopNav from "../components/TopNav";

const ExplorePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: projects, isLoading, error } = useProjects();

  const categories = [
    "All", "Web3", "Sustainability", "Productivity", "Health", "Finance", "AI/ML", "Education", "Gaming"
  ];

  const filteredProjects = (projects || []).filter(project => {
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (project.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                          (project.skills_required || []).some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Header section */}
      <section className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Explore Projects
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-md max-w-2xl leading-relaxed">
            Join projects that push the boundaries of what&apos;s possible.
          </p>
        </div>
        <TopNav />
      </section>

      {/* Search and filtering section */}
      <section className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-xl py-4 mb-10 -mx-2 px-2">
        <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full xl:max-w-2xl group">
             <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-primary transition-colors">
                <Search size={22} strokeWidth={2.5} />
             </div>
             <input 
               type="text" 
               placeholder="Search by title, skill, or tech stack..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-primary/20 focus:border-blue-primary transition-all shadow-sm"
             />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full xl:w-auto">
            <button className="flex-1 xl:flex-none flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white font-extrabold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm">
              <Settings2 size={20} />
              <span>Filters</span>
            </button>
            <button className="flex-1 xl:flex-none flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white font-extrabold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm">
              <ArrowUpDown size={20} />
              <span>Sort</span>
            </button>
          </div>
        </div>

        {/* Categories strip */}
        <div className="mt-8 flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-xl text-sm font-extrabold whitespace-nowrap transition-all ${
                activeCategory === category 
                ? "bg-blue-primary text-white shadow-lg shadow-blue-primary/25 scale-[1.05]" 
                : "bg-white dark:bg-zinc-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-primary mb-4" size={48} />
          <p className="text-slate-500 font-bold">Discovering projects...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-extrabold text-red-500 mb-2">Error loading projects</h2>
          <p className="text-slate-500 font-bold">Something went wrong. Please try again later.</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 pb-20">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-900 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
            <SearchIcon size={40} />
          </div>
          <h2 className="text-2xl font-extrabold mb-2">No projects found</h2>
          <p className="text-slate-500 font-bold max-w-sm">
            We couldn&apos;t find any projects matching your search or filters. Try adjusting them.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;