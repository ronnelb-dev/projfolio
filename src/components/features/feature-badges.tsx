import { Badge } from "@/components/ui/badge";
import { FeatureStatus } from "@/lib/features/validation";

export const featureStatusLabels: Record<FeatureStatus, string> = {
  PLANNED: "Planned",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

export function FeatureStatusBadge({ status }: { status: FeatureStatus }) {
  return (
    <Badge
      variant={status === FeatureStatus.PLANNED ? "outline" : "secondary"}
      className={
        status === FeatureStatus.COMPLETED
          ? "border-[var(--success)]/30 bg-[var(--success-soft)] text-[var(--success)]"
          : status === FeatureStatus.IN_PROGRESS
            ? "border-[var(--warning)]/30 bg-[var(--warning-soft)] text-[var(--warning)]"
            : undefined
      }
    >
      {featureStatusLabels[status]}
    </Badge>
  );
}
