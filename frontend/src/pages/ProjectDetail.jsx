import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Check,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Github,
  Globe,
  Loader2,
  AlertCircle,
  FolderKanban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { getProject } from "@/services/project.service";
import {
  createTask,
  updateTask,
  deleteTask,
  reorderTasks
} from "@/services/task.service";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Task
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  // Edit Task
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getProject(id);
      if (res?.success) {
        setProject(res.data.project);
        setTasks(res.data.tasks || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load project details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setAddingTask(true);
      const res = await createTask({
        title: newTitle.trim(),
        deadline: newDeadline || undefined,
        projectId: id
      });
      if (res?.success) {
        setTasks((prev) => [...prev, res.data.task]);
        setNewTitle("");
        setNewDeadline("");
      }
    } catch (err) {
      alert("Failed to add task");
    } finally {
      setAddingTask(false);
    }
  };

  const handleToggleTask = async (task) => {
    const updated = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, completed: updated } : t))
    );

    try {
      await updateTask(task._id, { completed: updated });
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, completed: task.completed } : t))
      );
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDeadline(task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    try {
      setSubmittingEdit(true);
      const res = await updateTask(editingTask._id, {
        title: editTitle.trim(),
        deadline: editDeadline || null
      });
      if (res?.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? res.data.task : t))
        );
        setEditingTask(null);
      }
    } catch (err) {
      alert("Failed to update task");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const moveTask = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= tasks.length) return;

    const newTasks = [...tasks];
    const [moved] = newTasks.splice(index, 1);
    newTasks.splice(targetIndex, 0, moved);

    const reordered = newTasks.map((t, idx) => ({ ...t, order: idx }));
    setTasks(reordered);

    try {
      await reorderTasks(reordered.map((t) => ({ id: t._id, order: t.order })));
    } catch (err) {
      console.error(err);
      loadProject();
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-purple-600" />
        <p className="text-xs text-slate-400 font-medium">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <p className="text-sm font-semibold">{error || "Project not found"}</p>
        <Button asChild variant="outline" className="rounded-2xl">
          <Link to="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button link */}
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-1.5 rounded-2xl text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <Link to="/projects">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Project Overview Card */}
      <div className="rounded-[30px] bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {project.title}
              </h1>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {project.status}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              {project.description || "No description provided for this project."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {project.githubUrl && (
              <Button variant="outline" size="sm" asChild className="rounded-2xl gap-2 h-9 text-xs">
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  <Github className="h-3.5 w-3.5" />
                  GitHub
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button variant="outline" size="sm" asChild className="rounded-2xl gap-2 h-9 text-xs">
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  <Globe className="h-3.5 w-3.5" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-400 self-center mr-1">Stack:</span>
            {project.techStack.map((tech, i) => (
              <span
                key={i}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-500">Milestones Progress</span>
            <span className="text-purple-600 dark:text-purple-400">
              {completedCount} of {totalCount} completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task Management Section */}
      <div className="rounded-[30px] bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Project Tasks & Milestones</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control your task priority sequence manually with the Up and Down arrows.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">{tasks.length} tasks</span>
        </div>

        {/* Inline Add Task Box */}
        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-slate-50/80 dark:bg-slate-800/80 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          <Input
            placeholder="Add a new milestone or task for this project..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="bg-white dark:bg-slate-900 rounded-xl border-slate-200/80 dark:border-slate-700 h-10 flex-1 text-xs sm:text-sm"
          />
          <Input
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            className="bg-white dark:bg-slate-900 rounded-xl border-slate-200/80 dark:border-slate-700 h-10 sm:w-40 text-xs"
          />
          <Button
            type="submit"
            disabled={addingTask}
            className="rounded-xl h-10 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs gap-1.5 shrink-0"
          >
            {addingTask ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Task
          </Button>
        </form>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <FolderKanban className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No tasks created yet</p>
            <p className="text-xs text-slate-500 mt-1">Break this project down into small units above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task, idx) => {
              const isOverdue =
                task.deadline &&
                !task.completed &&
                new Date(task.deadline) < new Date(new Date().setHours(0, 0, 0, 0));

              return (
                <div
                  key={task._id}
                  className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                    task.completed
                      ? "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/40 dark:border-slate-800/40 opacity-60"
                      : "bg-white/90 dark:bg-slate-850/90 border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task)}
                      className={`h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                        task.completed
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "border-slate-300 dark:border-slate-600 hover:border-purple-600"
                      }`}
                    >
                      {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium truncate ${
                          task.completed ? "line-through text-slate-400" : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.deadline && (
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                          <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className={isOverdue ? "text-rose-500 font-semibold" : "text-slate-400"}>
                            {new Date(task.deadline).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                            {isOverdue && " (Overdue)"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Up / Down Controls + Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveTask(idx, -1)}
                      title="Move Up"
                      className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === tasks.length - 1}
                      onClick={() => moveTask(idx, 1)}
                      title="Move Down"
                      className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(task)}
                      title="Edit task"
                      className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task._id)}
                      title="Delete task"
                      className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Task Modal */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="rounded-[32px] max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the task title or deadline.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
            <div>
              <Label>Task Title</Label>
              <Input
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="rounded-xl mt-1"
              />
            </div>
            <div>
              <Label>Deadline</Label>
              <Input
                type="date"
                value={editDeadline}
                onChange={(e) => setEditDeadline(e.target.value)}
                className="rounded-xl mt-1"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditingTask(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={submittingEdit} className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white">
                {submittingEdit ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
