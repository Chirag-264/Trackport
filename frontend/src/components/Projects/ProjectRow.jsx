import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";

const ROW_GRID =
  "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 md:grid-cols-[auto_minmax(0,1fr)_100px_72px_64px_80px_36px] md:gap-4";

export default function ProjectRow({ project }) {
  const Icon = project.icon;

  return (
    <div
      className={cn(
        ROW_GRID,
        "group rounded-xl px-3 py-3 transition-colors hover:bg-background/60 md:px-4"
      )}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${project.iconTint}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-body font-medium">{project.name}</p>
        <p className="truncate text-caption text-muted-foreground">{project.description}</p>
      </div>

      <div className="hidden md:block">
        <StatusBadge status={project.status} />
      </div>
      <span className="hidden text-body tabular-nums text-muted-foreground md:block">
        {project.commits}
      </span>
      <span className="hidden text-body tabular-nums text-muted-foreground md:block">
        {project.files}
      </span>
      <span className="hidden text-caption text-muted-foreground md:block">{project.updated}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100 md:opacity-60"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Edit project</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="col-span-3 flex items-center justify-between gap-2 md:hidden">
        <StatusBadge status={project.status} />
        <span className="text-caption text-muted-foreground">{project.updated}</span>
      </div>
    </div>
  );
}

export { ROW_GRID };
