"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { getAvailableProjectSlug } from "@/lib/projects/slug";
import {
  parseTechStack,
  projectFormSchema,
  ProjectStatus,
  type ProjectActionState,
  valuesFromFormData,
  Visibility,
} from "@/lib/projects/validation";

export async function createProject(
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const { profile } = await requireUser("/projects/new");
  const rawValues = valuesFromFormData(formData);
  const parsed = projectFormSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: rawValues,
    };
  }

  const slug = await getAvailableProjectSlug({
    ownerId: profile.id,
    preferredSlug: parsed.data.slug || parsed.data.title,
  });
  const project = await prisma.project.create({
    data: {
      ownerId: profile.id,
      title: parsed.data.title,
      slug,
      summary: parsed.data.summary,
      description: parsed.data.description || null,
      status: parsed.data.status,
      visibility: parsed.data.visibility,
      techStack: parseTechStack(parsed.data.techStack),
      repoUrl: parsed.data.repoUrl || null,
      liveDemoUrl: parsed.data.liveDemoUrl || null,
      isPublished: false,
    },
  });

  revalidatePath("/dashboard");
  redirect(`/projects/${project.id}`);
}

export async function updateProject(
  projectId: string,
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const { profile } = await requireUser(`/projects/${projectId}/edit`);
  const rawValues = valuesFromFormData(formData);
  const parsed = projectFormSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: rawValues,
    };
  }

  const existing = await getOwnedProject(projectId, profile.id);
  const slug = await getAvailableProjectSlug({
    ownerId: profile.id,
    preferredSlug: parsed.data.slug || parsed.data.title,
    existingProjectId: existing.id,
  });
  const isArchived = parsed.data.status === ProjectStatus.ARCHIVED;
  const isPublished =
    !isArchived && parsed.data.visibility === Visibility.PUBLIC && existing.isPublished;

  await prisma.project.update({
    where: {
      id: existing.id,
      ownerId: profile.id,
    },
    data: {
      title: parsed.data.title,
      slug,
      summary: parsed.data.summary,
      description: parsed.data.description || null,
      status: parsed.data.status,
      visibility: isArchived ? Visibility.PRIVATE : parsed.data.visibility,
      techStack: parseTechStack(parsed.data.techStack),
      repoUrl: parsed.data.repoUrl || null,
      liveDemoUrl: parsed.data.liveDemoUrl || null,
      isPublished,
      publishedAt: isPublished ? existing.publishedAt : null,
      archivedAt:
        isArchived ? (existing.archivedAt ?? new Date()) : null,
    },
  });

  revalidateProjectPaths(existing.id);
  redirect(`/projects/${existing.id}`);
}

export async function publishProject(formData: FormData) {
  const project = await requireOwnedProjectFromForm(formData, "/dashboard");

  await prisma.project.update({
    where: { id: project.id, ownerId: project.ownerId },
    data: {
      isPublished: true,
      visibility: Visibility.PUBLIC,
      publishedAt: project.publishedAt ?? new Date(),
      archivedAt: null,
      status:
        project.status === ProjectStatus.ARCHIVED ? ProjectStatus.BUILDING : project.status,
    },
  });

  revalidateProjectPaths(project.id);
}

export async function unpublishProject(formData: FormData) {
  const project = await requireOwnedProjectFromForm(formData, "/dashboard");

  await prisma.project.update({
    where: { id: project.id, ownerId: project.ownerId },
    data: {
      isPublished: false,
      visibility: Visibility.PRIVATE,
      publishedAt: null,
    },
  });

  revalidateProjectPaths(project.id);
}

export async function archiveProject(formData: FormData) {
  const project = await requireOwnedProjectFromForm(formData, "/dashboard");

  await prisma.project.update({
    where: { id: project.id, ownerId: project.ownerId },
    data: {
      status: ProjectStatus.ARCHIVED,
      archivedAt: new Date(),
      isPublished: false,
      visibility: Visibility.PRIVATE,
      publishedAt: null,
    },
  });

  revalidateProjectPaths(project.id);
}

export async function deleteProject(formData: FormData) {
  const project = await requireOwnedProjectFromForm(formData, "/dashboard");
  const confirmation = String(formData.get("confirmation") ?? "");

  if (confirmation !== project.title) {
    redirect(`/projects/${project.id}?deleteError=confirmation`);
  }

  await prisma.project.delete({
    where: { id: project.id, ownerId: project.ownerId },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

async function requireOwnedProjectFromForm(formData: FormData, nextPath: string) {
  const projectId = String(formData.get("projectId") ?? "");
  const { profile } = await requireUser(nextPath);

  return getOwnedProject(projectId, profile.id);
}

async function getOwnedProject(projectId: string, ownerId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId,
    },
  });

  if (!project) {
    notFound();
  }

  return project;
}

function revalidateProjectPaths(projectId: string) {
  revalidatePath("/dashboard");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/edit`);
}
