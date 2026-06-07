import { z } from "zod";

import { FeatureStatus } from "@/generated/prisma/enums";

export type FeatureActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  resetKey?: string;
  fieldErrors?: Partial<Record<keyof FeatureFormStateValues, string[]>>;
  values?: Partial<FeatureFormStateValues>;
};

export type FeatureFormStateValues = {
  title: string;
  description: string;
  status: string;
  priority: string;
  completedAt: string;
};

const featureStatuses = [
  FeatureStatus.PLANNED,
  FeatureStatus.IN_PROGRESS,
  FeatureStatus.COMPLETED,
] as const;

export const featureFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Enter a feature title.")
    .max(140, "Keep the feature title under 140 characters."),
  description: z
    .string()
    .trim()
    .max(1000, "Keep the description under 1000 characters.")
    .optional(),
  status: z.enum(featureStatuses),
  priority: z
    .string()
    .trim()
    .regex(/^-?\d*$/, "Use a whole number for priority."),
  completedAt: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
      "Choose a valid completed date.",
    ),
});

export const defaultFeatureFormValues: FeatureFormStateValues = {
  title: "",
  description: "",
  status: FeatureStatus.PLANNED,
  priority: "0",
  completedAt: "",
};

export function valuesFromFormData(formData: FormData): FeatureFormStateValues {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? FeatureStatus.PLANNED),
    priority: String(formData.get("priority") ?? "0"),
    completedAt: String(formData.get("completedAt") ?? ""),
  };
}

export function parsePriority(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return 0;
  }

  return Number.parseInt(trimmed, 10);
}

export function dateToInputValue(date: Date | null) {
  if (!date) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function dateFromInputValue(value: string) {
  if (!value.trim()) {
    return null;
  }

  return new Date(`${value}T12:00:00.000Z`);
}

export function resolveCompletedAt({
  status,
  submittedDate,
  existingDate,
}: {
  status: FeatureStatus;
  submittedDate: string;
  existingDate?: Date | null;
}) {
  if (status !== FeatureStatus.COMPLETED) {
    return null;
  }

  return dateFromInputValue(submittedDate) ?? existingDate ?? new Date();
}

export function isFeatureStatus(
  value: string | undefined,
): value is FeatureStatus {
  return Object.values(FeatureStatus).includes(value as FeatureStatus);
}

export { FeatureStatus };
