import { z } from "zod";

import { ProgressCategory, Visibility } from "@/generated/prisma/enums";

export type ProgressUpdateActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  resetKey?: string;
  fieldErrors?: Partial<Record<keyof ProgressUpdateFormStateValues, string[]>>;
  values?: Partial<ProgressUpdateFormStateValues>;
};

export type ProgressUpdateFormValues = z.infer<typeof progressUpdateFormSchema>;

export type ProgressUpdateFormStateValues = {
  category: string;
  title: string;
  content: string;
  visibility: string;
  occurredAt: string;
};

const progressCategories = [
  ProgressCategory.IDEA,
  ProgressCategory.DECISION,
  ProgressCategory.PROGRESS,
  ProgressCategory.TECHNICAL_NOTE,
  ProgressCategory.DEMO,
  ProgressCategory.LAUNCH,
] as const;

const visibilityOptions = [Visibility.PRIVATE, Visibility.PUBLIC] as const;

export const progressUpdateFormSchema = z.object({
  category: z.enum(progressCategories),
  title: z
    .string()
    .trim()
    .min(2, "Enter a progress update title.")
    .max(140, "Keep the title under 140 characters."),
  content: z
    .string()
    .trim()
    .min(10, "Write at least 10 characters of evidence.")
    .max(5000, "Keep the update under 5000 characters."),
  visibility: z.enum(visibilityOptions),
  occurredAt: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date."),
});

export const defaultProgressUpdateFormValues: ProgressUpdateFormStateValues = {
  category: ProgressCategory.PROGRESS,
  title: "",
  content: "",
  visibility: Visibility.PRIVATE,
  occurredAt: dateToInputValue(new Date()),
};

export function valuesFromFormData(formData: FormData): ProgressUpdateFormStateValues {
  return {
    category: String(formData.get("category") ?? ProgressCategory.PROGRESS),
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    visibility: String(formData.get("visibility") ?? Visibility.PRIVATE),
    occurredAt: String(formData.get("occurredAt") ?? dateToInputValue(new Date())),
  };
}

export function dateToInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function dateFromInputValue(value: string) {
  return new Date(`${value}T12:00:00.000Z`);
}

export function isProgressCategory(
  value: string | undefined,
): value is ProgressCategory {
  return Object.values(ProgressCategory).includes(value as ProgressCategory);
}

export function isVisibility(value: string | undefined): value is Visibility {
  return Object.values(Visibility).includes(value as Visibility);
}

export { ProgressCategory, Visibility };
