import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";

import type { ProjectWorkspaceProject } from "@/components/projects/project-workspace-types";
import { ProjectStatusBadge, VisibilityBadge } from "@/components/projects/project-badges";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProjectWorkspaceHeader({
  project,
}: {
  project: ProjectWorkspaceProject;
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap gap-2">
          <ProjectStatusBadge status={project.status} />
          <VisibilityBadge
            visibility={project.visibility}
            isPublished={project.isPublished}
          />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl md:text-3xl">{project.title}</CardTitle>
          <CardDescription className="max-w-3xl text-base leading-7">
            {project.summary}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {project.description ? (
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {project.description}
          </p>
        ) : null}

        <div className="grid gap-3 rounded-lg border border-border bg-secondary/45 p-4 text-sm md:grid-cols-2 lg:grid-cols-4">
          <Meta label="Slug" value={project.slug} />
          <Meta label="Updated" value={formatDate(project.updatedAt)} />
          <MetaLink label="Repository" href={project.repoUrl} />
          <MetaLink label="Live demo" href={project.liveDemoUrl} />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {project.techStack.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  className="rounded-full border border-border bg-secondary px-2 py-1 text-xs text-muted-foreground"
                  key={tech}
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No tech stack added yet.</p>
          )}

          <Button asChild className="w-fit">
            <Link href={`/projects/${project.id}/edit`}>
              <Pencil className="size-4" aria-hidden="true" />
              Edit project
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 break-words text-muted-foreground">{value}</p>
    </div>
  );
}

function MetaLink({ label, href }: { label: string; href: string | null }) {
  if (!href) {
    return <Meta label={label} value="Not set yet" />;
  }

  return (
    <div>
      <p className="font-medium text-foreground">{label}</p>
      <a
        className="mt-1 inline-flex items-center gap-1 break-all text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        href={href}
        rel="noreferrer"
        target="_blank"
      >
        {href}
        <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
      </a>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
