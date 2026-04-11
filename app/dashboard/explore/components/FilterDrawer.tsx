"use client";

import React from "react";
import { X, RotateCcw, Settings2 } from "lucide-react";
import { ProjectStatus } from "@/types";

// ── Types ────────────────────────────────────────────────────────────────────

export interface ProjectFilters {
  status: ProjectStatus[];
  location: string[];
  teamSize: "any" | "solo" | "small" | "medium" | "large";
  skills: string[];
}

export interface ProfileFilters {
  skills: string[];
  location: string[];
  role: string;
}

export const DEFAULT_PROJECT_FILTERS: ProjectFilters = {
  status: [],
  location: [],
  teamSize: "any",
  skills: [],
};

export const DEFAULT_PROFILE_FILTERS: ProfileFilters = {
  skills: [],
  location: [],
  role: "",
};

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  activeTab: "projects" | "profiles";
  projectFilters: ProjectFilters;
  profileFilters: ProfileFilters;
  onProjectFiltersChange: (f: ProjectFilters) => void;
  onProfileFiltersChange: (f: ProfileFilters) => void;
  availableProjectSkills: string[];
  availableProfileSkills: string[];
  availableProjectLocations: string[];
  availableProfileLocations: string[];
  availableProfileRoles: string[];
  resultCount: number;
  isLoadingProfiles?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.18em] mb-3">
      {children}
    </p>
  );
}

function Chip({
  active,
  onClick,
  children,
  color = "indigo",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: "indigo" | "emerald" | "amber" | "rose";
}) {
  const activeClasses = {
    indigo: "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-indigo-900/30",
    emerald: "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200 dark:shadow-emerald-900/30",
    amber: "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200 dark:shadow-amber-900/30",
    rose: "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200 dark:shadow-rose-900/30",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-xl text-[11px] font-bold border transition-all duration-200 active:scale-95 whitespace-nowrap ${
        active
          ? activeClasses[color]
          : "bg-slate-50 dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-400 border-slate-100 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600 dark:hover:text-indigo-400"
      }`}
    >
      {children}
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onClose,
  activeTab,
  projectFilters,
  profileFilters,
  onProjectFiltersChange,
  onProfileFiltersChange,
  availableProjectSkills,
  availableProfileSkills,
  availableProjectLocations,
  availableProfileLocations,
  availableProfileRoles,
  resultCount,
  isLoadingProfiles = false,
}) => {
  const pf = projectFilters;
  const uf = profileFilters;

  const activeCount =
    activeTab === "projects"
      ? pf.status.length +
        pf.location.length +
        (pf.teamSize !== "any" ? 1 : 0) +
        pf.skills.length
      : uf.skills.length +
        (uf.location ? 1 : 0) +
        (uf.role ? 1 : 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[380px] bg-white dark:bg-zinc-950 border-l border-slate-100 dark:border-zinc-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 dark:border-zinc-900">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Filters
            </h2>
            {activeCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-hide">

          {activeTab === "projects" ? (
            <>
              {/* Status */}
              <div>
                <SectionLabel>Status</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {(["open", "in-progress", "completed"] as ProjectStatus[]).map((s) => {
                    const labels: Record<ProjectStatus, string> = {
                      open: "Open",
                      "in-progress": "In Progress",
                      completed: "Completed",
                    };
                    const colors: Record<ProjectStatus, "emerald" | "amber" | "indigo"> = {
                      open: "emerald",
                      "in-progress": "amber",
                      completed: "indigo",
                    };
                    return (
                      <Chip
                        key={s}
                        active={pf.status.includes(s)}
                        onClick={() =>
                          onProjectFiltersChange({ ...pf, status: toggle(pf.status, s) })
                        }
                        color={colors[s]}
                      >
                        {labels[s]}
                      </Chip>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              {availableProjectLocations.length > 0 && (
                <div>
                  <SectionLabel>Location</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {availableProjectLocations.map((loc) => (
                      <Chip
                        key={loc}
                        active={pf.location.includes(loc)}
                        onClick={() =>
                          onProjectFiltersChange({ ...pf, location: toggle(pf.location, loc) })
                        }
                      >
                        {loc}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Size */}
              <div>
                <SectionLabel>Team Size</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { key: "any", label: "Any" },
                      { key: "solo", label: "Solo (1)" },
                      { key: "small", label: "Small (2–4)" },
                      { key: "medium", label: "Medium (5–9)" },
                      { key: "large", label: "Large (10+)" },
                    ] as { key: ProjectFilters["teamSize"]; label: string }[]
                  ).map(({ key, label }) => (
                    <Chip
                      key={key}
                      active={pf.teamSize === key}
                      onClick={() => onProjectFiltersChange({ ...pf, teamSize: key })}
                    >
                      {label}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Skills */}
              {availableProjectSkills.length > 0 && (
                <div>
                  <SectionLabel>Required Skills</SectionLabel>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto scrollbar-hide pr-1">
                    {availableProjectSkills.map((skill) => (
                      <Chip
                        key={skill}
                        active={pf.skills.includes(skill)}
                        onClick={() =>
                          onProjectFiltersChange({ ...pf, skills: toggle(pf.skills, skill) })
                        }
                      >
                        {skill}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : isLoadingProfiles ? (
            /* Loading skeleton */
            <div className="space-y-8">
              {[80, 120, 96].map((w) => (
                <div key={w}>
                  <div className="h-3 w-16 bg-slate-100 dark:bg-zinc-800 rounded-full mb-4 animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    {[w, w - 20, w + 10, w - 30].map((ww, i) => (
                      <div
                        key={i}
                        style={{ width: ww }}
                        className="h-8 bg-slate-100 dark:bg-zinc-800 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : availableProfileRoles.length === 0 &&
            availableProfileLocations.length === 0 &&
            availableProfileSkills.length === 0 ? (
            /* Empty state — profiles loaded but no filterable fields set */
            <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-center">
                <Settings2 size={20} className="text-slate-300 dark:text-zinc-600" />
              </div>
              <p className="text-sm font-black text-slate-500 dark:text-zinc-400">
                No filters available
              </p>
              <p className="text-xs font-bold text-slate-400 dark:text-zinc-600 max-w-[200px] leading-relaxed">
                Filters appear once profiles have skills, roles, or locations set.
              </p>
            </div>
          ) : (
            <>
              {/* Role */}
              {availableProfileRoles.length > 0 && (
                <div>
                  <SectionLabel>Role / Title</SectionLabel>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto scrollbar-hide pr-1">
                    {availableProfileRoles.map((role) => (
                      <Chip
                        key={role}
                        active={uf.role === role}
                        onClick={() =>
                          onProfileFiltersChange({
                            ...uf,
                            role: uf.role === role ? "" : role,
                          })
                        }
                      >
                        {role}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {availableProfileLocations.length > 0 && (
                <div>
                  <SectionLabel>Location</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {availableProfileLocations.map((loc) => (
                      <Chip
                        key={loc}
                        active={uf.location.includes(loc)}
                        onClick={() =>
                          onProfileFiltersChange({ ...uf, location: toggle(uf.location, loc) })
                        }
                      >
                        {loc}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {availableProfileSkills.length > 0 && (
                <div>
                  <SectionLabel>Skills</SectionLabel>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto scrollbar-hide pr-1">
                    {availableProfileSkills.map((skill) => (
                      <Chip
                        key={skill}
                        active={uf.skills.includes(skill)}
                        onClick={() =>
                          onProfileFiltersChange({ ...uf, skills: toggle(uf.skills, skill) })
                        }
                      >
                        {skill}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-50 dark:border-zinc-900 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (activeTab === "projects") onProjectFiltersChange({ ...DEFAULT_PROJECT_FILTERS });
              else onProfileFiltersChange({ ...DEFAULT_PROFILE_FILTERS });
            }}
            className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-rose-500 transition-colors"
          >
            <RotateCcw size={13} />
            Reset All
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-black hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Show {resultCount} result{resultCount !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
