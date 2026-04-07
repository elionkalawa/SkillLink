"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useCreateProject } from "@/hooks";
import { ProjectCategory } from "@/types";

interface CreateProjectModalProps {
  onClose: () => void;
}

const CATEGORIES: ProjectCategory[] = [
  'Web3', 'Sustainability', 'Productivity', 'Health', 'Finance', 'AI/ML', 'Education', 'Gaming'
];

export default function CreateProjectModal({ onClose }: CreateProjectModalProps) {
  const { mutateAsync: createProject, isPending } = useCreateProject();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Productivity" as ProjectCategory,
    skills_required: "",
    max_team_size: 5,
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skills_required: formData.skills_required.split(",").map(s => s.trim()).filter(Boolean),
        max_team_size: formData.max_team_size,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      });
      onClose();
    } catch (error) {
      console.error("Failed to create project", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800">
          <h2 className="text-2xl font-black">Create New Project</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="create-project-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Project Title</label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. NextGen Productivity App"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Description</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What is this project about?"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Max Team Size</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={50}
                  name="max_team_size"
                  value={formData.max_team_size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Skills Required (comma-separated)</label>
              <input
                name="skills_required"
                value={formData.skills_required}
                onChange={handleChange}
                placeholder="React, Node.js, Design"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Tags (comma-separated)</label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="STARTUP, WEB3, REMOTE"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-zinc-900/50 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 font-bold rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-project-form"
            disabled={isPending}
            className="px-8 py-3 font-extrabold rounded-xl bg-blue-primary text-white hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
