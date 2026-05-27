import type { Metadata } from "next";
import { AtSign, ExternalLink, FolderGit2, Globe, UserRound } from "lucide-react";

import { requireUser } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Profile settings | Projfolio",
};

const profileFields = [
  { key: "username", label: "Username", icon: AtSign },
  { key: "displayName", label: "Display name", icon: UserRound },
  { key: "websiteUrl", label: "Website", icon: Globe },
  { key: "githubUrl", label: "GitHub", icon: FolderGit2 },
  { key: "linkedinUrl", label: "LinkedIn", icon: ExternalLink },
] as const;

export default async function ProfileSettingsPage() {
  const { user, profile } = await requireUser("/settings/profile");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="space-y-3">
        <Badge variant="secondary" className="w-fit">
          Settings entry point
        </Badge>
        <div>
          <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
            Profile settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Profile editing arrives after the protected app shell. Day 3 only
            confirms the account, profile record, and navigation path are in place.
          </p>
        </div>
      </header>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Current profile</CardTitle>
          <CardDescription>
            Created or loaded from your Supabase session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-secondary/45 p-4">
            <p className="text-sm font-medium">Email</p>
            <p className="mt-1 break-words text-sm text-muted-foreground">
              {user.email ?? "No email on file"}
            </p>
          </div>
          <Separator />
          <div className="grid gap-3 sm:grid-cols-2">
            {profileFields.map((field) => {
              const value = profile[field.key];
              return (
                <div
                  className="rounded-lg border border-border bg-background p-4"
                  key={field.key}
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <field.icon className="size-4 text-primary" aria-hidden="true" />
                    {field.label}
                  </div>
                  <p className="mt-2 break-words text-sm text-muted-foreground">
                    {value || "Not set yet"}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
