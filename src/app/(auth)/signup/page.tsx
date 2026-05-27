import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign up | Projfolio",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Start saving proof while you build"
      description="Create a workspace for the updates, screenshots, fixes, and lessons that make your projects believable."
      eyebrow="First loop"
      footerCopy="Already have an account?"
      footerHref="/login"
      footerLabel="Log in"
    >
      <SignupForm />
    </AuthShell>
  );
}
