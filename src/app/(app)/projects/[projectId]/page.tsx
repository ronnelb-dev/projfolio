import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { ProjectWorkspaceHeader } from "@/components/projects/project-workspace-header";
import { ProjectWorkspaceSidebar } from "@/components/projects/project-workspace-sidebar";
import { ProjectWorkspaceTabs } from "@/components/projects/project-workspace-tabs";
import {
  getProjectEvidenceCounts,
  type ProjectWorkspaceProject,
} from "@/components/projects/project-workspace-types";
import { Button } from "@/components/ui/button";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    deleteError?: string;
    updateDeleteError?: string;
    screenshotDeleteError?: string;
    screenshotCloudinaryError?: string;
    featureDeleteError?: string;
  }>;
};

const projectWorkspaceInclude = {
  _count: {
    select: {
      progressUpdates: true,
      screenshots: true,
      features: true,
      bugs: true,
      changelogReleases: true,
    },
  },
  caseStudy: {
    select: {
      id: true,
    },
  },
  progressUpdates: {
    orderBy: [
      {
        occurredAt: "desc" as const,
      },
      {
        createdAt: "desc" as const,
      },
    ],
    include: {
      screenshots: {
        orderBy: [
          {
            sortOrder: "asc" as const,
          },
          {
            createdAt: "desc" as const,
          },
        ],
        select: {
          id: true,
          url: true,
          altText: true,
          caption: true,
          sortOrder: true,
          createdAt: true,
        },
      },
    },
  },
  screenshots: {
    orderBy: [
      {
        sortOrder: "asc" as const,
      },
      {
        createdAt: "desc" as const,
      },
    ],
    include: {
      progressUpdate: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  },
  features: {
    orderBy: [
      {
        priority: "asc" as const,
      },
      {
        updatedAt: "desc" as const,
      },
    ],
  },
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { projectId } = await params;
  const { profile } = await requireUser(`/projects/${projectId}`);
  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: profile.id },
    select: { title: true },
  });

  return {
    title: project ? `${project.title} | Projfolio` : "Project | Projfolio",
  };
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const [{ projectId }, query] = await Promise.all([params, searchParams]);
  const { profile } = await requireUser(`/projects/${projectId}`);
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: profile.id,
    },
    include: projectWorkspaceInclude,
  });

  if (!project) {
    notFound();
  }

  const workspaceProject = project as ProjectWorkspaceProject;
  const counts = getProjectEvidenceCounts(workspaceProject);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>
      </Button>

      <ProjectWorkspaceHeader project={workspaceProject} />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="min-w-0">
          <ProjectWorkspaceTabs
            project={workspaceProject}
            counts={counts}
            screenshotCloudinaryErrorId={query.screenshotCloudinaryError}
            screenshotDeleteErrorId={query.screenshotDeleteError}
            updateDeleteErrorId={query.updateDeleteError}
            featureDeleteErrorId={query.featureDeleteError}
          />
        </div>
        <ProjectWorkspaceSidebar
          project={workspaceProject}
          deleteError={query.deleteError === "confirmation"}
        />
      </section>
    </div>
  );
}
