import { prisma } from "@/lib/prisma";

export function normalizeProjectSlug(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "project";
}

export async function getAvailableProjectSlug({
  ownerId,
  preferredSlug,
  existingProjectId,
}: {
  ownerId: string;
  preferredSlug: string;
  existingProjectId?: string;
}) {
  const baseSlug = normalizeProjectSlug(preferredSlug);

  for (let suffix = 0; suffix < 100; suffix += 1) {
    const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix + 1}`;
    const existing = await prisma.project.findUnique({
      where: {
        ownerId_slug: {
          ownerId,
          slug,
        },
      },
      select: {
        id: true,
      },
    });

    if (!existing || existing.id === existingProjectId) {
      return slug;
    }
  }

  return `${baseSlug}-${Date.now().toString(36)}`;
}
