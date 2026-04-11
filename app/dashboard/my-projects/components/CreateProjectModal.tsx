"use client";

import React, { useState } from "react";
import { X, Loader2, Plus, Trash2, MapPin, ChevronDown, Tag, Users, Sparkles } from "lucide-react";
import { useCreateProject } from "@/hooks";
import { ProjectCategory } from "@/types";

interface CreateProjectModalProps {
  onClose: () => void;
}

const CATEGORIES: ProjectCategory[] = [
  "Web3", "Sustainability", "Productivity", "Health", "Finance", "AI/ML", "Education", "Gaming",
];

const LOCATIONS = ["Remote", "Hybrid", "On-site"] as const;
type Location = (typeof LOCATIONS)[number];

const inputCls =
  "w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all text-sm";

const labelCls = "block text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5";

const SectionCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-50/70 dark:bg-zinc-800/30 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800/60 space-y-3 ${className}`}>
    {children}
  </div>
);

export default function CreateProjectModal({ onClose }: CreateProjectModalProps) {
  const { mutateAsync: createProject, isPending } = useCreateProject();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Productivity" as ProjectCategory,
    location: "Remote" as Location,
    skills_required: "",
    max_team_size: 5,
    tags: "",
  });

  const [roles, setRoles] = useState<
    { title: string; description: string; vacancies: number; skills_required: string }[]
  >([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        skills_required: formData.skills_required.split(",").map((s) => s.trim()).filter(Boolean),
        max_team_size: Number(formData.max_team_size),
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        roles: roles.map((r) => ({
          title: r.title,
          description: r.description,
          vacancies: r.vacancies,
          skills_required: r.skills_required.split(",").map((s) => s.trim()).filter(Boolean),
        })),
      });
      onClose();
    } catch (error) {
      console.error("Failed to create project", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleAddRole = () =>
    setRoles([...roles, { title: "", description: "", vacancies: 1, skills_required: "" }]);

  const handleRoleChange = (index: number, field: string, value: string | number) => {
    const updated = [...roles];
    updated[index] = { ...updated[index], [field]: value };
    setRoles(updated);
  };

  const handleRemoveRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end sm:items-center sm:justify-center sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full rounded-t-[28px] sm:rounded-[28px] sm:max-w-xl shadow-2xl shadow-slate-900/20 flex flex-col max-h-[96dvh] sm:max-h-[88vh] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-none">
                New Project
              </h2>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 mt-0.5">
                Launch your idea
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 dark:bg-zinc-800 mx-6 shrink-0" />

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          <form id="create-project-form" onSubmit={handleSubmit}>
            <div className="space-y-3">

              {/* Title + Description */}
              <SectionCard>
                <div>
                  <label className={labelCls}>Project Title</label>
                  <input
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. NextGen Productivity App"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What is this project about? What problem does it solve?"
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </SectionCard>

              {/* Category · Team Size */}
              <SectionCard>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Category</label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`${inputCls} appearance-none pr-8 cursor-pointer`}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={`${labelCls} flex items-center gap-1`}>
                      <Users size={10} />Team Size
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={50}
                      name="max_team_size"
                      value={formData.max_team_size}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Location pills */}
                <div>
                  <label className={`${labelCls} flex items-center gap-1`}>
                    <MapPin size={10} />Location
                  </label>
                  <div className="flex gap-2">
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, location: loc }))}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-black border transition-all active:scale-95 ${
                          formData.location === loc
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30"
                            : "bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* Skills + Tags */}
              <SectionCard>
                <div>
                  <label className={labelCls}>Skills Required</label>
                  <input
                    name="skills_required"
                    value={formData.skills_required}
                    onChange={handleChange}
                    placeholder="React, Node.js, Figma  (comma-separated)"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={`${labelCls} flex items-center gap-1`}>
                    <Tag size={10} />Tags
                  </label>
                  <input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="startup, web3, remote  (comma-separated)"
                    className={inputCls}
                  />
                </div>
              </SectionCard>

              {/* Roles */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-0.5">
                  <div>
                    <p className="text-[11px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
                      Open Roles
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-600 mt-0.5">
                      Optional — define positions you&apos;re hiring for
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                  >
                    <Plus size={12} /> Add Role
                  </button>
                </div>

                {roles.map((role, index) => (
                  <div
                    key={index}
                    className="bg-slate-50/70 dark:bg-zinc-800/30 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800/60 space-y-3 relative"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(index)}
                      className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-300 dark:text-zinc-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>

                    <div className="grid grid-cols-2 gap-3 pr-7">
                      <div>
                        <label className={labelCls}>Role Title</label>
                        <input
                          required
                          value={role.title}
                          onChange={(e) => handleRoleChange(index, "title", e.target.value)}
                          placeholder="e.g. Frontend Dev"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Vacancies</label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={role.vacancies}
                          onChange={(e) => handleRoleChange(index, "vacancies", parseInt(e.target.value))}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Skills</label>
                      <input
                        value={role.skills_required}
                        onChange={(e) => handleRoleChange(index, "skills_required", e.target.value)}
                        placeholder="React, Tailwind  (comma-separated)"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea
                        value={role.description}
                        onChange={(e) => handleRoleChange(index, "description", e.target.value)}
                        placeholder="Brief role responsibilities..."
                        rows={2}
                        className={`${inputCls} resize-none`}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex gap-2.5 shrink-0 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 font-bold rounded-xl text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-project-form"
            disabled={isPending}
            className="flex-1 py-2.5 font-extrabold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-lg shadow-indigo-500/20"
          >
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
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
