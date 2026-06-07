"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  FeatureStatus,
  featureFormSchema,
  parsePriority,
  resolveCompletedAt,
  type FeatureActionState,
  valuesFromFormData,
} from "@/lib/features/validation";

export async function createFeature(
  projectId: string,
  _previousState: FeatureActionState,
  formData: FormData,
): Promise<FeatureActionState> {
  const { profile } = await requireUser(`/projects/${projectId}`);
  const project = await getOwnedProject(projectId, profile.id);
  const rawValues = valuesFromFormData(formData);
  const parsed = featureFormSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: rawValues,
    };
  }

  const feature = await prisma.feature.create({
    data: {
      projectId: project.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      status: parsed.data.status,
      priority: parsePriority(parsed.data.priority),
      completedAt: resolveCompletedAt({
        status: parsed.data.status,
        submittedDate: parsed.data.completedAt,
      }),
    },
  });

  revalidateProject(project.id);

  return {
    status: "success",
    message: "Feature saved.",
    resetKey: feature.id,
  };
}

export async function updateFeature(
  projectId: string,
  featureId: string,
  _previousState: FeatureActionState,
  formData: FormData,
): Promise<FeatureActionState> {
  const { profile } = await requireUser(
    `/projects/${projectId}/features/${featureId}/edit`,
  );
  const existing = await getOwnedFeature({
    projectId,
    featureId,
    ownerId: profile.id,
  });
  const rawValues = valuesFromFormData(formData);
  const parsed = featureFormSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: rawValues,
    };
  }

  await prisma.feature.update({
    where: {
      id: existing.id,
    },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      status: parsed.data.status,
      priority: parsePriority(parsed.data.priority),
      completedAt: resolveCompletedAt({
        status: parsed.data.status,
        submittedDate: parsed.data.completedAt,
        existingDate: existing.completedAt,
      }),
    },
  });

  revalidateProject(existing.projectId);
  redirect(`/projects/${existing.projectId}`);
}

export async function updateFeatureStatus(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const featureId = String(formData.get("featureId") ?? "");
  const statusValue = String(formData.get("status") ?? "");
  const { profile } = await requireUser(`/projects/${projectId}`);
  const feature = await getOwnedFeature({
    projectId,
    featureId,
    ownerId: profile.id,
  });

  if (!Object.values(FeatureStatus).includes(statusValue as FeatureStatus)) {
    notFound();
  }

  const status = statusValue as FeatureStatus;

  await prisma.feature.update({
    where: {
      id: feature.id,
    },
    data: {
      status,
      completedAt:
        status === FeatureStatus.COMPLETED ? (feature.completedAt ?? new Date()) : null,
    },
  });

  revalidateProject(projectId);
}

export async function deleteFeature(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const featureId = String(formData.get("featureId") ?? "");
  const confirmed = String(formData.get("confirmDelete") ?? "") === "on";
  const { profile } = await requireUser(`/projects/${projectId}`);
  const feature = await getOwnedFeature({
    projectId,
    featureId,
    ownerId: profile.id,
  });

  if (!confirmed) {
    redirect(`/projects/${projectId}?featureDeleteError=${feature.id}`);
  }

  await prisma.feature.delete({
    where: {
      id: feature.id,
    },
  });

  revalidateProject(projectId);
  redirect(`/projects/${projectId}`);
}

export async function getOwnedFeature({
  projectId,
  featureId,
  ownerId,
}: {
  projectId: string;
  featureId: string;
  ownerId: string;
}) {
  const feature = await prisma.feature.findFirst({
    where: {
      id: featureId,
      projectId,
      project: {
        ownerId,
      },
    },
  });

  if (!feature) {
    notFound();
  }

  return feature;
}

async function getOwnedProject(projectId: string, ownerId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId,
    },
    select: {
      id: true,
      ownerId: true,
    },
  });

  if (!project) {
    notFound();
  }

  return project;
}

function revalidateProject(projectId: string) {
  revalidatePath("/dashboard");
  revalidatePath(`/projects/${projectId}`);
}
