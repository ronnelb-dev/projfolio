import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getOwnedProgressUpdate } from "@/lib/progress-updates/actions";
import { requireUser } from "@/lib/auth/session";
import { ProgressUpdateForm } from "@/components/progress-updates/progress-update-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EditProgressUpdatePageProps = {
  params: Promise<{
    projectId: string;
    updateId: string;
  }>;
};

export async function generateMetadata({
  params,
}: EditProgressUpdatePageProps): Promise<Metadata> {
  const { projectId, updateId } = await params;
  const { profile } = await requireUser(`/projects/${projectId}/updates/${updateId}/edit`);
  const update = await getOwnedProgressUpdate({
    projectId,
    updateId,
    ownerId: profile.id,
  });

  return {
    title: `Edit ${update.title} | Projfolio`,
  };
}

export default async function EditProgressUpdatePage({
  params,
}: EditProgressUpdatePageProps) {
  const { projectId, updateId } = await params;
  const { profile } = await requireUser(`/projects/${projectId}/updates/${updateId}/edit`);
  const update = await getOwnedProgressUpdate({
    projectId,
    updateId,
    ownerId: profile.id,
  });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link href={`/projects/${projectId}`}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to project
        </Link>
      </Button>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl">Edit progress update</CardTitle>
          <CardDescription>
            Keep this note accurate while the context is still easy to recover.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressUpdateForm projectId={projectId} update={update} />
        </CardContent>
      </Card>
    </div>
  );
}
