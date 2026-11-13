import CardSurface from "@/components/shared/CardSurface";
import CardHeading from "@/components/shared/CardHeading";
import ProjectRow, { ROW_GRID } from "./ProjectRow";
import { ProjectsTableFooter } from "./ProjectInsights";

export default function ProjectsTable({ projects }) {
  return (
    <CardSurface className="p-0">
      <div className="border-b border-border p-5">
        <CardHeading
          title="All Projects"
          description={`${projects.length} projects in your workspace`}
        />
      </div>

      <div
        className={`${ROW_GRID} border-b border-border px-5 py-2 text-caption font-medium uppercase tracking-wide text-muted-foreground max-md:hidden`}
      >
        <span className="sr-only">Icon</span>
        <span>Project</span>
        <span>Status</span>
        <span>Commits</span>
        <span>Files</span>
        <span>Updated</span>
        <span className="sr-only">Actions</span>
      </div>

      <div className="divide-y divide-border px-2 md:px-3">
        {projects.map((project) => (
          <ProjectRow key={project.name} project={project} />
        ))}
      </div>

      <div className="p-5">
        <ProjectsTableFooter />
      </div>
    </CardSurface>
  );
}
