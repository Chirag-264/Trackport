import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Github,
  Globe,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit,
  Loader2,
  AlertCircle,
  ExternalLink,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from "@/services/project.service";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Sorting
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    status: "In Progress",
    techStack: "",
    githubUrl: "",
    liveUrl: ""
  });
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit Modal State
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "In Progress",
    techStack: "",
    githubUrl: "",
    liveUrl: ""
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete Modal State
  const [deletingProject, setDeletingProject] = useState(null);
  const [submittingDelete, setSubmittingDelete] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        search: search.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sortBy,
        order: sortOrder
      };
      const res = await getProjects(params);
      if (res?.success) {
        setProjects(res.data.projects || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, sortBy, sortOrder]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError("");
    if (!createForm.title.trim()) {
      setCreateError("Project title is required");
      return;
    }

    try {
      setSubmittingCreate(true);
      await createProject({
        ...createForm,
        techStack: createForm.techStack.split(",").map(t => t.trim()).filter(Boolean)
      });
      setIsCreateOpen(false);
      setCreateForm({
        title: "",
        description: "",
        status: "In Progress",
        techStack: "",
        githubUrl: "",
        liveUrl: ""
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
      setCreateError(err.response?.data?.message || err.message || "Failed to create project");
    } finally {
      setSubmittingCreate(false);
    }
  };

  const openEditModal = (p) => {
    setEditingProject(p);
    setEditForm({
      title: p.title,
      description: p.description || "",
      status: p.status,
      techStack: Array.isArray(p.techStack) ? p.techStack.join(", ") : "",
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || ""
    });
    setEditError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      setEditError("Project title is required");
      return;
    }

    try {
      setSubmittingEdit(true);
      await updateProject(editingProject._id, {
        ...editForm,
        techStack: editForm.techStack.split(",").map(t => t.trim()).filter(Boolean)
      });
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
      setEditError(err.response?.data?.message || err.message || "Failed to update project");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    try {
      setSubmittingDelete(true);
      await deleteProject(deletingProject._id);
      setDeletingProject(null);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete project");
    } finally {
      setSubmittingDelete(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            In Progress
          </span>
        );
      case "Planning":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Planning
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your personal engineering workspaces, tech stacks, and development milestones.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-11 px-5 gap-2 shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Toolbar: Search, Status Filter & Sorting */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3.5 rounded-[26px] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search projects by title, stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-[135px] rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 text-xs font-medium">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(val) => {
              const [by, ord] = val.split("-");
              setSortBy(by);
              setSortOrder(ord);
            }}
          >
            <SelectTrigger className="h-10 w-[145px] rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 text-xs font-medium">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-purple-600" />
          <p className="text-xs text-slate-400 font-medium">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-[28px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-center">
          <p className="text-sm font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchProjects} className="mt-3 rounded-xl">Retry</Button>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-[32px] bg-white/70 dark:bg-slate-900/70 border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
          <FolderKanban className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No projects found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || statusFilter !== "all"
              ? "No projects match your current filters. Try adjusting your query."
              : "Get started by adding your first project workspace!"}
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="mt-5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-10 px-5 gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {projects.map((p) => {
            const total = p.totalTasks || 0;
            const completed = p.completedTasks || 0;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={p._id}
                className="rounded-[28px] bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Link to={`/projects/${p._id}`}>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {p.title}
                        </h3>
                      </Link>
                      <div className="mt-2">{getStatusBadge(p.status)}</div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl w-44 p-1.5 shadow-xl">
                        <DropdownMenuItem asChild>
                          <Link to={`/projects/${p._id}`} className="cursor-pointer text-xs rounded-xl py-2">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-purple-600" />
                            Tasks & Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(p)} className="cursor-pointer text-xs rounded-xl py-2">
                          <Edit className="h-3.5 w-3.5 mr-2 text-slate-500" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingProject(p)}
                          className="cursor-pointer text-destructive focus:text-destructive text-xs rounded-xl py-2"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-3 leading-relaxed min-h-[34px]">
                    {p.description || "No description provided for this project."}
                  </p>

                  {/* Tech stack badges */}
                  {p.techStack && p.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                      {p.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Task Progress & Links Bottom Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-500 text-[11px]">Milestones</span>
                    <span className="text-slate-800 dark:text-slate-200 text-[11px]">
                      {completed} / {total} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="mt-3.5 flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="GitHub Repository"
                          className="hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Live Demo"
                          className="hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    <Link
                      to={`/projects/${p._id}`}
                      className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline"
                    >
                      Tasks
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="rounded-[32px] max-w-lg p-6">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Add a new workspace to track your progress and milestones.</DialogDescription>
          </DialogHeader>

          {createError && (
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{createError}</span>
            </div>
          )}

          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Title *</Label>
              <Input
                required
                placeholder="e.g. Distributed Task Queue"
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                className="rounded-2xl mt-1 h-11"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Description</Label>
              <textarea
                rows={3}
                placeholder="Brief summary of the goals and architecture..."
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                className="w-full rounded-2xl border border-input bg-transparent px-3 py-2 text-xs sm:text-sm shadow-xs outline-none focus:border-purple-500 mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Status</Label>
                <Select
                  value={createForm.status}
                  onValueChange={(val) => setCreateForm({ ...createForm, status: val })}
                >
                  <SelectTrigger className="rounded-2xl mt-1 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Tech Stack (comma-sep)</Label>
                <Input
                  placeholder="React, Redis, Node.js"
                  value={createForm.techStack}
                  onChange={(e) => setCreateForm({ ...createForm, techStack: e.target.value })}
                  className="rounded-2xl mt-1 h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">GitHub URL</Label>
                <Input
                  placeholder="https://github.com/..."
                  value={createForm.githubUrl}
                  onChange={(e) => setCreateForm({ ...createForm, githubUrl: e.target.value })}
                  className="rounded-2xl mt-1 h-11 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Live URL</Label>
                <Input
                  placeholder="https://..."
                  value={createForm.liveUrl}
                  onChange={(e) => setCreateForm({ ...createForm, liveUrl: e.target.value })}
                  className="rounded-2xl mt-1 h-11 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-2xl h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingCreate}
                className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-11 px-5"
              >
                {submittingCreate ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="rounded-[32px] max-w-lg p-6">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project details and status.</DialogDescription>
          </DialogHeader>

          {editError && (
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{editError}</span>
            </div>
          )}

          <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Title *</Label>
              <Input
                required
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="rounded-2xl mt-1 h-11"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Description</Label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full rounded-2xl border border-input bg-transparent px-3 py-2 text-xs sm:text-sm shadow-xs outline-none focus:border-purple-500 mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(val) => setEditForm({ ...editForm, status: val })}
                >
                  <SelectTrigger className="rounded-2xl mt-1 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Tech Stack</Label>
                <Input
                  value={editForm.techStack}
                  onChange={(e) => setEditForm({ ...editForm, techStack: e.target.value })}
                  className="rounded-2xl mt-1 h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">GitHub URL</Label>
                <Input
                  value={editForm.githubUrl}
                  onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                  className="rounded-2xl mt-1 h-11 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Live URL</Label>
                <Input
                  value={editForm.liveUrl}
                  onChange={(e) => setEditForm({ ...editForm, liveUrl: e.target.value })}
                  className="rounded-2xl mt-1 h-11 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingProject(null)}
                className="rounded-2xl h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingEdit}
                className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-11 px-5"
              >
                {submittingEdit ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={!!deletingProject} onOpenChange={(open) => !open && setDeletingProject(null)}>
        <DialogContent className="rounded-[32px] max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{deletingProject?.title}</strong>? All associated tasks will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingProject(null)}
              className="rounded-2xl h-11"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={submittingDelete}
              onClick={handleDeleteConfirm}
              className="rounded-2xl h-11"
            >
              {submittingDelete ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
