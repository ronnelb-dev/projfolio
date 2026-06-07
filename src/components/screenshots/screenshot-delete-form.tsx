"use client";

import { useState } from "react";

import { deleteScreenshot } from "@/lib/screenshots/actions";
import { Button } from "@/components/ui/button";

export function ScreenshotDeleteForm({
  projectId,
  screenshotId,
  deleteError,
  cloudinaryError,
}: {
  projectId: string;
  screenshotId: string;
  deleteError?: boolean;
  cloudinaryError?: boolean;
}) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <form action={deleteScreenshot} className="space-y-3">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="screenshotId" value={screenshotId} />
      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input
          checked={confirmed}
          className="mt-1 size-4 rounded border-border accent-[var(--primary)]"
          name="confirmDelete"
          onChange={(event) => setConfirmed(event.target.checked)}
          type="checkbox"
        />
        Delete this evidence from Projfolio and Cloudinary.
      </label>
      {deleteError ? (
        <p className="rounded-md bg-[var(--error-soft)] px-3 py-2 text-sm text-destructive">
          Confirm deletion before removing this evidence.
        </p>
      ) : null}
      {cloudinaryError ? (
        <p className="rounded-md bg-[var(--error-soft)] px-3 py-2 text-sm text-destructive">
          Cloudinary could not remove the image. The screenshot record was kept.
        </p>
      ) : null}
      <Button type="submit" variant="destructive" size="sm" disabled={!confirmed}>
        Delete evidence
      </Button>
    </form>
  );
}
