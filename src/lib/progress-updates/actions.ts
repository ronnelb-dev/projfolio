"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  dateFromInputValue,
  progressUpdateFormSchema,
  type ProgressUpdateActionState,
  valuesFromFormData,
} from "@/lib/progress-updates/validation";

export async function createProgressUpdate(
  projectId: string,
  _previousState: ProgressUpdateActionState,
  formData: FormData,
): Promise<ProgressUpdateActionState> {
  const { profile } = await requireUser(`/projects/${projectId}`);
  const project = await getOwnedProject(projectId, profile.id);
  const rawValues = valuesFromFormData(formData);
  const parsed = progressUpdateFormSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: rawValues,
    };
  }

  const update = await prisma.progressUpdate.create({
    data: {
      projectId: project.id,
      category: parsed.data.category,
      title: parsed.data.title,
      content: parsed.data.content,
      visibility: parsed.data.visibility,
      occurredAt: dateFromInputValue(parsed.data.occurredAt),
    },
  });

  revalidateProject(project.id);

  return {
    status: "success",
    message: "Progress update saved.",
    resetKey: update.id,
  };
}

export async function updateProgressUpdate(
  projectId: string,
  updateId: string,
  _previousState: ProgressUpdateActionState,
  formData: FormData,
): Promise<ProgressUpdateActionState> {
  const { profile } = await requireUser(`/projects/${projectId}/updates/${updateId}/edit`);
  const existing = await getOwnedProgressUpdate({
    projectId,
    updateId,
    ownerId: profile.id,
  });
  const rawValues = valuesFromFormData(formData);
  const parsed = progressUpdateFormSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: rawValues,
    };
  }

  await prisma.progressUpdate.update({
    where: {
      id: existing.id,
    },
    data: {
      category: parsed.data.category,
      title: parsed.data.title,
      content: parsed.data.content,
      visibility: parsed.data.visibility,
      occurredAt: dateFromInputValue(parsed.data.occurredAt),
    },
  });

  revalidateProject(existing.projectId);
  redirect(`/projects/${existing.projectId}`);
}

export async function deleteProgressUpdate(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const updateId = String(formData.get("updateId") ?? "");
  const confirmed = String(formData.get("confirmDelete") ?? "") === "on";
  const { profile } = await requireUser(`/projects/${projectId}`);
  const update = await getOwnedProgressUpdate({
    projectId,
    updateId,
    ownerId: profile.id,
  });

  if (!confirmed) {
    redirect(`/projects/${projectId}?updateDeleteError=${update.id}`);
  }

  await prisma.progressUpdate.delete({
    where: {
      id: update.id,
    },
  });

  revalidateProject(projectId);
  redirect(`/projects/${projectId}`);
}

export async function getOwnedProject(projectId: string, ownerId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId,
    },
    select: {
      id: true,
      title: true,
      ownerId: true,
    },
  });

  if (!project) {
    notFound();
  }

  return project;
}

export async function getOwnedProgressUpdate({
  projectId,
  updateId,
  ownerId,
}: {
  projectId: string;
  updateId: string;
  ownerId: string;
}) {
  const update = await prisma.progressUpdate.findFirst({
    where: {
      id: updateId,
      projectId,
      project: {
        ownerId,
      },
    },
  });

  if (!update) {
    notFound();
  }

  return update;
}

function revalidateProject(projectId: string) {
  revalidatePath("/dashboard");
  revalidatePath(`/projects/${projectId}`);
}
