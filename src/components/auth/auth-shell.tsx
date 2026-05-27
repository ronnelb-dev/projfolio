import Link from "next/link";
import { ClipboardCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthShellProps = {
  title: string;
  description: string;
  eyebrow: string;
  children: React.ReactNode;
  footerCopy: string;
  footerHref: string;
  footerLabel: string;
};

export function AuthShell({
  title,
  description,
  eyebrow,
  children,
  footerCopy,
  footerHref,
  footerLabel,
}: AuthShellProps) {
  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground md:px-10">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="flex max-w-xl flex-col gap-8">
          <Link
            href="/"
            className="w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Projfolio
          </Link>
          <div className="space-y-4">
            <Badge variant="secondary" className="w-fit">
              Evidence Workbench
            </Badge>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-primary">{eyebrow}</p>
              <h1 className="max-w-[14ch] text-3xl font-semibold leading-tight md:text-4xl">
                {title}
              </h1>
              <p className="max-w-[58ch] text-base leading-7 text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-secondary/55 p-4">
              <ClipboardCheck className="mb-3 size-4 text-primary" aria-hidden="true" />
              <p className="font-medium text-foreground">Collect the proof</p>
              <p className="mt-1 leading-6">
                Keep screenshots, decisions, fixes, and updates tied to real projects.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/55 p-4">
              <Sparkles className="mb-3 size-4 text-primary" aria-hidden="true" />
              <p className="font-medium text-foreground">Shape it later</p>
              <p className="mt-1 leading-6">
                Turn messy progress into a credible case study when the work is ready.
              </p>
            </div>
          </div>
        </section>

        <section className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {children}
              <p className="text-sm text-muted-foreground">
                {footerCopy}{" "}
                <Link
                  href={footerHref}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {footerLabel}
                </Link>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
