import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { ProjectForm } from "@/components/projects/project-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EditProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function generateMetadata({
  params,
}: EditProjectPageProps): Promise<Metadata> {
  const { projectId } = await params;
  const { profile } = await requireUser(`/projects/${projectId}/edit`);
  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: profile.id },
    select: { title: true },
  });

  return {
    title: project ? `Edit ${project.title} | Projfolio` : "Edit project | Projfolio",
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { projectId } = await params;
  const { profile } = await requireUser(`/projects/${projectId}/edit`);
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: profile.id,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link href={`/projects/${project.id}`}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to project
        </Link>
      </Button>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl">Edit project</CardTitle>
          <CardDescription>
            Keep the core project record accurate before adding daily evidence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm project={project} />
        </CardContent>
      </Card>
    </div>
  );
}
