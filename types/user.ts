export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  username: string | null;
  bio: string | null;
  skills: string[];
  created_at: string;
}

export interface AuthUser extends User {
  password_hash?: string;
}
