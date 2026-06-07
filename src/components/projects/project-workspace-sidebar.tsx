import type { ProjectWorkspaceProject } from "@/components/projects/project-workspace-types";
import { ProjectActions } from "@/components/projects/project-actions";
import { ProjectStatusBadge, VisibilityBadge } from "@/components/projects/project-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ProjectWorkspaceSidebar({
  project,
  deleteError,
}: {
  project: ProjectWorkspaceProject;
  deleteError?: boolean;
}) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Project actions</CardTitle>
          <CardDescription>
            Publishing controls stay private until public pages arrive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectActions project={project} deleteError={deleteError} />
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Workspace status</CardTitle>
          <CardDescription>Private metadata for this project.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-2">
            <ProjectStatusBadge status={project.status} />
            <VisibilityBadge
              visibility={project.visibility}
              isPublished={project.isPublished}
            />
          </div>
          <Separator />
          <Meta label="Created" value={formatDate(project.createdAt)} />
          <Meta label="Updated" value={formatDate(project.updatedAt)} />
          <Meta
            label="Published"
            value={project.publishedAt ? formatDate(project.publishedAt) : "Not published"}
          />
          <Meta
            label="Archived"
            value={project.archivedAt ? formatDate(project.archivedAt) : "Not archived"}
          />
        </CardContent>
      </Card>
    </aside>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 text-muted-foreground">{value}</p>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
