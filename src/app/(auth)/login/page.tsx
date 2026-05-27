import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in | Projfolio",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      title="Log in to your evidence workspace"
      description="Return to the private place where progress notes, screenshots, bugs, and decisions become portfolio proof."
      eyebrow="Protected workspace"
      footerCopy="New to Projfolio?"
      footerHref="/signup"
      footerLabel="Create an account"
    >
      <LoginForm nextPath={params.next} />
    </AuthShell>
  );
}
