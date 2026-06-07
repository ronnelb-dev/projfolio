"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ProgressUpdate } from "@/generated/prisma/client";

import {
  createProgressUpdate,
  updateProgressUpdate,
} from "@/lib/progress-updates/actions";
import {
  dateToInputValue,
  defaultProgressUpdateFormValues,
  isProgressCategory,
  isVisibility,
  ProgressCategory,
  type ProgressUpdateActionState,
  type ProgressUpdateFormStateValues,
  Visibility,
} from "@/lib/progress-updates/validation";
import {
  categoryLabels,
  visibilityLabels,
} from "@/components/progress-updates/progress-update-badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ProgressUpdateFormProps = {
  projectId: string;
  update?: ProgressUpdate;
};

const initialState: ProgressUpdateActionState = {
  status: "idle",
};

const categoryOptions = [
  ProgressCategory.IDEA,
  ProgressCategory.DECISION,
  ProgressCategory.PROGRESS,
  ProgressCategory.TECHNICAL_NOTE,
  ProgressCategory.DEMO,
  ProgressCategory.LAUNCH,
] as const;

const visibilityOptions = [Visibility.PRIVATE, Visibility.PUBLIC] as const;

export function ProgressUpdateForm({
  projectId,
  update,
}: ProgressUpdateFormProps) {
  const router = useRouter();
  const action = update
    ? updateProgressUpdate.bind(null, projectId, update.id)
    : createProgressUpdate.bind(null, projectId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const values = getFormValues(update, state.values);
  const formKey = JSON.stringify(
    state.status === "success"
      ? { projectId, resetKey: state.resetKey }
      : (state.values ?? { updateId: update?.id ?? "new" }),
  );

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <form action={formAction} className="space-y-5" key={formKey} noValidate>
      {state.message ? (
        <p className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-[1fr_1fr_11rem]">
        <Field label="Category" htmlFor="category" error={state.fieldErrors?.category}>
          <select
            aria-invalid={Boolean(state.fieldErrors?.category)}
            className={selectClassName}
            defaultValue={values.category}
            id="category"
            name="category"
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category]}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Visibility"
          htmlFor="visibility"
          error={state.fieldErrors?.visibility}
        >
          <select
            aria-invalid={Boolean(state.fieldErrors?.visibility)}
            className={selectClassName}
            defaultValue={values.visibility}
            id="visibility"
            name="visibility"
          >
            {visibilityOptions.map((visibility) => (
              <option key={visibility} value={visibility}>
                {visibilityLabels[visibility]}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Occurred"
          htmlFor="occurredAt"
          error={state.fieldErrors?.occurredAt}
        >
          <Input
            aria-invalid={Boolean(state.fieldErrors?.occurredAt)}
            defaultValue={values.occurredAt}
            id="occurredAt"
            name="occurredAt"
            type="date"
            required
          />
        </Field>
      </div>

      <Field label="Title" htmlFor="title" error={state.fieldErrors?.title}>
        <Input
          aria-invalid={Boolean(state.fieldErrors?.title)}
          defaultValue={values.title}
          id="title"
          name="title"
          required
        />
      </Field>

      <Field label="Content" htmlFor="content" error={state.fieldErrors?.content}>
        <Textarea
          aria-invalid={Boolean(state.fieldErrors?.content)}
          className="min-h-32"
          defaultValue={values.content}
          id="content"
          name="content"
          required
        />
      </Field>

      <div className="flex justify-end border-t border-border pt-5">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Saving evidence"
            : update
              ? "Save progress update"
              : "Add progress update"}
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
  update: ProgressUpdate | undefined,
  stateValues: Partial<ProgressUpdateFormStateValues> | undefined,
): ProgressUpdateFormStateValues {
  if (stateValues) {
    return {
      ...defaultProgressUpdateFormValues,
      ...stateValues,
      category: isProgressCategory(stateValues.category)
        ? stateValues.category
        : defaultProgressUpdateFormValues.category,
      visibility: isVisibility(stateValues.visibility)
        ? stateValues.visibility
        : defaultProgressUpdateFormValues.visibility,
    };
  }

  if (!update) {
    return defaultProgressUpdateFormValues;
  }

  return {
    category: update.category,
    title: update.title,
    content: update.content,
    visibility: update.visibility,
    occurredAt: dateToInputValue(update.occurredAt),
  };
}

const selectClassName = cn(
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm",
  "outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
);
