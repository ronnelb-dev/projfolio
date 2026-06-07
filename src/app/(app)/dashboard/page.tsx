import Link from "next/link";
import { ArrowRight, Camera, NotebookText, Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { ProjectList } from "@/components/projects/project-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RecentEvidenceItem = {
  id: string;
  type: "update" | "screenshot";
  label: string;
  title: string;
  projectId: string;
  projectTitle: string;
  date: Date;
};

export default async function DashboardPage() {
  const { profile } = await requireUser("/dashboard");
  const projects = await prisma.project.findMany({
    where: {
      ownerId: profile.id,
    },
    orderBy: [
      { archivedAt: "asc" },
      { updatedAt: "desc" },
    ],
  });
  const [recentUpdates, recentScreenshots] = await Promise.all([
    prisma.progressUpdate.findMany({
      where: {
        project: {
          ownerId: profile.id,
        },
      },
      orderBy: [
        {
          occurredAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 6,
      select: {
        id: true,
        title: true,
        occurredAt: true,
        projectId: true,
        project: {
          select: {
            title: true,
          },
        },
      },
    }),
    prisma.screenshot.findMany({
      where: {
        project: {
          ownerId: profile.id,
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      take: 6,
      select: {
        id: true,
        altText: true,
        createdAt: true,
        projectId: true,
        project: {
          select: {
            title: true,
          },
        },
      },
    }),
  ]);
  const recentEvidence: RecentEvidenceItem[] = [
    ...recentUpdates.map((update) => ({
      id: update.id,
      type: "update" as const,
      label: "Progress update",
      title: update.title,
      projectId: update.projectId,
      projectTitle: update.project.title,
      date: update.occurredAt,
    })),
    ...recentScreenshots.map((screenshot) => ({
      id: screenshot.id,
      type: "screenshot" as const,
      label: "Screenshot",
      title: screenshot.altText,
      projectId: screenshot.projectId,
      projectTitle: screenshot.project.title,
      date: screenshot.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit">
            Evidence workbench
          </Badge>
          <div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
              Projects
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage private projects, progress notes, and screenshots before
              turning the strongest proof into public pages.
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="size-4" aria-hidden="true" />
            New project
          </Link>
        </Button>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>{projects.length > 0 ? "Your projects" : "No projects yet"}</CardTitle>
            <CardDescription>
              {projects.length > 0
                ? "Open a project to add evidence, tune metadata, or prepare it for publishing."
                : "Create the first project record before adding progress notes and screenshots."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {projects.length > 0 ? (
              <ProjectList projects={projects} />
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-secondary/45 p-6">
                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  A project gives Projfolio one place to collect updates,
                  screenshots, features, bugs, changelog notes, and the eventual
                  case study.
                </p>
                <Button asChild className="mt-5">
                  <Link href="/projects/new">
                    <Plus className="size-4" aria-hidden="true" />
                    Create project
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Recent evidence</CardTitle>
            <CardDescription>
              Your newest updates and screenshots across every private project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEvidence.length > 0 ? (
              <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-background">
                {recentEvidence.map((item) => (
                  <RecentEvidenceRow item={item} key={`${item.type}-${item.id}`} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-secondary/45 p-5">
                <p className="text-sm font-medium">No evidence captured yet</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Add a progress update or screenshot from a project workspace.
                  Your newest proof will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function RecentEvidenceRow({ item }: { item: RecentEvidenceItem }) {
  const Icon = item.type === "update" ? NotebookText : Camera;

  return (
    <article className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{item.label}</Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(item.date)}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium">{item.title}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {item.projectTitle}
            </p>
          </div>
        </div>

        <Button asChild variant="outline" size="sm" className="w-fit shrink-0">
          <Link href={`/projects/${item.projectId}`}>
            Open project
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
