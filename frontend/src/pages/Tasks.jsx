import React, { useEffect, useState } from "react";
import {
  ListTodo,
  Plus,
  Check,
  Calendar,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  FolderKanban,
  AlertCircle,
  Loader2
} from "lucide-react";
import { getProjects } from "@/services/project.service";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks
} from "@/services/task.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export default function Tasks() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Task form
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [targetProject, setTargetProject] = useState("none");
  const [addingTask, setAddingTask] = useState(false);

  // Edit Task modal
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projRes, taskRes] = await Promise.all([
        getProjects(),
        getTasks(selectedProjectId !== "all" ? { projectId: selectedProjectId } : {})
      ]);

      if (projRes?.success) {
        setProjects(projRes.data.projects || []);
        if (projRes.data.projects.length === 0) setTargetProject("none");
      }

      if (taskRes?.success) {
        setTasks(taskRes.data.tasks || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedProjectId]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert("Please enter a task title.");
      return;
    }

    try {
      setAddingTask(true);
      await createTask({
        title: newTitle.trim(),
        deadline: newDeadline || undefined,
        ...(targetProject !== "none" ? { projectId: targetProject } : {})
      });
      setNewTitle("");
      setNewDeadline("");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add task");
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
      loadData();
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tasks & Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Break projects down into trackable units and manually sequence your sprint order.
          </p>
        </div>

        {/* Filter by Project */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter:</span>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="h-10 w-48 rounded-2xl bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-slate-600 dark:text-slate-300">Completion Progress</span>
          <span className="text-purple-600 dark:text-purple-400">
            {completedCount} of {tasks.length} tasks completed ({progressPct}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-purple-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Add Task Box */}
      <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs">
        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Input
            placeholder="Add a new task or engineering milestone..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 h-11 flex-1 text-sm"
          />

          <Select value={targetProject} onValueChange={setTargetProject}>
            <SelectTrigger className="h-11 sm:w-44 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 text-xs">
              <SelectValue placeholder="Optional project" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="none">No project</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            className="rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 h-11 sm:w-40 text-xs"
          />

          <Button
            type="submit"
            disabled={addingTask}
            className="h-11 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-5 shrink-0 gap-1.5"
          >
            {addingTask ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Task
          </Button>
        </form>
      </div>

      {/* Task List */}
      <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        {loading ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-purple-600" />
            <span className="text-xs text-slate-400">Loading tasks...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-14 text-center text-slate-400">
            <ListTodo className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-sm font-semibold">No tasks found</p>
            <p className="text-xs text-slate-500 mt-1">
              Add your first task above to start tracking progress.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task, idx) => (
              <div
                key={task._id}
                className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                  task.completed
                    ? "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/40 dark:border-slate-800/40 opacity-60"
                    : "bg-white/90 dark:bg-slate-850/90 border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 shadow-xs"
                }`}
              >
                {/* Left: Checkbox + Title + Meta */}
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
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {task.projectId?.title || "Personal task"}
                      </span>
                      {task.deadline && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.deadline).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric"
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Manual Up/Down Reorder Controls + Edit + Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={selectedProjectId === "all" || idx === 0}
                    onClick={() => moveTask(idx, -1)}
                    title="Move Up in sprint"
                    className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={selectedProjectId === "all" || idx === tasks.length - 1}
                    onClick={() => moveTask(idx, 1)}
                    title="Move Down in sprint"
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
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
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

