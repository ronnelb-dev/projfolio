"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  normalizeOptionalId,
  parseSortOrder,
  screenshotMetadataSchema,
  type ScreenshotActionState,
  validateScreenshotFile,
  valuesFromFormData,
} from "@/lib/screenshots/validation";
import {
  CloudinaryConfigurationError,
  destroyCloudinaryImage,
  uploadScreenshotToCloudinary,
} from "@/lib/screenshots/cloudinary";

export async function createScreenshot(
  projectId: string,
  _previousState: ScreenshotActionState,
  formData: FormData,
): Promise<ScreenshotActionState> {
  const { profile } = await requireUser(`/projects/${projectId}`);
  const project = await getOwnedProject(projectId, profile.id);
  const rawValues = valuesFromFormData(formData);
  const parsed = screenshotMetadataSchema.safeParse(rawValues);
  const image = formData.get("image");
  const file = image instanceof File ? image : null;
  const imageError = validateScreenshotFile(file);

  if (!parsed.success || imageError || !file) {
    return {
      status: "error",
      fieldErrors: {
        ...(!parsed.success ? parsed.error.flatten().fieldErrors : {}),
        ...(imageError || !file
          ? { image: [imageError ?? "Choose a screenshot image."] }
          : {}),
      },
      values: rawValues,
    };
  }

  const progressUpdateId = normalizeOptionalId(parsed.data.progressUpdateId);

  if (progressUpdateId) {
    await getOwnedProgressUpdate({
      projectId: project.id,
      updateId: progressUpdateId,
      ownerId: profile.id,
    });
  }

  const nextSortOrder = await getNextScreenshotSortOrder(project.id);
  const sortOrder = parseSortOrder(parsed.data.sortOrder, nextSortOrder);
  let uploaded: Awaited<ReturnType<typeof uploadScreenshotToCloudinary>>;

  try {
    uploaded = await uploadScreenshotToCloudinary({
      file,
      projectId: project.id,
    });
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof CloudinaryConfigurationError
          ? "Cloudinary is not configured yet. Add the Cloudinary environment values, then try again."
          : "Screenshot upload failed. Try again with a PNG, JPG, or WebP image under 5MB.",
      values: rawValues,
    };
  }

  try {
    const screenshot = await prisma.screenshot.create({
      data: {
        projectId: project.id,
        progressUpdateId,
        cloudinaryPublicId: uploaded.publicId,
        url: uploaded.secureUrl,
        altText: parsed.data.altText,
        caption: parsed.data.caption || null,
        sortOrder,
      },
    });

    revalidateProject(project.id);

    return {
      status: "success",
      message: "Screenshot saved.",
      resetKey: screenshot.id,
    };
  } catch {
    await safelyDestroyUploadedImage(uploaded.publicId);

    return {
      status: "error",
      message: "Screenshot metadata could not be saved. The uploaded image was removed.",
      values: rawValues,
    };
  }
}

export async function updateScreenshot(
  projectId: string,
  screenshotId: string,
  _previousState: ScreenshotActionState,
  formData: FormData,
): Promise<ScreenshotActionState> {
  const { profile } = await requireUser(
    `/projects/${projectId}/screenshots/${screenshotId}/edit`,
  );
  const screenshot = await getOwnedScreenshot({
    projectId,
    screenshotId,
    ownerId: profile.id,
  });
  const rawValues = valuesFromFormData(formData);
  const parsed = screenshotMetadataSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: rawValues,
    };
  }

  const progressUpdateId = normalizeOptionalId(parsed.data.progressUpdateId);

  if (progressUpdateId) {
    await getOwnedProgressUpdate({
      projectId: screenshot.projectId,
      updateId: progressUpdateId,
      ownerId: profile.id,
    });
  }

  await prisma.screenshot.update({
    where: {
      id: screenshot.id,
    },
    data: {
      progressUpdateId,
      altText: parsed.data.altText,
      caption: parsed.data.caption || null,
      sortOrder: parseSortOrder(parsed.data.sortOrder, screenshot.sortOrder),
    },
  });

  revalidateProject(screenshot.projectId);
  redirect(`/projects/${screenshot.projectId}`);
}

export async function deleteScreenshot(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const screenshotId = String(formData.get("screenshotId") ?? "");
  const confirmed = String(formData.get("confirmDelete") ?? "") === "on";
  const { profile } = await requireUser(`/projects/${projectId}`);
  const screenshot = await getOwnedScreenshot({
    projectId,
    screenshotId,
    ownerId: profile.id,
  });

  if (!confirmed) {
    redirect(`/projects/${projectId}?screenshotDeleteError=${screenshot.id}`);
  }

  try {
    await destroyCloudinaryImage(screenshot.cloudinaryPublicId);
  } catch {
    redirect(`/projects/${projectId}?screenshotCloudinaryError=${screenshot.id}`);
  }

  await prisma.screenshot.delete({
    where: {
      id: screenshot.id,
    },
  });

  revalidateProject(projectId);
  redirect(`/projects/${projectId}`);
}

export async function getOwnedScreenshot({
  projectId,
  screenshotId,
  ownerId,
}: {
  projectId: string;
  screenshotId: string;
  ownerId: string;
}) {
  const screenshot = await prisma.screenshot.findFirst({
    where: {
      id: screenshotId,
      projectId,
      project: {
        ownerId,
      },
    },
  });

  if (!screenshot) {
    notFound();
  }

  return screenshot;
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

async function getOwnedProgressUpdate({
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
    select: {
      id: true,
    },
  });

  if (!update) {
    notFound();
  }

  return update;
}

async function getNextScreenshotSortOrder(projectId: string) {
  const aggregate = await prisma.screenshot.aggregate({
    where: {
      projectId,
    },
    _max: {
      sortOrder: true,
    },
  });

  return (aggregate._max.sortOrder ?? -1) + 1;
}

async function safelyDestroyUploadedImage(publicId: string) {
  try {
    await destroyCloudinaryImage(publicId);
  } catch {
    // The database write already failed. Keep the user-facing error focused on recovery.
  }
}

function revalidateProject(projectId: string) {
  revalidatePath("/dashboard");
  revalidatePath(`/projects/${projectId}`);
}
