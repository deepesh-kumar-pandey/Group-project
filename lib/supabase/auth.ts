import { createServerSupabaseClient } from "./server";
import { ApiError } from "@/lib/errors/api-error";
import { prisma } from "@/lib/prisma/client";
import type { UserRole } from "@prisma/client";

export async function getSessionUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return user;
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    throw ApiError.unauthorized("Authentication required");
  }
  return user;
}

export async function getOrCreateDbUser(supabaseUser: {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string; avatar_url?: string; role?: string };
}) {
  const email = supabaseUser.email;
  if (!email) {
    throw ApiError.badRequest("User email is required");
  }

  const role = (supabaseUser.user_metadata?.role?.toUpperCase() ??
    "CANDIDATE") as UserRole;

  return prisma.user.upsert({
    where: { supabaseId: supabaseUser.id },
    create: {
      supabaseId: supabaseUser.id,
      email,
      displayName: supabaseUser.user_metadata?.full_name,
      avatarUrl: supabaseUser.user_metadata?.avatar_url,
      role: ["EMPLOYEE", "CANDIDATE", "RECRUITER", "ADMIN"].includes(role)
        ? role
        : "CANDIDATE",
    },
    update: {
      email,
      displayName: supabaseUser.user_metadata?.full_name,
      avatarUrl: supabaseUser.user_metadata?.avatar_url,
    },
  });
}

export async function requireDbUser() {
  const supabaseUser = await requireAuth();
  return getOrCreateDbUser(supabaseUser);
}

export async function optionalDbUser() {
  const supabaseUser = await getSessionUser();
  if (!supabaseUser) return null;
  return getOrCreateDbUser(supabaseUser);
}
