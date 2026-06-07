"use client";

import { useState } from "react";

import { deleteProgressUpdate } from "@/lib/progress-updates/actions";
import { Button } from "@/components/ui/button";

export function ProgressUpdateDeleteForm({
  projectId,
  updateId,
  deleteError,
}: {
  projectId: string;
  updateId: string;
  deleteError?: boolean;
}) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <form action={deleteProgressUpdate} className="space-y-3">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="updateId" value={updateId} />
      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input
          checked={confirmed}
          className="mt-1 size-4 rounded border-border accent-[var(--primary)]"
          name="confirmDelete"
          onChange={(event) => setConfirmed(event.target.checked)}
          type="checkbox"
        />
        Delete this evidence permanently.
      </label>
      {deleteError ? (
        <p className="rounded-md bg-[var(--error-soft)] px-3 py-2 text-sm text-destructive">
          Confirm deletion before removing this evidence.
        </p>
      ) : null}
      <Button type="submit" variant="destructive" size="sm" disabled={!confirmed}>
        Delete evidence
      </Button>
    </form>
  );
}
