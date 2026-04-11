"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Settings2,
  ArrowUpDown,
  Search as SearchIcon,
  Loader2,
  Check,
} from "lucide-react";
import ProjectCard from "./components/ProjectCard";
import ProfileCard from "./components/ProfileCard";
import FilterDrawer, {
  ProjectFilters,
  ProfileFilters,
  DEFAULT_PROJECT_FILTERS,
  DEFAULT_PROFILE_FILTERS,
} from "./components/FilterDrawer";
import { useProjects } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import TopNav from "../components/TopNav";
import { ProjectStatus } from "@/types";

// ── Sort options ──────────────────────────────────────────────────────────────

type ProjectSort = "newest" | "oldest" | "deadline" | "size";
type ProfileSort = "newest" | "az" | "za";

const PROJECT_SORT_OPTIONS: { key: ProjectSort; label: string }[] = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "deadline", label: "Deadline soonest" },
  { key: "size", label: "Largest team" },
];

const PROFILE_SORT_OPTIONS: { key: ProfileSort; label: string }[] = [
  { key: "newest", label: "Newest first" },
  { key: "az", label: "A → Z" },
  { key: "za", label: "Z → A" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "profiles">("projects");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter state
  const [projectFilters, setProjectFilters] = useState<ProjectFilters>(DEFAULT_PROJECT_FILTERS);
  const [profileFilters, setProfileFilters] = useState<ProfileFilters>(DEFAULT_PROFILE_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  // Sort state
  const [projectSort, setProjectSort] = useState<ProjectSort>("newest");
  const [profileSort, setProfileSort] = useState<ProfileSort>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Data
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useProjects();

  // Fetch all profiles upfront; filtering/searching is done client-side
  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useQuery({
    queryKey: ["users", "explore"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch profiles");
      return res.json() as Promise<{
        id: string;
        name: string;
        username: string;
        image: string | null;
        bio: string | null;
        skills: string[];
        profile_title: string | null;
        role: string | null;
        location: string | null;
      }[]>;
    },
    enabled: activeTab === "profiles",
    staleTime: 60_000,
  });

  const isLoading = activeTab === "projects" ? projectsLoading : profilesLoading;
  const error = activeTab === "projects" ? projectsError : profilesError;

  // Close sort dropdown on outside click
  useEffect(() => {
    if (!sortOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        sortButtonRef.current?.contains(e.target as Node) ||
        sortDropdownRef.current?.contains(e.target as Node)
      )
        return;
      setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortOpen]);

  // ── Derived: categories from real data ──────────────────────────────────
  // Stable list of all categories that appear in ANY project
  const derivedCategories = useMemo(() => {
    const set = new Set<string>();
    (projects || []).forEach((p) => set.add(p.category));
    return Array.from(set).sort();
  }, [projects]);

  // Count per category matching current search + drawer filters, excluding category filter
  // so the pills always show "if you click this, you'd see N"
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: 0 };
    const q = searchQuery.toLowerCase();
    (projects || []).forEach((project) => {
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        (project.description?.toLowerCase() || "").includes(q) ||
        (project.skills_required || []).some((s) => s.toLowerCase().includes(q));

      const { status, location, teamSize, skills } = projectFilters;
      const matchesStatus = status.length === 0 || status.includes(project.status as ProjectStatus);
      const matchesLocation =
        location.length === 0 || location.includes(project.location || "Remote");
      const matchesSkills =
        skills.length === 0 || skills.every((s) => project.skills_required.includes(s));
      const size = project.max_team_size;
      const matchesTeamSize =
        teamSize === "any" ||
        (teamSize === "solo" && size === 1) ||
        (teamSize === "small" && size >= 2 && size <= 4) ||
        (teamSize === "medium" && size >= 5 && size <= 9) ||
        (teamSize === "large" && size >= 10);

      if (matchesSearch && matchesStatus && matchesLocation && matchesSkills && matchesTeamSize) {
        counts.All = (counts.All || 0) + 1;
        counts[project.category] = (counts[project.category] || 0) + 1;
      }
    });
    return counts;
  }, [projects, searchQuery, projectFilters]);

  // ── Derived: available filter values from data ───────────────────────────
  const availableProjectSkills = useMemo(() => {
    const set = new Set<string>();
    (projects || []).forEach((p) => p.skills_required.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [projects]);

  const availableProfileSkills = useMemo(() => {
    const set = new Set<string>();
    (profiles || []).forEach((u) =>
      (u.skills || []).forEach((s) => set.add(s.replace(/^#+/, "").trim())),
    );
    return Array.from(set).sort();
  }, [profiles]);

  // Locations from actual project data — deduplicated
  const availableProjectLocations = useMemo(() => {
    const set = new Set<string>();
    (projects || []).forEach((p) => set.add(p.location || "Remote"));
    return Array.from(set).sort();
  }, [projects]);

  // Locations from actual profile data — deduplicated
  const availableProfileLocations = useMemo(() => {
    const set = new Set<string>();
    (profiles || []).forEach((u) => {
      if (u.location?.trim()) set.add(u.location.trim());
    });
    return Array.from(set).sort().slice(0, 20);
  }, [profiles]);

  // Roles from actual profile data — deduplicated, capped for readability
  const availableProfileRoles = useMemo(() => {
    const set = new Set<string>();
    (profiles || []).forEach((u) => {
      if (u.role?.trim()) set.add(u.role.trim());
      if (u.profile_title?.trim()) set.add(u.profile_title.trim());
    });
    return Array.from(set).sort().slice(0, 20);
  }, [profiles]);

  // ── Derived: active filter count (for badge) ─────────────────────────────
  const activeFilterCount = useMemo(() => {
    if (activeTab === "projects") {
      return (
        projectFilters.status.length +
        projectFilters.location.length +
        (projectFilters.teamSize !== "any" ? 1 : 0) +
        projectFilters.skills.length
      );
    }
    return (
      profileFilters.skills.length +
      profileFilters.location.length +
      (profileFilters.role ? 1 : 0)
    );
  }, [activeTab, projectFilters, profileFilters]);

  // ── Filtered + sorted projects ───────────────────────────────────────────
  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const result = (projects || []).filter((project) => {
      if (activeCategory !== "All" && project.category !== activeCategory) return false;
      if (
        q &&
        !project.title.toLowerCase().includes(q) &&
        !(project.description?.toLowerCase() || "").includes(q) &&
        !(project.skills_required || []).some((s) => s.toLowerCase().includes(q))
      )
        return false;

      const { status, location, teamSize, skills } = projectFilters;
      if (status.length > 0 && !status.includes(project.status as ProjectStatus)) return false;
      if (location.length > 0 && !location.includes(project.location || "Remote")) return false;
      if (skills.length > 0 && !skills.every((s) => project.skills_required.includes(s)))
        return false;

      const size = project.max_team_size;
      if (teamSize === "solo" && size !== 1) return false;
      if (teamSize === "small" && (size < 2 || size > 4)) return false;
      if (teamSize === "medium" && (size < 5 || size > 9)) return false;
      if (teamSize === "large" && size < 10) return false;

      return true;
    });

    switch (projectSort) {
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "deadline":
        result.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
        break;
      case "size":
        result.sort((a, b) => b.max_team_size - a.max_team_size);
        break;
      default: // newest
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [projects, activeCategory, searchQuery, projectFilters, projectSort]);

  // ── Filtered + sorted profiles ───────────────────────────────────────────
  const filteredProfiles = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const result = (profiles || []).filter((u) => {
      if (
        q &&
        !(u.name || "").toLowerCase().includes(q) &&
        !(u.username || "").toLowerCase().includes(q) &&
        !(u.profile_title || "").toLowerCase().includes(q) &&
        !(u.bio || "").toLowerCase().includes(q)
      )
        return false;

      const { skills, location, role } = profileFilters;
      if (
        skills.length > 0 &&
        !skills.every((s) =>
          (u.skills || []).some((us) => us.replace(/^#+/, "").trim().toLowerCase() === s.toLowerCase()),
        )
      )
        return false;
      if (location.length > 0 && !location.includes(u.location || ""))
        return false;
      if (
        role &&
        !(u.role || "").toLowerCase().includes(role.toLowerCase()) &&
        !(u.profile_title || "").toLowerCase().includes(role.toLowerCase())
      )
        return false;

      return true;
    });

    switch (profileSort) {
      case "az":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "za":
        result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
    }

    return result;
  }, [profiles, searchQuery, profileFilters, profileSort]);

  const resultCount = activeTab === "projects" ? filteredProjects.length : filteredProfiles.length;
  const currentSortLabel =
    activeTab === "projects"
      ? PROJECT_SORT_OPTIONS.find((o) => o.key === projectSort)?.label
      : PROFILE_SORT_OPTIONS.find((o) => o.key === profileSort)?.label;

  return (
    <div className="w-full">
      {/* Header */}
      <section className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Explore {activeTab === "projects" ? "Projects" : "Profiles"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-md max-w-2xl leading-relaxed">
            {activeTab === "projects"
              ? "Join projects that push the boundaries of what's possible."
              : "Connect with talented individuals and build your dream team."}
          </p>
        </div>
        <TopNav />
      </section>

      {/* Sticky toolbar */}
      <section className="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl py-4 mb-10 -mx-2 px-2">
        <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
          {/* Tab switcher */}
          <div className="flex p-1.5 bg-slate-100 dark:bg-zinc-900 rounded-[20px] w-full xl:w-[320px] shrink-0">
            {(["projects", "profiles"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-[14px] text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            {/* Search */}
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Search size={22} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder={
                  activeTab === "projects"
                    ? "Search by title, skill, or tech stack..."
                    : "Search by name, role, or bio..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all shadow-sm"
              />
            </div>

            {/* Filter + Sort buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Filter */}
              <button
                onClick={() => setFilterOpen(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white font-extrabold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm relative"
              >
                <Settings2 size={20} />
                <span className="md:hidden lg:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-black shadow-md shadow-indigo-200 dark:shadow-indigo-900/50">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort (with dropdown) */}
              <div className="relative flex-1 md:flex-none">
                <button
                  ref={sortButtonRef}
                  onClick={() => setSortOpen((v) => !v)}
                  className={`w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl border font-extrabold transition-all shadow-sm ${
                    sortOpen
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : (activeTab === "projects" ? projectSort !== "newest" : profileSort !== "newest")
                        ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400"
                        : "bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <ArrowUpDown size={18} />
                  <span className="md:hidden lg:inline text-xs truncate max-w-[90px]">
                    {(activeTab === "projects" ? projectSort !== "newest" : profileSort !== "newest")
                      ? currentSortLabel
                      : "Sort"}
                  </span>
                </button>

                {/* Sort dropdown */}
                {sortOpen && (
                  <div
                    ref={sortDropdownRef}
                    className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-zinc-950/80 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-4 py-3 border-b border-slate-50 dark:border-zinc-800">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                        Sort by
                      </p>
                    </div>
                    <div className="py-2">
                      {(activeTab === "projects"
                        ? PROJECT_SORT_OPTIONS
                        : PROFILE_SORT_OPTIONS
                      ).map(({ key, label }) => {
                        const active =
                          activeTab === "projects"
                            ? projectSort === key
                            : profileSort === (key as ProfileSort);
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              if (activeTab === "projects") setProjectSort(key as ProjectSort);
                              else setProfileSort(key as ProfileSort);
                              setSortOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold transition-colors ${
                              active
                                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                                : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                            }`}
                          >
                            {label}
                            {active && <Check size={14} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category pills — derived from real data, shows live counts */}
        {activeTab === "projects" && (
          <div className="mt-8 flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-hide animate-in fade-in slide-in-from-top-2 duration-500">
            {(["All", ...derivedCategories] as string[]).map((category) => {
              const count = categoryCounts[category] ?? 0;
              const isEmpty = count === 0 && category !== "All";
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => !isEmpty && setActiveCategory(category)}
                  disabled={isEmpty}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.03]"
                      : isEmpty
                        ? "bg-white dark:bg-zinc-900 text-slate-300 dark:text-zinc-700 border border-slate-100 dark:border-zinc-800 cursor-not-allowed opacity-50"
                        : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-800"
                  }`}
                >
                  {category}
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-md min-w-[18px] text-center leading-none ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isEmpty
                          ? "bg-slate-100 dark:bg-zinc-800 text-slate-300 dark:text-zinc-600"
                          : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Results header */}
      {!isLoading && !error && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {resultCount} {activeTab === "projects" ? "project" : "profile"}{resultCount !== 1 ? "s" : ""}
            {activeFilterCount > 0 && " (filtered)"}
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                if (activeTab === "projects") setProjectFilters({ ...DEFAULT_PROJECT_FILTERS });
                else setProfileFilters({ ...DEFAULT_PROFILE_FILTERS });
              }}
              className="text-xs font-black text-rose-400 hover:text-rose-500 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="animate-spin text-indigo-600 mb-6" size={56} />
          <p className="text-slate-500 font-bold tracking-tight">Discovering {activeTab}...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-extrabold text-rose-500 mb-2">
            Error loading {activeTab}
          </h2>
          <p className="text-slate-500 font-bold">Something went wrong. Please try again later.</p>
        </div>
      ) : activeTab === "projects" ? (
        filteredProjects.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>
        ) : (
          <EmptyState type="projects" hasFilters={activeFilterCount > 0 || !!searchQuery} />
        )
      ) : filteredProfiles.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {filteredProfiles.map((user) => (
            <ProfileCard key={user.id} user={user} />
          ))}
        </section>
      ) : (
        <EmptyState type="profiles" hasFilters={activeFilterCount > 0 || !!searchQuery} />
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        activeTab={activeTab}
        projectFilters={projectFilters}
        profileFilters={profileFilters}
        onProjectFiltersChange={setProjectFilters}
        onProfileFiltersChange={setProfileFilters}
        availableProjectSkills={availableProjectSkills}
        availableProfileSkills={availableProfileSkills}
        availableProjectLocations={availableProjectLocations}
        availableProfileLocations={availableProfileLocations}
        availableProfileRoles={availableProfileRoles}
        resultCount={resultCount}
        isLoadingProfiles={profilesLoading}
      />
    </div>
  );
};

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyState = ({ type, hasFilters }: { type: string; hasFilters: boolean }) => (
  <div className="flex flex-col items-center justify-center py-32 text-center">
    <div className="w-24 h-24 bg-slate-50 dark:bg-zinc-900/50 rounded-[40px] flex items-center justify-center text-slate-200 dark:text-zinc-800 mb-8 border border-slate-100 dark:border-zinc-800/50 shadow-inner">
      <SearchIcon size={48} />
    </div>
    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
      No {type} found
    </h2>
    <p className="text-slate-500 dark:text-slate-400 font-bold max-w-sm mx-auto leading-relaxed">
      {hasFilters
        ? `No ${type} match your current filters or search. Try adjusting them.`
        : `We couldn't find any ${type} yet. Check back soon!`}
    </p>
  </div>
);

export default ExplorePage;
