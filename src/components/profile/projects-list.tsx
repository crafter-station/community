import Link from "next/link";
import { ExternalLink, FolderOpen } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Project } from "@/db/schema";

type ProjectsListProps = {
  projects: Project[];
};

export function ProjectsList({ projects }: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
        <FolderOpen className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-lg font-medium text-muted-foreground">
          Sin proyectos aún
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Este builder no ha agregado proyectos todavía
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <Card key={project.id} className="group">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base">{project.title}</CardTitle>
                <CardDescription className="mt-1 line-clamp-2">
                  {project.description}
                </CardDescription>
              </div>
              {project.url && (
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
