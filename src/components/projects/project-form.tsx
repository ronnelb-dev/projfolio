"use client";

import { useActionState } from "react";
import type { Project } from "@/generated/prisma/client";

import { createProject, updateProject } from "@/lib/projects/actions";
import {
  defaultProjectFormValues,
  ProjectStatus,
  techStackToInput,
  type ProjectActionState,
  type ProjectFormStateValues,
  type ProjectFormValues,
  Visibility,
} from "@/lib/projects/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ProjectFormProps = {
  project?: Project;
};

const initialState: ProjectActionState = {
  status: "idle",
};

const statusOptions = [
  [ProjectStatus.PLANNED, "Planned"],
  [ProjectStatus.BUILDING, "Building"],
  [ProjectStatus.PAUSED, "Paused"],
  [ProjectStatus.SHIPPED, "Shipped"],
  [ProjectStatus.ARCHIVED, "Archived"],
] as const;

const visibilityOptions = [
  [Visibility.PRIVATE, "Private"],
  [Visibility.PUBLIC, "Public"],
] as const;

export function ProjectForm({ project }: ProjectFormProps) {
  const action = project ? updateProject.bind(null, project.id) : createProject;
  const [state, formAction, pending] = useActionState(action, initialState);
  const values = getFormValues(project, state.values);
  const formKey = JSON.stringify(state.values ?? { projectId: project?.id ?? "new" });

  return (
    <form action={formAction} className="space-y-6" key={formKey} noValidate>
      <FieldError messages={state.message ? [state.message] : undefined} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Project title" htmlFor="title" error={state.fieldErrors?.title}>
          <Input
            id="title"
            name="title"
            defaultValue={values.title}
            aria-invalid={Boolean(state.fieldErrors?.title)}
            required
          />
        </Field>

        <Field label="Slug" htmlFor="slug" error={state.fieldErrors?.slug}>
          <Input
            id="slug"
            name="slug"
            defaultValue={values.slug}
            placeholder="generated-from-title"
            aria-invalid={Boolean(state.fieldErrors?.slug)}
          />
          <p className="text-xs leading-5 text-muted-foreground">
            Leave blank to generate a URL-safe slug from the title.
          </p>
        </Field>
      </div>

      <Field label="Summary" htmlFor="summary" error={state.fieldErrors?.summary}>
        <Textarea
          id="summary"
          name="summary"
          defaultValue={values.summary}
          className="min-h-20"
          aria-invalid={Boolean(state.fieldErrors?.summary)}
          required
        />
      </Field>

      <Field label="Description" htmlFor="description" error={state.fieldErrors?.description}>
        <Textarea
          id="description"
          name="description"
          defaultValue={values.description}
          className="min-h-28"
          aria-invalid={Boolean(state.fieldErrors?.description)}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Status" htmlFor="status" error={state.fieldErrors?.status}>
          <select
            id="status"
            name="status"
            defaultValue={values.status}
            className={selectClassName}
            aria-invalid={Boolean(state.fieldErrors?.status)}
          >
            {statusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Visibility" htmlFor="visibility" error={state.fieldErrors?.visibility}>
          <select
            id="visibility"
            name="visibility"
            defaultValue={values.visibility}
            className={selectClassName}
            aria-invalid={Boolean(state.fieldErrors?.visibility)}
          >
            {visibilityOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Tech stack" htmlFor="techStack" error={state.fieldErrors?.techStack}>
        <Input
          id="techStack"
          name="techStack"
          defaultValue={values.techStack}
          placeholder="Next.js, Prisma, Supabase"
          aria-invalid={Boolean(state.fieldErrors?.techStack)}
        />
        <p className="text-xs leading-5 text-muted-foreground">
          Separate technologies with commas.
        </p>
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Repository URL" htmlFor="repoUrl" error={state.fieldErrors?.repoUrl}>
          <Input
            id="repoUrl"
            name="repoUrl"
            type="url"
            defaultValue={values.repoUrl ?? ""}
            placeholder="https://github.com/you/project"
            aria-invalid={Boolean(state.fieldErrors?.repoUrl)}
          />
        </Field>

        <Field label="Live demo URL" htmlFor="liveDemoUrl" error={state.fieldErrors?.liveDemoUrl}>
          <Input
            id="liveDemoUrl"
            name="liveDemoUrl"
            type="url"
            defaultValue={values.liveDemoUrl ?? ""}
            placeholder="https://project.example"
            aria-invalid={Boolean(state.fieldErrors?.liveDemoUrl)}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving project" : project ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      <FieldError messages={error} />
    </div>
  );
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) {
    return null;
  }

  return (
    <p className="rounded-md bg-[var(--error-soft)] px-3 py-2 text-sm text-destructive">
      {messages[0]}
    </p>
  );
}

function getFormValues(
  project: Project | undefined,
  stateValues: Partial<ProjectFormStateValues> | undefined,
): ProjectFormValues {
  if (stateValues) {
    return {
      ...defaultProjectFormValues,
      ...stateValues,
      status: isProjectStatus(stateValues.status)
        ? stateValues.status
        : defaultProjectFormValues.status,
      visibility: isVisibility(stateValues.visibility)
        ? stateValues.visibility
        : defaultProjectFormValues.visibility,
    };
  }

  if (!project) {
    return defaultProjectFormValues;
  }

  return {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description ?? "",
    status: project.status,
    visibility: project.visibility,
    techStack: techStackToInput(project.techStack),
    repoUrl: project.repoUrl ?? undefined,
    liveDemoUrl: project.liveDemoUrl ?? undefined,
  };
}

function isProjectStatus(value: string | undefined): value is ProjectStatus {
  return Object.values(ProjectStatus).includes(value as ProjectStatus);
}

function isVisibility(value: string | undefined): value is Visibility {
  return Object.values(Visibility).includes(value as Visibility);
}

const selectClassName = cn(
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm",
  "outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
);
