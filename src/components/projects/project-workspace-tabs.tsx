import {
  Bug,
  CalendarDays,
  ScrollText,
  Sparkles,
} from "lucide-react";

import { FeatureForm } from "@/components/features/feature-form";
import { FeatureList } from "@/components/features/feature-list";
import { ModuleEmptyState } from "@/components/projects/module-empty-state";
import { ProgressUpdateForm } from "@/components/progress-updates/progress-update-form";
import { ProgressUpdateTimeline } from "@/components/progress-updates/progress-update-timeline";
import { ScreenshotForm } from "@/components/screenshots/screenshot-form";
import { ScreenshotGallery } from "@/components/screenshots/screenshot-gallery";
import type {
  ProjectEvidenceCounts,
  ProjectWorkspaceProject,
} from "@/components/projects/project-workspace-types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabItems = [
  { value: "overview", label: "Overview", countKey: null },
  { value: "updates", label: "Updates", countKey: "progressUpdates" },
  { value: "screenshots", label: "Screenshots", countKey: "screenshots" },
  { value: "features", label: "Features", countKey: "features" },
  { value: "bugs", label: "Bugs", countKey: "bugs" },
  { value: "changelog", label: "Changelog", countKey: "changelogReleases" },
  { value: "case-study", label: "Case Study", countKey: "caseStudy" },
] as const;

export function ProjectWorkspaceTabs({
  project,
  counts,
  screenshotCloudinaryErrorId,
  screenshotDeleteErrorId,
  updateDeleteErrorId,
  featureDeleteErrorId,
}: {
  project: ProjectWorkspaceProject;
  counts: ProjectEvidenceCounts;
  screenshotCloudinaryErrorId?: string;
  screenshotDeleteErrorId?: string;
  updateDeleteErrorId?: string;
  featureDeleteErrorId?: string;
}) {
  return (
    <Tabs defaultValue="overview" className="gap-4">
      <div className="overflow-x-auto pb-1">
        <TabsList className="w-max min-w-full justify-start">
          {tabItems.map((item) => (
            <TabsTrigger
              className="flex-none px-2.5"
              key={item.value}
              value={item.value}
            >
              {item.label}
              {item.countKey ? (
                <span className="rounded-full bg-background px-1.5 py-0 text-[0.7rem] text-muted-foreground">
                  {counts[item.countKey]}
                </span>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview">
        <OverviewPanel project={project} counts={counts} />
      </TabsContent>
      <TabsContent value="updates">
        <UpdatesPanel
          project={project}
          updateDeleteErrorId={updateDeleteErrorId}
        />
      </TabsContent>
      <TabsContent value="screenshots">
        <ScreenshotsPanel
          project={project}
          screenshotCloudinaryErrorId={screenshotCloudinaryErrorId}
          screenshotDeleteErrorId={screenshotDeleteErrorId}
        />
      </TabsContent>
      <TabsContent value="features">
        <FeaturesPanel
          featureDeleteErrorId={featureDeleteErrorId}
          project={project}
        />
      </TabsContent>
      <TabsContent value="bugs">
        <ModuleEmptyState
          icon={Bug}
          title="Bugs"
          description="This log will preserve debugging evidence, severity, status, and solution notes for problems worth remembering."
          count={counts.bugs}
          actionLabel="Log bug"
          actionNote="Bug tracking starts on Day 10."
        />
      </TabsContent>
      <TabsContent value="changelog">
        <ModuleEmptyState
          icon={ScrollText}
          title="Changelog"
          description="This section will group shipped changes into releases so progress can become readable public context later."
          count={counts.changelogReleases}
          actionLabel="Add release"
          actionNote="Changelog releases start on Day 11."
        />
      </TabsContent>
      <TabsContent value="case-study">
        <ModuleEmptyState
          icon={CalendarDays}
          title="Case study"
          description="This draft will turn project evidence into overview, problem, solution, decisions, lessons, and outcome sections."
          count={counts.caseStudy}
          actionLabel="Start draft"
          actionNote="The case study editor starts on Day 13."
        />
      </TabsContent>
    </Tabs>
  );
}

function FeaturesPanel({
  project,
  featureDeleteErrorId,
}: {
  project: ProjectWorkspaceProject;
  featureDeleteErrorId?: string;
}) {
  const completedFeatures = project.features.filter(
    (feature) => feature.status === "COMPLETED",
  ).length;

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Feature tracker</Badge>
            <Badge variant="outline">
              {completedFeatures} of {project.features.length} completed
            </Badge>
          </div>
          <CardTitle>Add feature evidence</CardTitle>
          <CardDescription>
            Track what the project is meant to prove without turning the work into
            a gamified checklist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeatureForm projectId={project.id} />
        </CardContent>
      </Card>

      <FeatureList
        deleteErrorId={featureDeleteErrorId}
        features={project.features}
        projectId={project.id}
      />
    </div>
  );
}

function ScreenshotsPanel({
  project,
  screenshotCloudinaryErrorId,
  screenshotDeleteErrorId,
}: {
  project: ProjectWorkspaceProject;
  screenshotCloudinaryErrorId?: string;
  screenshotDeleteErrorId?: string;
}) {
  const progressUpdateOptions = project.progressUpdates.map((update) => ({
    id: update.id,
    title: update.title,
  }));

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Screenshot evidence</Badge>
            <Badge variant="outline">{project.screenshots.length} screenshots</Badge>
          </div>
          <CardTitle>Upload visual proof</CardTitle>
          <CardDescription>
            Add screenshots that show what changed, shipped, or needed debugging.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScreenshotForm
            progressUpdates={progressUpdateOptions}
            projectId={project.id}
          />
        </CardContent>
      </Card>

      <ScreenshotGallery
        cloudinaryErrorId={screenshotCloudinaryErrorId}
        deleteErrorId={screenshotDeleteErrorId}
        projectId={project.id}
        screenshots={project.screenshots}
      />
    </div>
  );
}

function UpdatesPanel({
  project,
  updateDeleteErrorId,
}: {
  project: ProjectWorkspaceProject;
  updateDeleteErrorId?: string;
}) {
  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Progress timeline</Badge>
            <Badge variant="outline">{project.progressUpdates.length} updates</Badge>
          </div>
          <CardTitle>Add progress evidence</CardTitle>
          <CardDescription>
            Capture what changed, why it mattered, or which decision you made.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressUpdateForm projectId={project.id} />
        </CardContent>
      </Card>

      <ProgressUpdateTimeline
        deleteErrorId={updateDeleteErrorId}
        projectId={project.id}
        updates={project.progressUpdates}
      />
    </div>
  );
}

function OverviewPanel({
  project,
  counts,
}: {
  project: ProjectWorkspaceProject;
  counts: ProjectEvidenceCounts;
}) {
  const totalEvidence = counts.progressUpdates + counts.screenshots;
  const nextAction = getNextEvidenceAction(project);
  const completedFeatures = project.features.filter(
    (feature) => feature.status === "COMPLETED",
  ).length;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Workspace overview</Badge>
          <Badge variant="outline">{totalEvidence} evidence items</Badge>
        </div>
        <CardTitle>Private proof is taking shape</CardTitle>
        <CardDescription>
          Progress notes and screenshots are the live evidence in this workspace.
          Later modules stay marked until their roadmap slices arrive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border border-border bg-secondary/45 p-4">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
              <Sparkles className="size-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium">{nextAction.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {nextAction.description}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewMetric label="Updates" value={counts.progressUpdates} />
          <OverviewMetric label="Screenshots" value={counts.screenshots} />
          <OverviewMetric
            label="Features"
            value={
              project.features.length > 0
                ? `${completedFeatures}/${project.features.length}`
                : "None"
            }
          />
          <OverviewMetric label="Bugs" value="Upcoming" />
          <OverviewMetric label="Releases" value="Upcoming" />
          <OverviewMetric label="Case study" value={project.caseStudy ? "Draft" : "Upcoming"} />
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          Current evidence counts include progress updates and screenshots only.
          Upcoming modules remain visible so the workspace shape stays predictable.
        </p>
      </CardContent>
    </Card>
  );
}

function OverviewMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function getNextEvidenceAction(project: ProjectWorkspaceProject) {
  if (project.progressUpdates.length === 0) {
    return {
      title: "Capture the first progress update",
      description:
        "Start with what changed, why it mattered, or which decision you made while the context is still fresh.",
    };
  }

  if (project.screenshots.length === 0) {
    return {
      title: "Add visual proof",
      description:
        "Upload a screenshot that shows the work behind one of your progress notes.",
    };
  }

  const unattachedScreenshots = project.screenshots.filter(
    (screenshot) => !screenshot.progressUpdate,
  );

  if (unattachedScreenshots.length > 0) {
    return {
      title: "Connect screenshots to the timeline",
      description:
        "Attach loose screenshots to progress updates so the evidence reads as one story.",
    };
  }

  if (project.features.length === 0) {
    return {
      title: "Track the features this project proves",
      description:
        "Add the core functionality you are building so completed work can become clearer portfolio evidence.",
    };
  }

  const incompleteFeatures = project.features.filter(
    (feature) => feature.status !== "COMPLETED",
  );

  if (incompleteFeatures.length > 0) {
    return {
      title: "Move feature work toward proof",
      description:
        "Complete or update tracked features as they ship so the workspace shows what the project can actually do.",
    };
  }

  return {
    title: "Keep collecting proof",
    description:
      "Add the next update or screenshot whenever the project changes, ships, or teaches you something.",
  };
}
