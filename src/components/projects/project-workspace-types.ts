import type {
  Feature,
  ProgressUpdate,
  Project,
  Screenshot,
} from "@/generated/prisma/client";

export type ProjectEvidenceCounts = {
  progressUpdates: number;
  screenshots: number;
  features: number;
  bugs: number;
  changelogReleases: number;
  caseStudy: number;
};

export type ProjectWorkspaceProject = Project & {
  _count: {
    progressUpdates: number;
    screenshots: number;
    features: number;
    bugs: number;
    changelogReleases: number;
  };
  caseStudy: {
    id: string;
  } | null;
  progressUpdates: TimelineProgressUpdate[];
  screenshots: ProjectScreenshot[];
  features: ProjectFeature[];
};

export type TimelineScreenshot = Pick<
  Screenshot,
  "id" | "url" | "altText" | "caption" | "sortOrder" | "createdAt"
>;

export type TimelineProgressUpdate = ProgressUpdate & {
  screenshots: TimelineScreenshot[];
};

export type ProjectScreenshot = Screenshot & {
  progressUpdate: {
    id: string;
    title: string;
  } | null;
};

export type ProjectFeature = Feature;

export function getProjectEvidenceCounts(
  project: ProjectWorkspaceProject,
): ProjectEvidenceCounts {
  return {
    progressUpdates: project._count.progressUpdates,
    screenshots: project._count.screenshots,
    features: project._count.features,
    bugs: project._count.bugs,
    changelogReleases: project._count.changelogReleases,
    caseStudy: project.caseStudy ? 1 : 0,
  };
}
