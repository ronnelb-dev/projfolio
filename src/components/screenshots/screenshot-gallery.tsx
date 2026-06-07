import { ImageIcon } from "lucide-react";

import { ScreenshotCard } from "@/components/screenshots/screenshot-card";
import type { ProjectScreenshot } from "@/components/projects/project-workspace-types";

export function ScreenshotGallery({
  projectId,
  screenshots,
  deleteErrorId,
  cloudinaryErrorId,
}: {
  projectId: string;
  screenshots: ProjectScreenshot[];
  deleteErrorId?: string;
  cloudinaryErrorId?: string;
}) {
  if (screenshots.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-secondary/45 p-5">
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
            <ImageIcon className="size-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium">No screenshots yet</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Upload visual proof of what changed, shipped, or broke. A clear
              screenshot often makes a progress note easier to trust.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {screenshots.map((screenshot) => (
        <ScreenshotCard
          cloudinaryError={cloudinaryErrorId === screenshot.id}
          deleteError={deleteErrorId === screenshot.id}
          key={screenshot.id}
          projectId={projectId}
          screenshot={screenshot}
        />
      ))}
    </div>
  );
}
