"use client";

import {
  ArrowRight,
  Bell,
  History,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import DashboardSkeleton from "./components/DashboardSkeleton";
import StatsCards from "./components/StatsCards";
import { ThemeToggle } from "@/components/ThemeToggle";
import WorkspaceListCard from "./components/WorkspaceListCard";
import Profile from "@/components/Profile";
import { useUser } from "@/hooks";

const DashboardPage = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return <DashboardSkeleton />;
  if (!user) return <div className="p-10 flex flex-col items-center justify-center min-h-[50vh] text-center">
    <h2 className="text-2xl font-bold mb-2">Not logged in</h2>
    <p className="text-slate-500 mb-6 font-medium">Please log in to view the dashboard.</p>
    <Link href="/login" className="px-6 py-3 bg-blue-primary text-white rounded-xl font-bold">Log in now</Link>
  </div>;

  return (
    <div className="w-full py-4">
      {/*Header*/}
      <section className="flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex flex-col justify-center items-start gap-2">
          <h1 className="text-3xl font-extrabold">
            How&apos;s it going, {user?.name?.split(" ")[0] || 'there'}? 👋
          </h1>
          <p className="text-md text-slate-400 font-bold">
            You have 2 projects reaching milestones this week.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/notifications"
            className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Bell className="text-slate-500 hover:text-blue-primary transition-colors" />
            <span className="absolute top-0 right-0 text-xs text-white bg-notification rounded-full px-2 py-1 ">
              2
            </span>
          </Link>
          <Link
            href="/dashboard/messages"
            className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <MessageCircle className="text-slate-500 hover:text-blue-primary transition-colors" />
            <span className="absolute top-0 right-0 text-xs text-white bg-notification rounded-full px-2 py-1 ">
              2
            </span>
          </Link>
          <ThemeToggle />
          <Profile />

          {/* <Link
            href="/dashboard/projects"
            className="flex items-center gap-2 px-6 py-4 text-sm rounded-xl bg-blue-primary text-white font-medium"
          >
            <span>Find a New Project</span>
          </Link> */}
          
        </div>
      </section>
      {/*Stats Cards*/}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 justify-start items-center gap-4 py-10 flex-wrap">
        <StatsCards
          icon={<TrendingUp size={22} />}
          iconsize="text-5xl"
          title="Active Projects"
          stats="02"
        />
        <StatsCards
          icon={<History size={22} />}
          iconsize="text-5xl"
          title="Applications"
          stats="2"
        />
        <StatsCards
          icon={<Trophy size={22} />}
          iconsize="text-5xl"
          title="Shipped"
          stats="12"
        />
        <StatsCards
          icon={<Sparkles size={22} />}
          iconsize="text-5xl"
          title="XP Points"
          stats="4.2k"
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
          <WorkspaceListCard
            id="p1"
            title="SolarOS Dashboard"
            description="A modern and responsive dashboard for SolarOS, a solar energy management system."
            tags={["React", "Next.js", "Tailwind CSS", "TypeScript"]}
            status="In Progress"
            progress="75%"
            profiles={["Profile 1", "Profile 2", "Profile 3"]}
          />
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
