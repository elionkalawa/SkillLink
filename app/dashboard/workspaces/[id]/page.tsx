"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  MessageSquare,
  Plus,
  ExternalLink,
  Github,
  Globe,
  Loader2,
  ChevronLeft,
  Save,
  X,
  Pencil,
  Archive,
  Link2,
} from "lucide-react";
import { useUpdateWorkspace, useWorkspace } from "@/hooks/useWorkspaces";
import { useUser } from "@/hooks/useUser";
import { WorkspaceLink, WorkspaceMember } from "@/types";
import TopNav from "../../components/TopNav";
import { toast } from "sonner";

interface WorkspaceFormState {
  name: string;
  description: string;
  avatar_url: string;
  cover_url: string;
  status: "active" | "archived";
  settingsText: string;
  pinned_links: WorkspaceLink[];
}

const createLink = (): WorkspaceLink => ({
  id: crypto.randomUUID(),
  label: "",
  url: "",
  category: "other",
});

export default function WorkspaceHub() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { data: workspace, isLoading } = useWorkspace(id);
  const { mutateAsync: updateWorkspace, isPending: isSaving } = useUpdateWorkspace();
  const [activeTab, setActiveTab] = useState<"overview" | "chat">("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<WorkspaceFormState | null>(null);

  const isOwner = useMemo(() => {
    if (!workspace || !user) return false;
    return workspace.project?.owner_id === user.id;
  }, [workspace, user]);

  const startEditing = () => {
    if (!workspace) return;
    setForm({
      name: workspace.name,
      description: workspace.description || "",
      avatar_url: workspace.avatar_url || "",
      cover_url: workspace.cover_url || "",
      status: workspace.status,
      settingsText: JSON.stringify(workspace.settings || {}, null, 2),
      pinned_links: workspace.pinned_links || [],
    });
    setIsEditing(true);
  };

  const closeEditor = () => {
    setIsEditing(false);
    setForm(null);
  };

  const handleSave = async () => {
    if (!workspace || !form) return;
    try {
      let parsedSettings: Record<string, unknown> = {};
      if (form.settingsText.trim()) {
        const parsed = JSON.parse(form.settingsText);
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
          throw new Error("Settings must be a JSON object");
        }
        parsedSettings = parsed as Record<string, unknown>;
      }

      const cleanedLinks = form.pinned_links.filter(
        (link) => link.label.trim() && link.url.trim(),
      );

      await updateWorkspace({
        id: workspace.id,
        input: {
          name: form.name.trim(),
          description: form.description.trim() || null,
          avatar_url: form.avatar_url.trim() || null,
          cover_url: form.cover_url.trim() || null,
          status: form.status,
          settings: parsedSettings,
          pinned_links: cleanedLinks,
        },
      });

      toast.success("Workspace updated");
      closeEditor();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update workspace";
      toast.error(message);
    }
  };

  const updateLink = (linkId: string, key: keyof WorkspaceLink, value: string) => {
    if (!form) return;
    setForm({
      ...form,
      pinned_links: form.pinned_links.map((link) =>
        link.id === linkId ? { ...link, [key]: value } : link,
      ),
    });
  };

  const addLink = () => {
    if (!form) return;
    setForm({
      ...form,
      pinned_links: [...form.pinned_links, createLink()],
    });
  };

  const removeLink = (linkId: string) => {
    if (!form) return;
    setForm({
      ...form,
      pinned_links: form.pinned_links.filter((link) => link.id !== linkId),
    });
  };

  if (isLoading || userLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-primary" size={48} />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center space-y-4">
        <h2 className="text-2xl font-black">Workspace not found</h2>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-slate-100 rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const coverUrl = workspace.cover_url || "";
  const avatarUrl = workspace.avatar_url || "";
  const pinnedLinks = workspace.pinned_links || [];
  const members = workspace.members || [];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-black p-3 md:p-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm hover:scale-105 transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <TopNav />
        </div>

        <div className="relative overflow-hidden rounded-[28px] md:rounded-[40px] bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xl h-72 md:h-80">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt="Workspace cover"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-900 dark:bg-zinc-800" />
          )}
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-10 text-white">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white text-slate-900 flex items-center justify-center text-3xl md:text-4xl font-black shadow-2xl shrink-0">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt="Workspace avatar"
                      className="h-full w-full object-cover rounded-2xl"
                    />
                  ) : (
                    workspace.name.charAt(0)
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl md:text-5xl font-black tracking-tight truncate">
                    {workspace.name}
                  </h1>
                  <p className="text-white/85 font-semibold max-w-xl line-clamp-2 text-sm md:text-base">
                    {workspace.description || "Building something great together."}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {isOwner && (
                  <button
                    onClick={startEditing}
                    className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md font-black text-xs md:text-sm transition-all border border-white/20 flex items-center gap-2"
                  >
                    <Pencil size={16} />
                    Edit Workspace
                  </button>
                )}
                <button className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs md:text-sm hover:bg-slate-100 transition-all shadow-xl">
                  Message Team
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 pb-16">
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <div className="bg-white dark:bg-zinc-900/50 rounded-[24px] md:rounded-[32px] p-5 md:p-7 border border-slate-100 dark:border-zinc-800/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black">Resources</h3>
              </div>
              <div className="space-y-4">
                {pinnedLinks.length > 0 ? (
                  pinnedLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500">
                          {link.category === "code" ? <Github size={20} /> : <Globe size={20} />}
                        </div>
                        <span className="font-bold text-slate-700 dark:text-zinc-300 truncate">
                          {link.label}
                        </span>
                      </div>
                      <ExternalLink size={16} className="text-slate-300 group-hover:text-slate-500 shrink-0" />
                    </a>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-slate-400 font-medium text-sm">No resources pinned yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/50 rounded-[24px] md:rounded-[32px] p-5 md:p-7 border border-slate-100 dark:border-zinc-800/80 shadow-sm">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <Users size={20} className="text-slate-500" /> Team
              </h3>
              <div className="space-y-4">
                {members.length > 0 ? (
                  members.map((member: WorkspaceMember) => (
                    <div key={member.user_id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-zinc-800 overflow-hidden flex items-center justify-center text-xs font-black text-slate-600 dark:text-zinc-300">
                        {member.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-800 dark:text-zinc-200 truncate">{member.name}</p>
                        <p className="text-[11px] font-bold text-slate-400 truncate">
                          {member.role || member.membership_role}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-bold text-slate-400 text-center pt-2">No approved members yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900/50 rounded-[24px] md:rounded-[32px] border border-slate-100 dark:border-zinc-800/80 shadow-sm flex flex-col min-h-[420px] md:min-h-[500px] overflow-hidden">
              <div className="flex border-b border-slate-100 dark:border-zinc-800">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 py-4 md:py-6 text-sm font-black transition-all ${activeTab === "overview" ? "text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`flex-1 py-4 md:py-6 text-sm font-black transition-all ${activeTab === "chat" ? "text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Team Chat
                </button>
              </div>

              <div className="p-5 md:p-8 flex-1">
                {activeTab === "overview" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h4 className="text-2xl font-black mb-3">Workspace Overview</h4>
                      <p className="text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">
                        Manage your team collaboration space, project links, and workspace details from this hub.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                        <h5 className="font-black text-slate-600 dark:text-zinc-300 mb-1 uppercase text-[10px] tracking-widest">Workspace</h5>
                        <p className="text-base font-black text-slate-900 dark:text-white truncate">{workspace.name}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                        <h5 className="font-black text-slate-600 dark:text-zinc-300 mb-1 uppercase text-[10px] tracking-widest flex items-center gap-2">
                          <Archive size={14} /> Status
                        </h5>
                        <p className="text-base font-black text-slate-900 dark:text-white capitalize">{workspace.status}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "chat" && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                      <MessageSquare className="text-slate-400" size={32} />
                    </div>
                    <h4 className="text-lg font-black italic">Team chat initialization...</h4>
                    <p className="text-sm font-medium text-slate-400 max-w-xs">Connecting to the secure messaging server.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOwner && isEditing && form && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeEditor} />
          <div className="absolute inset-x-3 top-3 bottom-3 md:inset-x-auto md:left-1/2 md:top-8 md:bottom-8 md:w-[760px] md:-translate-x-1/2 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="text-lg md:text-xl font-black">Edit Workspace</h3>
              <button
                onClick={closeEditor}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-500 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Workspace name"
                  className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium"
                />
                <select
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value as "active" | "archived" })}
                  className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium"
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
                <input
                  value={form.avatar_url}
                  onChange={(event) => setForm({ ...form, avatar_url: event.target.value })}
                  placeholder="Avatar image URL"
                  className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium md:col-span-2"
                />
                <input
                  value={form.cover_url}
                  onChange={(event) => setForm({ ...form, cover_url: event.target.value })}
                  placeholder="Cover image URL"
                  className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium md:col-span-2"
                />
                <textarea
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Workspace description"
                  rows={4}
                  className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium md:col-span-2"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black flex items-center gap-2"><Link2 size={16} /> Pinned Links</h4>
                  <button
                    onClick={addLink}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 text-xs font-black flex items-center gap-2"
                  >
                    <Plus size={14} />
                    Add Link
                  </button>
                </div>
                <div className="space-y-3">
                  {form.pinned_links.map((link) => (
                    <div key={link.id} className="p-3 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
                      <input
                        value={link.label}
                        onChange={(event) => updateLink(link.id, "label", event.target.value)}
                        placeholder="Label"
                        className="w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
                      />
                      <input
                        value={link.url}
                        onChange={(event) => updateLink(link.id, "url", event.target.value)}
                        placeholder="URL"
                        className="w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <select
                          value={link.category || "other"}
                          onChange={(event) => updateLink(link.id, "category", event.target.value)}
                          className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
                        >
                          <option value="code">Code</option>
                          <option value="design">Design</option>
                          <option value="docs">Docs</option>
                          <option value="other">Other</option>
                        </select>
                        <button
                          onClick={() => removeLink(link.id)}
                          className="text-xs font-black text-rose-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-black">Settings (JSON object)</h4>
                <textarea
                  value={form.settingsText}
                  onChange={(event) => setForm({ ...form, settingsText: event.target.value })}
                  rows={8}
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-xs md:text-sm font-mono"
                />
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-slate-100 dark:border-zinc-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                onClick={closeEditor}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 font-black text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
