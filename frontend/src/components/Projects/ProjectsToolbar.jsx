import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeading from "@/components/shared/PageHeading";

export default function ProjectsToolbar() {
  return (
    <PageHeading
      title="Projects"
      description="Manage and track all your projects in one place."
    >
      <div className="relative w-full sm:w-52">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects…"
          className="h-10 w-full rounded-xl border-border bg-background pl-9 shadow-soft"
        />
      </div>

      <Select defaultValue="all">
        <SelectTrigger className="h-10 w-full rounded-xl bg-background shadow-soft sm:w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="planned">Planned</SelectItem>
          <SelectItem value="planning">Planning</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="recent">
        <SelectTrigger className="h-10 w-full rounded-xl bg-background shadow-soft sm:w-32">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="commits">Commits</SelectItem>
          <SelectItem value="updated">Last Updated</SelectItem>
        </SelectContent>
      </Select>

      <Button className="h-10 gap-2 rounded-xl shadow-soft">
        <Plus className="h-4 w-4" />
        New Project
      </Button>
    </PageHeading>
  );
}
