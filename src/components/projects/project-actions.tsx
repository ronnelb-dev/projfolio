import type { Project } from "@/generated/prisma/client";

import {
  archiveProject,
  deleteProject,
  publishProject,
  unpublishProject,
} from "@/lib/projects/actions";
import { Button } from "@/components/ui/button";

type ProjectActionsProps = {
  project: Project;
  deleteError?: boolean;
};

export function ProjectActions({ project, deleteError }: ProjectActionsProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {project.isPublished ? (
          <ProjectActionForm
            action={unpublishProject}
            buttonLabel="Unpublish"
            projectId={project.id}
            variant="outline"
          />
        ) : (
          <ProjectActionForm
            action={publishProject}
            buttonLabel="Publish"
            projectId={project.id}
          />
        )}
        <ProjectActionForm
          action={archiveProject}
          buttonLabel="Archive"
          projectId={project.id}
          variant="outline"
        />
      </div>

      <form action={deleteProject} className="space-y-3 rounded-lg border border-border bg-secondary/45 p-4">
        <input type="hidden" name="projectId" value={project.id} />
        <div>
          <p className="text-sm font-medium text-foreground">Delete project</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Type the project title to permanently delete it.
          </p>
        </div>
        <input
          className="h-8 w-full rounded-lg border border-input bg-background px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          name="confirmation"
          placeholder={project.title}
          aria-label="Type project title to confirm deletion"
        />
        {deleteError ? (
          <p className="rounded-md bg-[var(--error-soft)] px-3 py-2 text-sm text-destructive">
            Type the exact project title before deleting.
          </p>
        ) : null}
        <Button type="submit" variant="destructive">
          Delete project
        </Button>
      </form>
    </div>
  );
}

function ProjectActionForm({
  action,
  buttonLabel,
  projectId,
  variant = "default",
}: {
  action: (formData: FormData) => Promise<void>;
  buttonLabel: string;
  projectId: string;
  variant?: "default" | "outline";
}) {
  return (
    <form action={action}>
      <input type="hidden" name="projectId" value={projectId} />
      <Button type="submit" variant={variant}>
        {buttonLabel}
      </Button>
    </form>
  );
}
