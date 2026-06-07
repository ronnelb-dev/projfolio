import { z } from "zod";

import { ProjectStatus, Visibility } from "@/generated/prisma/enums";

export type ProjectActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ProjectFormStateValues, string[]>>;
  values?: Partial<ProjectFormStateValues>;
};

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type ProjectFormStateValues = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  status: string;
  visibility: string;
  techStack: string;
  repoUrl: string;
  liveDemoUrl: string;
};

const projectStatuses = [
  ProjectStatus.PLANNED,
  ProjectStatus.BUILDING,
  ProjectStatus.PAUSED,
  ProjectStatus.SHIPPED,
  ProjectStatus.ARCHIVED,
] as const;

const visibilityOptions = [Visibility.PRIVATE, Visibility.PUBLIC] as const;

const optionalUrlSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().url("Enter a valid URL.").optional(),
);

export const projectFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Enter a project title.")
    .max(120, "Keep the title under 120 characters."),
  slug: z
    .string()
    .trim()
    .max(80, "Keep the slug under 80 characters.")
    .optional(),
  summary: z
    .string()
    .trim()
    .min(10, "Write a short summary with at least 10 characters.")
    .max(240, "Keep the summary under 240 characters."),
  description: z
    .string()
    .trim()
    .max(2000, "Keep the description under 2000 characters.")
    .optional(),
  status: z.enum(projectStatuses),
  visibility: z.enum(visibilityOptions),
  techStack: z
    .string()
    .trim()
    .max(240, "Keep the tech stack list under 240 characters.")
    .optional(),
  repoUrl: optionalUrlSchema,
  liveDemoUrl: optionalUrlSchema,
});

export const defaultProjectFormValues: ProjectFormValues = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  status: ProjectStatus.BUILDING,
  visibility: Visibility.PRIVATE,
  techStack: "",
  repoUrl: undefined,
  liveDemoUrl: undefined,
};

export function valuesFromFormData(formData: FormData): ProjectFormStateValues {
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? ProjectStatus.BUILDING),
    visibility: String(formData.get("visibility") ?? Visibility.PRIVATE),
    techStack: String(formData.get("techStack") ?? ""),
    repoUrl: String(formData.get("repoUrl") ?? ""),
    liveDemoUrl: String(formData.get("liveDemoUrl") ?? ""),
  };
}

export function parseTechStack(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function techStackToInput(value: string[]) {
  return value.join(", ");
}

export { ProjectStatus, Visibility };
