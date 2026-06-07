import { z } from "zod";

export type ScreenshotActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  resetKey?: string;
  fieldErrors?: Partial<Record<keyof ScreenshotFormStateValues | "image", string[]>>;
  values?: Partial<ScreenshotFormStateValues>;
};

export type ScreenshotFormStateValues = {
  altText: string;
  caption: string;
  sortOrder: string;
  progressUpdateId: string;
};

export const screenshotMetadataSchema = z.object({
  altText: z
    .string()
    .trim()
    .min(3, "Describe what the screenshot shows.")
    .max(180, "Keep alt text under 180 characters."),
  caption: z
    .string()
    .trim()
    .max(240, "Keep the caption under 240 characters.")
    .optional(),
  sortOrder: z
    .string()
    .trim()
    .regex(/^\d*$/, "Use a whole number for sort order."),
  progressUpdateId: z.string().trim().optional(),
});

export const defaultScreenshotFormValues: ScreenshotFormStateValues = {
  altText: "",
  caption: "",
  sortOrder: "",
  progressUpdateId: "",
};

export const allowedImageTypes = ["image/png", "image/jpeg", "image/webp"] as const;
export const maxScreenshotSize = 5 * 1024 * 1024;

export function valuesFromFormData(formData: FormData): ScreenshotFormStateValues {
  return {
    altText: String(formData.get("altText") ?? ""),
    caption: String(formData.get("caption") ?? ""),
    sortOrder: String(formData.get("sortOrder") ?? ""),
    progressUpdateId: String(formData.get("progressUpdateId") ?? ""),
  };
}

export function parseSortOrder(value: string, fallback: number) {
  const trimmed = value.trim();

  if (!trimmed) {
    return fallback;
  }

  return Number.parseInt(trimmed, 10);
}

export function normalizeOptionalId(value: string | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

export function validateScreenshotFile(file: File | null) {
  if (!file || file.size === 0) {
    return "Choose a screenshot image.";
  }

  if (!allowedImageTypes.includes(file.type as (typeof allowedImageTypes)[number])) {
    return "Upload a PNG, JPG, or WebP image.";
  }

  if (file.size > maxScreenshotSize) {
    return "Keep screenshots under 5MB.";
  }

  return null;
}
