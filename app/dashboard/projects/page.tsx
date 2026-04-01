"use client";

import React from "react";
import ProjectCard from "../explore/components/ProjectCard";
import { MOCK_PROJECTS } from "../explore/mockData";

const Projects = () => {
  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section */}
      <section>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
          All Projects
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-md max-w-2xl leading-relaxed">
          Find the perfect project that matches your expertise and passion.
        </p>
      </section>

      {/* Projects Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 pb-20">
        {MOCK_PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </div>
  );
};

export default Projects;