import Link from "next/link";
import { Pencil } from "lucide-react";

import { FeatureDeleteForm } from "@/components/features/feature-delete-form";
import { FeatureStatusBadge } from "@/components/features/feature-badges";
import { FeatureStatusForm } from "@/components/features/feature-status-form";
import type { ProjectFeature } from "@/components/projects/project-workspace-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function FeatureCard({
  projectId,
  feature,
  deleteError,
}: {
  projectId: string;
  feature: ProjectFeature;
  deleteError?: boolean;
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <FeatureStatusBadge status={feature.status} />
            <Badge variant="outline">Priority {feature.priority}</Badge>
            {feature.completedAt ? (
              <span className="text-xs text-muted-foreground">
                Completed {formatDate(feature.completedAt)}
              </span>
            ) : null}
          </div>
          <div>
            <h3 className="text-base font-semibold">{feature.title}</h3>
            {feature.description ? (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            ) : (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                No feature context added yet.
              </p>
            )}
          </div>
        </div>

        <div className="flex w-fit shrink-0 flex-wrap gap-2">
          <FeatureStatusForm
            featureId={feature.id}
            projectId={projectId}
            status={feature.status}
          />
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${projectId}/features/${feature.id}/edit`}>
              <Pencil className="size-4" aria-hidden="true" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <FeatureDeleteForm
        deleteError={deleteError}
        featureId={feature.id}
        projectId={projectId}
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
