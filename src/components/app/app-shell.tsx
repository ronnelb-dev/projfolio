import Link from "next/link";
import { FolderKanban, LayoutDashboard, LogOut, Settings } from "lucide-react";

import type { AuthProfile } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type AppShellProps = {
  children: React.ReactNode;
  email: string;
  profile: AuthProfile;
};

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/projects/new",
    label: "New project",
    icon: FolderKanban,
  },
  {
    href: "/settings/profile",
    label: "Profile",
    icon: Settings,
  },
];

export function AppShell({ children, email, profile }: AppShellProps) {
  const initials = profile.displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="grid min-h-svh lg:grid-cols-[16rem_1fr]">
        <aside className="hidden border-r border-border bg-sidebar lg:flex lg:flex-col">
          <div className="p-5">
            <Link href="/dashboard" className="text-base font-semibold text-primary">
              Projfolio
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">Evidence Workbench</p>
          </div>
          <Separator />
          <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
            {navItems.map((item) => (
              <Button
                asChild
                variant="ghost"
                className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                key={item.href}
              >
                <Link href={item.href}>
                  <item.icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-semibold text-accent-foreground">
                {initials || "PF"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{profile.displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
            <form action={logout} className="mt-4">
              <Button type="submit" variant="outline" className="w-full justify-start">
                <LogOut className="size-4" aria-hidden="true" />
                Log out
              </Button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-10 border-b border-border bg-background px-4 py-3 md:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary lg:hidden">Projfolio</p>
                <p className="truncate text-sm text-muted-foreground">
                  Signed in as @{profile.username}
                </p>
              </div>
              <form action={logout} className="lg:hidden">
                <Button type="submit" variant="outline" size="sm">
                  <LogOut className="size-4" aria-hidden="true" />
                  Log out
                </Button>
              </form>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
