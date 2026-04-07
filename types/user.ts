export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  username: string | null;
  bio: string | null;
  skills: string[];
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  location?: string;
  years_of_experience?: number;
  experience_level?: "beginner" | "intermediate" | "advanced" | "expert" | string;
  profile_title?: string;
  role?: string;
  created_at: string;
}

export interface AuthUser extends User {
  password_hash?: string;
}
