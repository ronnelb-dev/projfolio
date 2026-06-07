import Link from "next/link";
import { ArrowRight, Pencil } from "lucide-react";
import type { Project } from "@/generated/prisma/client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProjectStatusBadge, VisibilityBadge } from "@/components/projects/project-badges";

type ProjectListProps = {
  projects: Project[];
};

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {projects.map((project) => (
        <article className="p-4" key={project.id}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 space-y-3">
              <div>
                <Link
                  href={`/projects/${project.id}`}
                  className="text-base font-semibold underline-offset-4 hover:underline"
                >
                  {project.title}
                </Link>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {project.summary}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ProjectStatusBadge status={project.status} />
                <VisibilityBadge
                  visibility={project.visibility}
                  isPublished={project.isPublished}
                />
                <span className="text-xs text-muted-foreground">
                  Updated {formatDate(project.updatedAt)}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/projects/${project.id}/edit`}>
                  <Pencil className="size-4" aria-hidden="true" />
                  Edit
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/projects/${project.id}`}>
                  Open
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
          {project.techStack.length > 0 ? (
            <>
              <Separator className="my-4" />
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
            </>
          ) : null}
        </article>
      ))}
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
