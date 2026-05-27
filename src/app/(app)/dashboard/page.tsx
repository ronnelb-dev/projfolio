import Link from "next/link";
import { ArrowRight, Clock3, ImageIcon, NotebookText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const evidenceTypes = [
  {
    icon: NotebookText,
    label: "Progress updates",
    copy: "Capture what changed and why it matters.",
  },
  {
    icon: ImageIcon,
    label: "Screenshots",
    copy: "Attach visual proof once uploads arrive.",
  },
  {
    icon: Clock3,
    label: "Recent evidence",
    copy: "Your newest proof will appear here after Day 4.",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit">
            Day 3 auth shell
          </Badge>
          <div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
              Your proof of work starts here
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              This protected dashboard is ready for the first project loop. Project
              creation, screenshots, and publishing begin after the auth foundation.
            </p>
          </div>
        </div>
        <Button asChild variant="secondary">
          <Link href="/projects/new">
            <Plus className="size-4" aria-hidden="true" />
            New project preview
          </Link>
        </Button>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>No projects yet</CardTitle>
            <CardDescription>
              Day 4 will add project creation. For now, auth and protected navigation
              are the complete loop.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg border border-dashed border-border bg-secondary/45 p-6">
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                When the first project exists, this area will show its status, latest
                update, publish state, and the next evidence action.
              </p>
            </div>
            <Button asChild>
              <Link href="/settings/profile">
                Review profile entry point
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Recent evidence</CardTitle>
            <CardDescription>
              Placeholder states should show shape before data arrives.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {evidenceTypes.map((item) => (
              <div className="flex gap-3" key={item.label}>
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                  <item.icon className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{item.copy}</p>
                </div>
              </div>
            ))}
            <Separator />
            <p className="text-sm leading-6 text-muted-foreground">
              The shell is intentionally quiet: the next build should add one
              complete project creation path instead of filling the dashboard with
              mock data.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
