import { ArrowRight, CheckCircle2, Database, ImageIcon, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const setupItems = [
  {
    icon: Shield,
    label: "Supabase Auth",
    detail: "SSR utilities are prepared for Day 3 auth screens.",
  },
  {
    icon: Database,
    label: "Prisma + Postgres",
    detail: "The Day 1 schema draft is captured in Prisma.",
  },
  {
    icon: ImageIcon,
    label: "Cloudinary",
    detail: "Screenshot storage environment keys are documented.",
  },
];

export default function Home() {
  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground md:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Projfolio</p>
            <p className="text-sm text-muted-foreground">Day 2 setup foundation</p>
          </div>
          <Badge variant="secondary">Evidence Workbench</Badge>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.4fr_0.8fr] md:items-stretch">
          <Card className="border-border bg-card">
            <CardHeader className="gap-4">
              <Badge className="w-fit">Setup ready</Badge>
              <div className="space-y-3">
                <CardTitle className="max-w-2xl text-3xl leading-tight md:text-4xl">
                  Turn development progress into organized proof of work.
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-7">
                  This is the Projfolio app foundation: Next.js App Router,
                  TypeScript, Tailwind, shadcn/ui, Prisma, Supabase helpers, and
                  Cloudinary configuration placeholders.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <Separator />
              <div className="grid gap-3 sm:grid-cols-3">
                {["Create project", "Add evidence", "Publish case study"].map(
                  (item) => (
                    <div
                      className="rounded-lg border border-border bg-secondary/45 p-4 text-sm font-medium"
                      key={item}
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
              <div>
                <Button>
                  Day 3 can build auth next
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xl">Locked decisions</CardTitle>
              <CardDescription>
                These choices come from the Day 1 product lock.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {setupItems.map((item) => (
                <div className="flex gap-3" key={item.label}>
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                    <item.icon className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <p>
                  No auth UI, uploads, CRUD, protected routes, or public project
                  pages are implemented on Day 2.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
