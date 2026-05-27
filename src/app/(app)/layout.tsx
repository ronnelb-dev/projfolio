import { AppShell } from "@/components/app/app-shell";
import { requireUser } from "@/lib/auth/session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await requireUser("/dashboard");

  return (
    <AppShell email={user.email ?? "No email on file"} profile={profile}>
      {children}
    </AppShell>
  );
}
