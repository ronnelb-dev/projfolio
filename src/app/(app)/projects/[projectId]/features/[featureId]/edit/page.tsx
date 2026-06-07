import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireUser } from "@/lib/auth/session";
import { getOwnedFeature } from "@/lib/features/actions";
import { FeatureForm } from "@/components/features/feature-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EditFeaturePageProps = {
  params: Promise<{
    projectId: string;
    featureId: string;
  }>;
};

export async function generateMetadata({
  params,
}: EditFeaturePageProps): Promise<Metadata> {
  const { projectId, featureId } = await params;
  const { profile } = await requireUser(
    `/projects/${projectId}/features/${featureId}/edit`,
  );
  const feature = await getOwnedFeature({
    projectId,
    featureId,
    ownerId: profile.id,
  });

  return {
    title: `Edit ${feature.title} | Projfolio`,
  };
}

export default async function EditFeaturePage({ params }: EditFeaturePageProps) {
  const { projectId, featureId } = await params;
  const { profile } = await requireUser(
    `/projects/${projectId}/features/${featureId}/edit`,
  );
  const feature = await getOwnedFeature({
    projectId,
    featureId,
    ownerId: profile.id,
  });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link href={`/projects/${projectId}`}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to project
        </Link>
      </Button>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl">Edit feature</CardTitle>
          <CardDescription>
            Keep the feature tracker aligned with what the project can actually
            prove.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeatureForm feature={feature} projectId={projectId} />
        </CardContent>
      </Card>
    </div>
  );
}
