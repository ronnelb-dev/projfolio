import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const AUTH_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

export type AuthProfile = Awaited<ReturnType<typeof ensureUserProfile>>;

export function isSupabaseConfigured() {
  return AUTH_ENV_KEYS.every((key) => Boolean(process.env[key]));
}

export function getAuthConfigError() {
  return "Supabase auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.";
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return { user: null, error: new Error(getAuthConfigError()) };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
}

export async function requireUser(nextPath = "/dashboard") {
  const { user, error } = await getCurrentUser();

  if (error && !user) {
    throw new Error(error.message || getAuthConfigError());
  }

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  const profile = await ensureUserProfile(user);

  return { user, profile };
}

export async function ensureUserProfile(user: User) {
  const existing = await prisma.userProfile.findUnique({
    where: { authUserId: user.id },
  });

  if (existing) {
    return existing;
  }

  const displayName = getDisplayName(user);
  const usernameBase = toUsername(
    getMetadataString(user, "username") || getEmailPrefix(user.email) || displayName,
  );
  const username = await getAvailableUsername(usernameBase, user.id);

  return prisma.userProfile.create({
    data: {
      authUserId: user.id,
      username,
      displayName,
      avatarUrl: getMetadataString(user, "avatar_url"),
      websiteUrl: getMetadataString(user, "website_url"),
      githubUrl: getMetadataString(user, "github_url"),
      linkedinUrl: getMetadataString(user, "linkedin_url"),
    },
  });
}

function getDisplayName(user: User) {
  return (
    getMetadataString(user, "displayName") ||
    getMetadataString(user, "display_name") ||
    getMetadataString(user, "full_name") ||
    getMetadataString(user, "name") ||
    getEmailPrefix(user.email) ||
    "Developer"
  );
}

function getMetadataString(user: User, key: string) {
  const value = user.user_metadata?.[key];

  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function getEmailPrefix(email: string | undefined) {
  return email?.split("@")[0]?.trim();
}

function toUsername(value: string) {
  const username = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

  return username || "developer";
}

async function getAvailableUsername(base: string, authUserId: string) {
  const existing = await prisma.userProfile.findUnique({
    where: { username: base },
    select: { authUserId: true },
  });

  if (!existing || existing.authUserId === authUserId) {
    return base;
  }

  return `${base}-${authUserId.slice(0, 8).toLowerCase()}`;
}
