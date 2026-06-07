import Image from "next/image";

import type { TimelineScreenshot } from "@/components/projects/project-workspace-types";

export function ProgressUpdateScreenshots({
  screenshots,
}: {
  screenshots: TimelineScreenshot[];
}) {
  if (screenshots.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {screenshots.map((screenshot) => (
        <figure
          className="overflow-hidden rounded-lg border border-border bg-background"
          key={screenshot.id}
        >
          <div className="relative aspect-[16/10] bg-secondary">
            <Image
              alt={screenshot.altText}
              className="object-cover"
              fill
              sizes="(min-width: 768px) 280px, 100vw"
              src={screenshot.url}
            />
          </div>
          {screenshot.caption ? (
            <figcaption className="px-3 py-2 text-xs leading-5 text-muted-foreground">
              {screenshot.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
