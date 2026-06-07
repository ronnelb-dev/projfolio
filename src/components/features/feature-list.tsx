import { FeatureCard } from "@/components/features/feature-card";
import { featureStatusLabels } from "@/components/features/feature-badges";
import type { ProjectFeature } from "@/components/projects/project-workspace-types";
import { FeatureStatus } from "@/lib/features/validation";
import { Badge } from "@/components/ui/badge";

const featureGroups = [
  FeatureStatus.IN_PROGRESS,
  FeatureStatus.PLANNED,
  FeatureStatus.COMPLETED,
] as const;

export function FeatureList({
  projectId,
  features,
  deleteErrorId,
}: {
  projectId: string;
  features: ProjectFeature[];
  deleteErrorId?: string;
}) {
  if (features.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-secondary/45 p-5">
        <p className="text-sm font-medium">No features tracked yet</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Add the first feature to preserve what this project is meant to prove.
          This is planning evidence, not a streak or gamified checklist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {featureGroups.map((status) => {
        const groupFeatures = features.filter((feature) => feature.status === status);

        if (groupFeatures.length === 0) {
          return null;
        }

        return (
          <section className="space-y-3" key={status}>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold">{featureStatusLabels[status]}</h3>
              <Badge variant="outline">{groupFeatures.length}</Badge>
            </div>
            <div className="space-y-3">
              {groupFeatures.map((feature) => (
                <FeatureCard
                  deleteError={deleteErrorId === feature.id}
                  feature={feature}
                  key={feature.id}
                  projectId={projectId}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
