export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
  };
}

export interface AuthSession {
  user: SupabaseUser;
  accessToken: string;
}
