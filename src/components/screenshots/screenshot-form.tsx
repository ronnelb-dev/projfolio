"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Screenshot } from "@/generated/prisma/client";

import { createScreenshot, updateScreenshot } from "@/lib/screenshots/actions";
import {
  defaultScreenshotFormValues,
  type ScreenshotActionState,
  type ScreenshotFormStateValues,
} from "@/lib/screenshots/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type ProgressUpdateOption = {
  id: string;
  title: string;
};

type ScreenshotFormProps = {
  projectId: string;
  progressUpdates: ProgressUpdateOption[];
  screenshot?: Screenshot;
};

const initialState: ScreenshotActionState = {
  status: "idle",
};

export function ScreenshotForm({
  projectId,
  progressUpdates,
  screenshot,
}: ScreenshotFormProps) {
  const router = useRouter();
  const action = screenshot
    ? updateScreenshot.bind(null, projectId, screenshot.id)
    : createScreenshot.bind(null, projectId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const values = getFormValues(screenshot, state.values);
  const formKey = JSON.stringify(
    state.status === "success"
      ? { projectId, resetKey: state.resetKey }
      : (state.values ?? { screenshotId: screenshot?.id ?? "new" }),
  );

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <form action={formAction} className="space-y-5" key={formKey} noValidate>
      <FieldError messages={state.message ? [state.message] : undefined} />

      {!screenshot ? (
        <Field label="Screenshot image" htmlFor="image" error={state.fieldErrors?.image}>
          <Input
            accept="image/png,image/jpeg,image/webp"
            aria-invalid={Boolean(state.fieldErrors?.image)}
            id="image"
            name="image"
            type="file"
            required
          />
          <p className="text-xs leading-5 text-muted-foreground">
            PNG, JPG, or WebP. Keep each image under 5MB.
          </p>
        </Field>
      ) : null}

      <div className="grid gap-4 md:grid-cols-[1fr_10rem]">
        <Field label="Alt text" htmlFor="altText" error={state.fieldErrors?.altText}>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.altText)}
            defaultValue={values.altText}
            id="altText"
            name="altText"
            required
          />
        </Field>

        <Field label="Sort order" htmlFor="sortOrder" error={state.fieldErrors?.sortOrder}>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.sortOrder)}
            defaultValue={values.sortOrder}
            id="sortOrder"
            inputMode="numeric"
            name="sortOrder"
            placeholder="Auto"
          />
        </Field>
      </div>

      <Field label="Caption" htmlFor="caption" error={state.fieldErrors?.caption}>
        <Textarea
          aria-invalid={Boolean(state.fieldErrors?.caption)}
          className="min-h-24"
          defaultValue={values.caption}
          id="caption"
          name="caption"
        />
      </Field>

      <Field
        label="Attach to progress update"
        htmlFor="progressUpdateId"
        error={state.fieldErrors?.progressUpdateId}
      >
        <select
          aria-invalid={Boolean(state.fieldErrors?.progressUpdateId)}
          className={selectClassName}
          defaultValue={values.progressUpdateId}
          id="progressUpdateId"
          name="progressUpdateId"
        >
          <option value="">Project screenshot only</option>
          {progressUpdates.map((update) => (
            <option key={update.id} value={update.id}>
              {update.title}
            </option>
          ))}
        </select>
        <p className="text-xs leading-5 text-muted-foreground">
          Optional. You can leave this as project-only evidence and attach it to
          a progress update later.
        </p>
      </Field>

      <div className="flex justify-end border-t border-border pt-5">
        <Button type="submit" disabled={pending}>
          {pending
            ? screenshot
              ? "Saving evidence"
              : "Uploading screenshot"
            : screenshot
              ? "Save screenshot"
              : "Upload screenshot"}
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
  screenshot: Screenshot | undefined,
  stateValues: Partial<ScreenshotFormStateValues> | undefined,
): ScreenshotFormStateValues {
  if (stateValues) {
    return {
      ...defaultScreenshotFormValues,
      ...stateValues,
    };
  }

  if (!screenshot) {
    return defaultScreenshotFormValues;
  }

  return {
    altText: screenshot.altText,
    caption: screenshot.caption ?? "",
    sortOrder: String(screenshot.sortOrder),
    progressUpdateId: screenshot.progressUpdateId ?? "",
  };
}

const selectClassName = cn(
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm",
  "outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
);
