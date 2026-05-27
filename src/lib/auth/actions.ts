"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  ensureUserProfile,
  getAuthConfigError,
  isSupabaseConfigured,
} from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
    displayName?: string[];
  };
};

const emailSchema = z.string().trim().email("Enter a valid email address.");
const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters for your password.");

const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z
    .string()
    .trim()
    .min(2, "Enter the name you want shown in Projfolio.")
    .max(80, "Keep your display name under 80 characters."),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
  next: z.string().optional(),
});

export async function signUp(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!isSupabaseConfigured()) {
    return { status: "error", message: getAuthConfigError() };
  }

  const supabase = await createClient();
  const { email, password, displayName } = parsed.data;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      message: "We could not create that account. Check the details and try again.",
    };
  }

  if (data.session && data.user) {
    await ensureUserProfile(data.user);
    redirect("/dashboard");
  }

  return {
    status: "success",
    message: "Check your email to confirm your account, then log in to Projfolio.",
  };
}

export async function login(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!isSupabaseConfigured()) {
    return { status: "error", message: getAuthConfigError() };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return {
      status: "error",
      message: "Email or password is incorrect.",
    };
  }

  await ensureUserProfile(data.user);
  redirect(getSafeNextPath(parsed.data.next));
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/login");
}

function getSafeNextPath(nextPath: string | undefined) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard";
  }

  if (
    nextPath.startsWith("/dashboard") ||
    nextPath.startsWith("/projects") ||
    nextPath.startsWith("/settings")
  ) {
    return nextPath;
  }

  return "/dashboard";
}
