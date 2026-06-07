import { Badge } from "@/components/ui/badge";
import {
  ProgressCategory,
  Visibility,
} from "@/lib/progress-updates/validation";

const categoryLabels: Record<ProgressCategory, string> = {
  IDEA: "Idea",
  DECISION: "Decision",
  PROGRESS: "Progress",
  TECHNICAL_NOTE: "Technical note",
  DEMO: "Demo",
  LAUNCH: "Launch",
};

const visibilityLabels: Record<Visibility, string> = {
  PRIVATE: "Private",
  PUBLIC: "Public",
};

export function ProgressCategoryBadge({
  category,
}: {
  category: ProgressCategory;
}) {
  return <Badge variant="secondary">{categoryLabels[category]}</Badge>;
}

export function ProgressVisibilityBadge({
  visibility,
}: {
  visibility: Visibility;
}) {
  return <Badge variant="outline">{visibilityLabels[visibility]}</Badge>;
}

export { categoryLabels, visibilityLabels };
