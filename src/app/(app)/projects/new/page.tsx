import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FolderPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "New project | Projfolio",
};

export default function NewProjectPlaceholderPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>
      </Button>

      <Card className="border-border bg-card">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            Day 4
          </Badge>
          <CardTitle className="text-2xl">Project creation is next</CardTitle>
          <CardDescription>
            This protected placeholder confirms `/projects/*` routes share the app
            shell and require a valid session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex gap-3 rounded-lg border border-border bg-secondary/45 p-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
              <FolderPlus className="size-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium">No project form yet</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Day 4 should add the smallest complete create flow: title, slug,
                summary, status, visibility, and redirect to project detail.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
