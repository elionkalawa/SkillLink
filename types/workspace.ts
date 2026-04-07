export interface Workspace {
  id: string;
  project_id: string;
  chat_id: string | null;
  name: string;
  description: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  settings: Record<string, unknown>;
  pinned_links: WorkspaceLink[];
  status: 'active' | 'archived';
  created_at: string;
  project?: {
    id: string;
    title: string;
    owner_id: string;
  };
  members?: WorkspaceMember[];
}

export interface WorkspaceLink {
  id: string;
  label: string;
  url: string;
  category?: 'code' | 'design' | 'docs' | 'other';
}

export interface WorkspaceMember {
  user_id: string;
  membership_role: string;
  membership_status: string;
  name: string;
  image: string | null;
  username: string | null;
  role: string | null;
}
