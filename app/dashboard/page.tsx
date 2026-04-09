"use client";

import {
  ArrowRight,
  History,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import StatsCards from "./components/StatsCards";
import WorkspaceListCard from "./components/WorkspaceListCard";
import TopNav from "./components/TopNav";
import { useUser, useUserProjects, useProjects, useDashboardStats } from "@/hooks";
import { Project, Workspace } from "@/types";
import DashboardSkeleton from "./components/DashboardSkeleton";
import { useWorkspaces } from "@/hooks/useWorkspaces";

const DashboardPage = () => {
  const { user, isLoading } = useUser();
  const { data: userProjects } = useUserProjects();
  const { data: allProjects } = useProjects();
  const { data: stats } = useDashboardStats();
  const { data: workspaces } = useWorkspaces();

  if (isLoading) return <DashboardSkeleton />;

  if (!user)
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold mb-2">Not logged in</h2>
        <p className="text-slate-500 mb-6 font-medium">
          Please log in to view the dashboard.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-primary text-white rounded-xl font-bold"
        >
          Log in now
        </Link>
      </div>
    );

  const activeCount = userProjects?.length || 0;
  const matchesCount = allProjects?.filter((p: Project) => !userProjects?.some((up: Project) => up.id === p.id)).length || 0;

  return (
    <div className="w-full py-4">
      {/*Header*/}
      <section className="flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex flex-col justify-center items-start gap-2">
          <h1 className="text-3xl font-extrabold">
            How&apos;s it going, {user?.name?.split(" ")[0] || 'there'}? 👋
          </h1>
          <p className="text-md text-slate-400 font-bold">
            {activeCount > 0 
              ? `You have ${activeCount} active projects in your workspace.` 
              : "Ready to start something new today?"}
          </p>
        </div>
        <TopNav />
      </section>
      {/*Stats Cards*/}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 justify-start items-center gap-4 py-10 flex-wrap">
        <StatsCards
          icon={<TrendingUp size={22} />}
          iconsize="text-5xl"
          title="Active Projects"
          stats={activeCount.toString().padStart(2, '0')}
        />
        <StatsCards
          icon={<History size={22} />}
          iconsize="text-5xl"
          title="Applications"
          stats={(stats?.applications ?? 0).toString().padStart(2, "0")}
        />
        <StatsCards
          icon={<Trophy size={22} />}
          iconsize="text-5xl"
          title="Shipped"
          stats={(stats?.shipped ?? 0).toString().padStart(2, "0")}
        />
        <StatsCards
          icon={<Sparkles size={22} />}
          iconsize="text-5xl"
          title="Matches"
          stats={matchesCount.toString()}
        />
      </section>

      <section className="w-full">
        {/*Matches for you*/}
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start gap-2 w-full mb-4">
          <div className="flex flex-col justify-center items-start gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
              <Sparkles className="text-blue-primary" />
              Matches for you
            </h1>
            <p className="text-sm md:text-md text-slate-400 font-bold">
              Check out these projects that match your skills and interests.
            </p>
          </div>
          <Link
            href="/dashboard/explore"
            className="flex items-center justify-center w-full md:w-fit gap-2 px-6 py-4 text-sm rounded-xl bg-blue-primary text-white font-medium"
          >
            <span className="flex items-center gap-2">
              View All Projects <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      <section className="w-full">
        {/*Active Workspaces*/}
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start gap-2 w-full mb-4">
          <div className="flex flex-col justify-center items-start gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
              <TrendingUp className="text-blue-primary" />
              Active Workspaces
            </h1>
            <p className="text-sm md:text-md text-slate-400 font-bold">
              Currently in development
            </p>
          </div>

          <Link
            href="/dashboard/explore"
            className="flex items-center justify-center w-full md:w-fit gap-2 px-6 py-4 text-sm rounded-xl bg-blue-primary text-white font-medium"
          >
            <span className="flex items-center gap-2">
              View All Projects <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {(workspaces || []).slice(0, 3).map((ws: Workspace) => (
            <WorkspaceListCard
              key={ws.id}
              id={ws.id}
              image={ws.avatar_url || undefined}
              title={ws.name}
              description={ws.description || "No description yet."}
              status={(ws.status || "active").toString()}
              progress={0}
              profiles={(ws.members || []).map((m) => m.image || m.name)}
            />
          ))}
          {(workspaces || []).length === 0 && (
            <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 text-sm font-bold text-slate-500 dark:text-slate-400">
              No workspaces yet. Create a project to generate your first workspace.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
