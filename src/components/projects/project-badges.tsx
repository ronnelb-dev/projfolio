import { Badge } from "@/components/ui/badge";
import { ProjectStatus, Visibility } from "@/lib/projects/validation";

const statusLabels: Record<ProjectStatus, string> = {
  PLANNED: "Planned",
  BUILDING: "Building",
  PAUSED: "Paused",
  SHIPPED: "Shipped",
  ARCHIVED: "Archived",
};

const visibilityLabels: Record<Visibility, string> = {
  PRIVATE: "Private",
  PUBLIC: "Public",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge
      variant={status === ProjectStatus.ARCHIVED ? "outline" : "secondary"}
      className={
        status === ProjectStatus.SHIPPED
          ? "border-[var(--success)]/30 bg-[var(--success-soft)] text-[var(--success)]"
          : status === ProjectStatus.PAUSED
            ? "border-[var(--warning)]/30 bg-[var(--warning-soft)] text-[var(--warning)]"
            : undefined
      }
    >
      {statusLabels[status]}
    </Badge>
  );
}

export function VisibilityBadge({
  visibility,
  isPublished,
}: {
  visibility: Visibility;
  isPublished: boolean;
}) {
  if (isPublished) {
    return (
      <Badge className="border-[var(--success)]/30 bg-[var(--success-soft)] text-[var(--success)]">
        Published
      </Badge>
    );
  }

  return <Badge variant="outline">{visibilityLabels[visibility]}</Badge>;
}
