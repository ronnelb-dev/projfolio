import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ModuleEmptyState({
  icon: Icon,
  title,
  description,
  count,
  actionLabel,
  actionNote,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  count: number;
  actionLabel: string;
  actionNote: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-secondary/45 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold">{title}</h3>
              <Badge variant="outline">{count}</Badge>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <Button disabled variant="secondary" className="w-fit shrink-0">
          {actionLabel}
        </Button>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{actionNote}</p>
    </div>
  );
}
