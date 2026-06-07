import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { ScreenshotDeleteForm } from "@/components/screenshots/screenshot-delete-form";
import type { ProjectScreenshot } from "@/components/projects/project-workspace-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function ScreenshotCard({
  projectId,
  screenshot,
  deleteError,
  cloudinaryError,
}: {
  projectId: string;
  screenshot: ProjectScreenshot;
  deleteError?: boolean;
  cloudinaryError?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-[16/10] bg-secondary">
        <Image
          alt={screenshot.altText}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 420px, (min-width: 768px) 50vw, 100vw"
          src={screenshot.url}
        />
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Screenshot</Badge>
            <Badge variant="outline">Order {screenshot.sortOrder}</Badge>
            {screenshot.progressUpdate ? (
              <Badge variant="outline">Attached update</Badge>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-medium">{screenshot.altText}</p>
            {screenshot.caption ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {screenshot.caption}
              </p>
            ) : null}
          </div>

          {screenshot.progressUpdate ? (
            <p className="text-sm leading-6 text-muted-foreground">
              Attached to{" "}
              <span className="font-medium text-foreground">
                {screenshot.progressUpdate.title}
              </span>
            </p>
          ) : null}
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <Button asChild variant="outline" size="sm" className="w-fit">
            <Link href={`/projects/${projectId}/screenshots/${screenshot.id}/edit`}>
              <Pencil className="size-4" aria-hidden="true" />
              Edit metadata
            </Link>
          </Button>

          <ScreenshotDeleteForm
            cloudinaryError={cloudinaryError}
            deleteError={deleteError}
            projectId={projectId}
            screenshotId={screenshot.id}
          />
        </div>
      </div>
    </article>
  );
}
