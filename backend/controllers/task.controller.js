import mongoose from "mongoose";
import Task from "../models/tasks.model.js";
import Project from "../models/project.model.js";

async function createTask(req, res, next) {
    try {
        const { title, deadline, projectId } = req.body;
        const userId = req.user._id;

        if (!title || !title.trim()) {
            const error = new Error('Task title is required');
            error.statusCode = 400;
            return next(error);
        }

        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
            const error = new Error('A valid projectId is required');
            error.statusCode = 400;
            return next(error);
        }

        // Verify project exists and belongs to this user
        const project = await Project.findById(projectId);
        if (!project) {
            const error = new Error('Associated project not found');
            error.statusCode = 404;
            return next(error);
        }

        if (!project.userId.equals(userId)) {
            const error = new Error('Forbidden: You do not own this project');
            error.statusCode = 403;
            return next(error);
        }

        // Calculate next order value
        const lastTask = await Task.findOne({ projectId }).sort({ order: -1 });
        const nextOrder = lastTask && typeof lastTask.order === 'number' ? lastTask.order + 1 : 0;

        const newTask = await Task.create({
            title: title.trim(),
            deadline: deadline || undefined,
            projectId,
            userId,
            completed: false,
            order: nextOrder
        });

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: {
                task: newTask
            }
        });
    } catch (err) {
        next(err);
    }
}

async function getTasks(req, res, next) {
    try {
        const userId = req.user._id;
        const { projectId, completed } = req.query;

        const filter = { userId };

        if (projectId) {
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                const error = new Error('Invalid project ID');
                error.statusCode = 400;
                return next(error);
            }
            filter.projectId = projectId;
        }

        if (completed !== undefined) {
            filter.completed = completed === 'true';
        }

        const tasks = await Task.find(filter)
            .sort({ order: 1, createdAt: 1 })
            .populate('projectId', 'title status');

        res.status(200).json({
            success: true,
            data: {
                tasks
            }
        });
    } catch (err) {
        next(err);
    }
}

async function getTask(req, res, next) {
    try {
        const taskId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            const error = new Error('Invalid Task ID');
            error.statusCode = 400;
            return next(error);
        }

        const task = await Task.findById(taskId).populate('projectId', 'title status');
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            return next(error);
        }

        if (!task.userId.equals(req.user._id)) {
            const error = new Error('Forbidden: You do not own this task');
            error.statusCode = 403;
            return next(error);
        }

        res.status(200).json({
            success: true,
            data: {
                task
            }
        });
    } catch (err) {
        next(err);
    }
}

async function updateTask(req, res, next) {
    try {
        const taskId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            const error = new Error('Invalid Task ID');
            error.statusCode = 400;
            return next(error);
        }

        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            return next(error);
        }

        if (!task.userId.equals(req.user._id)) {
            const error = new Error('Forbidden: You do not own this task');
            error.statusCode = 403;
            return next(error);
        }

        const { title, deadline, completed, order } = req.body;

        if (title !== undefined) {
            if (!title.trim()) {
                const error = new Error('Task title cannot be empty');
                error.statusCode = 400;
                return next(error);
            }
            task.title = title.trim();
        }

        if (deadline !== undefined) {
            task.deadline = deadline ? new Date(deadline) : null;
        }

        if (completed !== undefined) {
            task.completed = Boolean(completed);
        }

        if (order !== undefined && typeof order === 'number') {
            task.order = order;
        }

        await task.save();

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: {
                task
            }
        });
    } catch (err) {
        next(err);
    }
}

async function deleteTask(req, res, next) {
    try {
        const taskId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            const error = new Error('Invalid Task ID');
            error.statusCode = 400;
            return next(error);
        }

        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            return next(error);
        }

        if (!task.userId.equals(req.user._id)) {
            const error = new Error('Forbidden: You do not own this task');
            error.statusCode = 403;
            return next(error);
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
            data: {
                task
            }
        });
    } catch (err) {
        next(err);
    }
}

async function reorderTasks(req, res, next) {
    try {
        const { tasks } = req.body; // Array of { id, order }
        if (!Array.isArray(tasks) || tasks.length === 0) {
            const error = new Error('Tasks array is required for reordering');
            error.statusCode = 400;
            return next(error);
        }

        const bulkOps = tasks.map(({ id, order }) => ({
            updateOne: {
                filter: { _id: id, userId: req.user._id },
                update: { $set: { order } }
            }
        }));

        await Task.bulkWrite(bulkOps);

        res.status(200).json({
            success: true,
            message: 'Tasks reordered successfully'
        });
    } catch (err) {
        next(err);
    }
}

export { createTask, getTasks, getTask, updateTask, deleteTask, reorderTasks };