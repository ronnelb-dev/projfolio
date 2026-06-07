"use client";

import { useState } from "react";

import { deleteFeature } from "@/lib/features/actions";
import { Button } from "@/components/ui/button";

export function FeatureDeleteForm({
  projectId,
  featureId,
  deleteError,
}: {
  projectId: string;
  featureId: string;
  deleteError?: boolean;
}) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <form action={deleteFeature} className="space-y-3">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="featureId" value={featureId} />
      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input
          checked={confirmed}
          className="mt-1 size-4 rounded border-border accent-[var(--primary)]"
          name="confirmDelete"
          onChange={(event) => setConfirmed(event.target.checked)}
          type="checkbox"
        />
        Delete this feature permanently.
      </label>
      {deleteError ? (
        <p className="rounded-md bg-[var(--error-soft)] px-3 py-2 text-sm text-destructive">
          Confirm deletion before removing this feature.
        </p>
      ) : null}
      <Button type="submit" variant="destructive" size="sm" disabled={!confirmed}>
        Delete feature
      </Button>
    </form>
  );
}
