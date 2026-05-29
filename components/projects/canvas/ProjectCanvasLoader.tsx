"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { ProjectCanvas as ProjectCanvasType } from "./ProjectCanvas";

// Dynamically import with ssr: false inside a client component — this is allowed
const ProjectCanvasInner = dynamic(
  () => import("./ProjectCanvas").then((m) => m.ProjectCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 animate-pulse">
        <div className="h-64 rounded-xl bg-muted/40" />
        <div className="h-48 rounded-xl bg-muted/40" />
        <div className="h-40 rounded-xl bg-muted/40" />
      </div>
    ),
  }
);

// Re-export with the same props interface so the server page stays clean
type Props = ComponentProps<typeof ProjectCanvasType>;

export function ProjectCanvasLoader(props: Props) {
  return <ProjectCanvasInner {...props} />;
}
