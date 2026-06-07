import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { getOwnedScreenshot } from "@/lib/screenshots/actions";
import { ScreenshotForm } from "@/components/screenshots/screenshot-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EditScreenshotPageProps = {
  params: Promise<{
    projectId: string;
    screenshotId: string;
  }>;
};

export async function generateMetadata({
  params,
}: EditScreenshotPageProps): Promise<Metadata> {
  const { projectId, screenshotId } = await params;
  const { profile } = await requireUser(
    `/projects/${projectId}/screenshots/${screenshotId}/edit`,
  );
  const screenshot = await getOwnedScreenshot({
    projectId,
    screenshotId,
    ownerId: profile.id,
  });

  return {
    title: `Edit ${screenshot.altText} | Projfolio`,
  };
}

export default async function EditScreenshotPage({
  params,
}: EditScreenshotPageProps) {
  const { projectId, screenshotId } = await params;
  const { profile } = await requireUser(
    `/projects/${projectId}/screenshots/${screenshotId}/edit`,
  );
  const [screenshot, progressUpdates] = await Promise.all([
    getOwnedScreenshot({
      projectId,
      screenshotId,
      ownerId: profile.id,
    }),
    prisma.progressUpdate.findMany({
      where: {
        projectId,
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
      select: {
        id: true,
        title: true,
      },
    }),
  ]);

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
          <CardTitle className="text-2xl">Edit screenshot metadata</CardTitle>
          <CardDescription>
            Keep visual evidence readable before it becomes public proof.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScreenshotForm
            progressUpdates={progressUpdates}
            projectId={projectId}
            screenshot={screenshot}
          />
        </CardContent>
      </Card>
    </div>
  );
}
