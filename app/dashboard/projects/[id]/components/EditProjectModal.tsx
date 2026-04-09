"use client";

import React, { useState } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { Project, ProjectCategory, ProjectRole } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditProjectModalProps {
  project: Project & { roles?: ProjectRole[] };
  onClose: () => void;
}

interface UIRole {
  id?: string;
  title: string;
  description?: string | null;
  vacancies: number;
  is_open?: boolean;
  skills_required: string;
}

const CATEGORIES: ProjectCategory[] = [
  'Web3', 'Sustainability', 'Productivity', 'Health', 'Finance', 'AI/ML', 'Education', 'Gaming'
];

export default function EditProjectModal({ project, onClose }: EditProjectModalProps) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title || "",
    description: project.description || "",
    category: project.category || "Productivity",
    skills_required: project.skills_required?.join(", ") || "",
    max_team_size: project.max_team_size || 5,
    tags: project.tags?.join(", ") || "",
  });

  const [roles, setRoles] = useState<UIRole[]>(
    project.roles ? project.roles.map(r => ({
      ...r,
      skills_required: Array.isArray(r.skills_required) ? r.skills_required.join(", ") : (r.skills_required as unknown as string || "")
    })) : []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    try {
      // 1. Update basic project details
      const updateRes = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          skills_required: formData.skills_required.split(",").map((s: string) => s.trim()).filter(Boolean),
          max_team_size: formData.max_team_size,
          tags: formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
          roles: roles.map((r: UIRole) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            vacancies: r.vacancies,
            is_open: r.is_open !== undefined ? r.is_open : true,
            skills_required: r.skills_required.split(",").map((s: string) => s.trim()).filter(Boolean)
          })),
        })
      });
      
      if (!updateRes.ok) throw new Error("Failed to update project basics");

      // 2. We can update roles in a real application through specific role endpoints 
      //    or a unified sync endpoint. Since we just created this feature, 
      //    we'll notify the user it's a WIP if roles change, or we can just update the ones we know about!
      
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects", project.id] });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update project");
    } finally {
      setIsPending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRole = () => {
    setRoles([...roles, { title: "", description: "", vacancies: 1, skills_required: "", is_open: true }]);
  };

  const handleRoleChange = (index: number, field: string, value: string | number) => {
    const newRoles = [...roles];
    newRoles[index] = { ...newRoles[index], [field]: value };
    setRoles(newRoles);
  };

  const handleRemoveRole = (index: number) => {
    const newRoles = [...roles];
    newRoles.splice(index, 1);
    setRoles(newRoles);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800">
          <h2 className="text-2xl font-black">Edit Project</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="edit-project-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Project Title</label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
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
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Tags (comma-separated)</label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
              />
            </div>
            
            <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Project Roles</label>
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="px-3 py-1.5 flex items-center gap-1 text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Plus size={14} /> Add Role
                </button>
              </div>

              {roles.map((role, index) => (
                <div key={index} className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-zinc-800/30 dark:border-zinc-700 space-y-4 relative">
                  <button 
                    type="button" 
                    onClick={() => handleRemoveRole(index)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Role Title *</label>
                      <input
                        required
                        value={role.title}
                        onChange={(e) => handleRoleChange(index, "title", e.target.value)}
                        placeholder="e.g. Frontend Developer"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-zinc-700 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Vacancies *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={role.vacancies}
                        onChange={(e) => handleRoleChange(index, "vacancies", parseInt(e.target.value))}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-zinc-700 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Skills (comma-separated)</label>
                    <input
                      value={role.skills_required}
                      onChange={(e) => handleRoleChange(index, "skills_required", e.target.value)}
                      placeholder="React, Tailwind"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-zinc-700 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Description</label>
                    <textarea
                      value={role.description || ""}
                      onChange={(e) => handleRoleChange(index, "description", e.target.value)}
                      placeholder="Brief role responsibilities..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-zinc-700 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
                    />
                  </div>
                </div>
              ))}
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
            form="edit-project-form"
            disabled={isPending}
            className="px-8 py-3 font-extrabold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-xl shadow-indigo-200 dark:shadow-none"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
