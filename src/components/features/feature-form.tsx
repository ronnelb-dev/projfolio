"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Feature } from "@/generated/prisma/client";

import { createFeature, updateFeature } from "@/lib/features/actions";
import {
  dateToInputValue,
  defaultFeatureFormValues,
  FeatureStatus,
  type FeatureActionState,
  type FeatureFormStateValues,
  isFeatureStatus,
} from "@/lib/features/validation";
import { featureStatusLabels } from "@/components/features/feature-badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FeatureFormProps = {
  projectId: string;
  feature?: Feature;
};

const initialState: FeatureActionState = {
  status: "idle",
};

const statusOptions = [
  FeatureStatus.PLANNED,
  FeatureStatus.IN_PROGRESS,
  FeatureStatus.COMPLETED,
] as const;

export function FeatureForm({ projectId, feature }: FeatureFormProps) {
  const router = useRouter();
  const action = feature
    ? updateFeature.bind(null, projectId, feature.id)
    : createFeature.bind(null, projectId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const values = getFormValues(feature, state.values);
  const formKey = JSON.stringify(
    state.status === "success"
      ? { projectId, resetKey: state.resetKey }
      : (state.values ?? { featureId: feature?.id ?? "new" }),
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

      <Field label="Feature title" htmlFor="title" error={state.fieldErrors?.title}>
        <Input
          aria-invalid={Boolean(state.fieldErrors?.title)}
          defaultValue={values.title}
          id="title"
          name="title"
          required
        />
      </Field>

      <Field
        label="Description"
        htmlFor="description"
        error={state.fieldErrors?.description}
      >
        <Textarea
          aria-invalid={Boolean(state.fieldErrors?.description)}
          className="min-h-24"
          defaultValue={values.description}
          id="description"
          name="description"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-[1fr_8rem_11rem]">
        <Field label="Status" htmlFor="status" error={state.fieldErrors?.status}>
          <select
            aria-invalid={Boolean(state.fieldErrors?.status)}
            className={selectClassName}
            defaultValue={values.status}
            id="status"
            name="status"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {featureStatusLabels[status]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Priority" htmlFor="priority" error={state.fieldErrors?.priority}>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.priority)}
            defaultValue={values.priority}
            id="priority"
            inputMode="numeric"
            name="priority"
          />
        </Field>

        <Field
          label="Completed"
          htmlFor="completedAt"
          error={state.fieldErrors?.completedAt}
        >
          <Input
            aria-invalid={Boolean(state.fieldErrors?.completedAt)}
            defaultValue={values.completedAt}
            id="completedAt"
            name="completedAt"
            type="date"
          />
        </Field>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        Leave completed date blank unless the feature is completed. Projfolio
        will set today automatically when needed.
      </p>

      <div className="flex justify-end border-t border-border pt-5">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Saving feature"
            : feature
              ? "Save feature"
              : "Add feature"}
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
  feature: Feature | undefined,
  stateValues: Partial<FeatureFormStateValues> | undefined,
): FeatureFormStateValues {
  if (stateValues) {
    return {
      ...defaultFeatureFormValues,
      ...stateValues,
      status: isFeatureStatus(stateValues.status)
        ? stateValues.status
        : defaultFeatureFormValues.status,
    };
  }

  if (!feature) {
    return defaultFeatureFormValues;
  }

  return {
    title: feature.title,
    description: feature.description ?? "",
    status: feature.status,
    priority: String(feature.priority),
    completedAt: dateToInputValue(feature.completedAt),
  };
}

const selectClassName = cn(
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm",
  "outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
);
