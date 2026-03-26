export type ProjectStatus = 'open' | 'in-progress' | 'completed';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  owner_id: string;
  skills_required: string[];
  max_team_size: number;
  status: ProjectStatus;
  created_at: string;
}

export type MemberRole = 'owner' | 'member' | 'guest';
export type MemberStatus = 'pending' | 'approved' | 'rejected';

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: MemberRole;
  status: MemberStatus;
  joined_at: string;
}
