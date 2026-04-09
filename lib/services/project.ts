import { Project, ProjectCategory } from "@/types";

export interface CreateProjectInput {
  title: string;
  description: string;
  category: ProjectCategory;
  skills_required: string[];
  max_team_size: number;
  tags?: string[];
  organization?: string;
  deadline?: string;
  roles?: {
    title: string;
    description?: string;
    vacancies: number;
    skills_required?: string[];
  }[];
}

export const projectService = {
  async getProjects() {
    const res = await fetch("/api/projects");
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch projects");
    }
    return res.json() as Promise<Project[]>;
  },

  async getUserProjects(userId: string) {
    const res = await fetch(`/api/projects/user/${userId}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch user projects");
    }
    return res.json() as Promise<Project[]>;
  },

  async createProject(input: CreateProjectInput) {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create project");
    }
    return res.json() as Promise<Project>;
  },

  async getProjectById(projectId: string) {
    const res = await fetch(`/api/projects/${projectId}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch project");
    }
    return res.json() as Promise<Project>;
  },

  async updateProject(projectId: string, input: Partial<CreateProjectInput>) {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update project");
    }
    return res.json() as Promise<Project>;
  },

  async deleteProject(projectId: string) {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete project");
    }
  }
};
