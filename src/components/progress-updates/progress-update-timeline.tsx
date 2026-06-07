import { ProgressUpdateCard } from "@/components/progress-updates/progress-update-card";
import type { TimelineProgressUpdate } from "@/components/projects/project-workspace-types";

export function ProgressUpdateTimeline({
  projectId,
  updates,
  deleteErrorId,
}: {
  projectId: string;
  updates: TimelineProgressUpdate[];
  deleteErrorId?: string;
}) {
  if (updates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-secondary/45 p-5">
        <p className="text-sm font-medium">No progress updates yet</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Start with what changed, why it mattered, or which decision you made.
          The strongest evidence is written while the work is still fresh.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {updates.map((update) => (
        <ProgressUpdateCard
          deleteError={deleteErrorId === update.id}
          key={update.id}
          projectId={projectId}
          update={update}
        />
      ))}
    </div>
  );
}
