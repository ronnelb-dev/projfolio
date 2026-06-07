import Link from "next/link";
import { Pencil } from "lucide-react";

import { ProgressUpdateDeleteForm } from "@/components/progress-updates/progress-update-delete-form";
import {
  ProgressCategoryBadge,
  ProgressVisibilityBadge,
} from "@/components/progress-updates/progress-update-badges";
import { ProgressUpdateScreenshots } from "@/components/screenshots/progress-update-screenshots";
import type { TimelineProgressUpdate } from "@/components/projects/project-workspace-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function ProgressUpdateCard({
  projectId,
  update,
  deleteError,
}: {
  projectId: string;
  update: TimelineProgressUpdate;
  deleteError?: boolean;
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <ProgressCategoryBadge category={update.category} />
            <ProgressVisibilityBadge visibility={update.visibility} />
            <span className="text-xs text-muted-foreground">
              {formatDate(update.occurredAt)}
            </span>
            {update.screenshots.length > 0 ? (
              <Badge variant="outline">
                {update.screenshots.length} screenshot
                {update.screenshots.length === 1 ? "" : "s"}
              </Badge>
            ) : null}
          </div>
          <div>
            <h3 className="text-base font-semibold">{update.title}</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {update.content}
            </p>
          </div>
          <ProgressUpdateScreenshots screenshots={update.screenshots} />
        </div>

        <Button asChild variant="outline" size="sm" className="w-fit shrink-0">
          <Link href={`/projects/${projectId}/updates/${update.id}/edit`}>
            <Pencil className="size-4" aria-hidden="true" />
            Edit
          </Link>
        </Button>
      </div>

      <Separator className="my-4" />

      <ProgressUpdateDeleteForm
        deleteError={deleteError}
        projectId={projectId}
        updateId={update.id}
      />
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
