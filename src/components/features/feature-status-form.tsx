import { updateFeatureStatus } from "@/lib/features/actions";
import { FeatureStatus } from "@/lib/features/validation";
import { Button } from "@/components/ui/button";

export function FeatureStatusForm({
  projectId,
  featureId,
  status,
}: {
  projectId: string;
  featureId: string;
  status: FeatureStatus;
}) {
  const nextStatus =
    status === FeatureStatus.COMPLETED
      ? FeatureStatus.IN_PROGRESS
      : FeatureStatus.COMPLETED;

  return (
    <form action={updateFeatureStatus}>
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="featureId" value={featureId} />
      <input type="hidden" name="status" value={nextStatus} />
      <Button type="submit" variant="outline" size="sm">
        {nextStatus === FeatureStatus.COMPLETED ? "Mark complete" : "Reopen"}
      </Button>
    </form>
  );
}
