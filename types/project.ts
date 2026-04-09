export type ProjectStatus = 'open' | 'in-progress' | 'completed';
export type ProjectCategory = 'Web3' | 'Sustainability' | 'Productivity' | 'Health' | 'Finance' | 'AI/ML' | 'Education' | 'Gaming';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  owner_id: string;
  organization?: string;
  category: ProjectCategory;
  skills_required: string[];
  tags: string[];
  max_team_size: number;
  current_members_count: number;
  status: ProjectStatus;
  created_at: string;
  deadline?: string;
  image_url?: string;
  full_description?: string;
  workspaces?: { id: string }[];
  host_name?: string;
  host_image?: string;
  host_verified?: boolean;
}

export interface ProjectRole {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  skills_required: string[];
  vacancies: number;
  is_open: boolean;
  created_at: string;
}

export interface ProjectTeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  is_hiring?: boolean;
}

export interface ProjectDetail extends Project {
  full_description?: string;
  roles?: ProjectRole[];
  team: ProjectTeamMember[];
}

export type MemberRole = 'owner' | 'member' | 'guest';
export type MemberStatus = 'pending' | 'approved' | 'rejected';

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  project_role_id?: string;
  role: MemberRole;
  status: MemberStatus;
  joined_at: string;
}
