import mongoose from 'mongoose';
import Project from '../models/project.model.js';
import Task from '../models/tasks.model.js';

async function createProject(req, res, next) {
    try {
        const { title, description, status, githubUrl, liveUrl, techStack } = req.body;
        const userId = req.user._id;

        if (!title || !title.trim()) {
            const error = new Error('Project title is required');
            error.statusCode = 400;
            return next(error);
        }

        const existingProject = await Project.findOne({
            title: title.trim(),
            userId
        });

        if (existingProject) {
            const error = new Error('You already have a project with this title');
            error.statusCode = 409;
            return next(error);
        }

        const formattedTechStack = Array.isArray(techStack)
            ? techStack.map(t => String(t).trim()).filter(Boolean)
            : typeof techStack === 'string'
                ? techStack.split(',').map(t => t.trim()).filter(Boolean)
                : [];

        const newProject = await Project.create({
            title: title.trim(),
            description: description ? description.trim() : '',
            status: status || 'Planning',
            githubUrl: githubUrl ? githubUrl.trim() : '',
            liveUrl: liveUrl ? liveUrl.trim() : '',
            techStack: formattedTechStack,
            userId
        });

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: {
                project: newProject
            }
        });
    } catch (err) {
        next(err);
    }
}

async function getProjects(req, res, next) {
    try {
        const userId = req.user._id;
        const { search, status, sortBy = 'createdAt', order = 'desc' } = req.query;

        const filter = { userId };

        if (status && status !== 'all') {
            filter.status = status;
        }

        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            filter.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { techStack: searchRegex }
            ];
        }

        const sortOptions = {};
        const sortDirection = order === 'asc' ? 1 : -1;
        if (sortBy === 'title') {
            sortOptions.title = sortDirection;
        } else if (sortBy === 'status') {
            sortOptions.status = sortDirection;
        } else {
            sortOptions.createdAt = sortDirection;
        }

        const projects = await Project.find(filter).sort(sortOptions).lean();

        // Attach task counts to each project efficiently
        const projectIds = projects.map(p => p._id);
        const taskAgg = await Task.aggregate([
            { $match: { projectId: { $in: projectIds } } },
            {
                $group: {
                    _id: '$projectId',
                    totalTasks: { $sum: 1 },
                    completedTasks: {
                        $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
                    }
                }
            }
        ]);

        const taskCountMap = {};
        taskAgg.forEach(item => {
            taskCountMap[item._id.toString()] = {
                totalTasks: item.totalTasks,
                completedTasks: item.completedTasks
            };
        });

        const projectsWithStats = projects.map(p => ({
            ...p,
            totalTasks: taskCountMap[p._id.toString()]?.totalTasks || 0,
            completedTasks: taskCountMap[p._id.toString()]?.completedTasks || 0
        }));

        res.status(200).json({
            success: true,
            data: {
                projects: projectsWithStats
            }
        });
    } catch (err) {
        next(err);
    }
}

async function getProject(req, res, next) {
    try {
        const projectId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            const error = new Error('Invalid project ID');
            error.statusCode = 400;
            return next(error);
        }

        const project = await Project.findById(projectId);
        if (!project) {
            const error = new Error('Project not found');
            error.statusCode = 404;
            return next(error);
        }

        if (!project.userId.equals(req.user._id)) {
            const error = new Error('Forbidden: You do not own this project');
            error.statusCode = 403;
            return next(error);
        }

        // Fetch associated tasks sorted by manual order
        const tasks = await Task.find({ projectId }).sort({ order: 1, createdAt: 1 });

        res.status(200).json({
            success: true,
            data: {
                project,
                tasks
            }
        });
    } catch (err) {
        next(err);
    }
}

async function updateProject(req, res, next) {
    try {
        const projectId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            const error = new Error('Invalid project ID');
            error.statusCode = 400;
            return next(error);
        }

        const project = await Project.findById(projectId);
        if (!project) {
            const error = new Error('Project not found');
            error.statusCode = 404;
            return next(error);
        }

        if (!project.userId.equals(req.user._id)) {
            const error = new Error('Forbidden: You do not own this project');
            error.statusCode = 403;
            return next(error);
        }

        const { title, description, status, githubUrl, liveUrl, techStack } = req.body;

        if (title !== undefined) {
            if (!title.trim()) {
                const error = new Error('Project title cannot be empty');
                error.statusCode = 400;
                return next(error);
            }

            const existingProject = await Project.findOne({
                title: title.trim(),
                userId: req.user._id,
                _id: { $ne: projectId }
            });

            if (existingProject) {
                const error = new Error('Another project already has this title');
                error.statusCode = 409;
                return next(error);
            }

            project.title = title.trim();
        }

        if (description !== undefined) {
            project.description = description.trim();
        }

        if (status !== undefined) {
            if (!['Planning', 'In Progress', 'Completed'].includes(status)) {
                const error = new Error('Invalid project status');
                error.statusCode = 400;
                return next(error);
            }
            project.status = status;
        }

        if (githubUrl !== undefined) {
            project.githubUrl = githubUrl.trim();
        }

        if (liveUrl !== undefined) {
            project.liveUrl = liveUrl.trim();
        }

        if (techStack !== undefined) {
            project.techStack = Array.isArray(techStack)
                ? techStack.map(t => String(t).trim()).filter(Boolean)
                : typeof techStack === 'string'
                    ? techStack.split(',').map(t => t.trim()).filter(Boolean)
                    : [];
        }

        await project.save();

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: {
                project
            }
        });
    } catch (err) {
        next(err);
    }
}

async function deleteProject(req, res, next) {
    try {
        const projectId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            const error = new Error('Invalid project ID');
            error.statusCode = 400;
            return next(error);
        }

        const project = await Project.findById(projectId);
        if (!project) {
            const error = new Error('Project not found');
            error.statusCode = 404;
            return next(error);
        }

        if (!project.userId.equals(req.user._id)) {
            const error = new Error('Forbidden: You do not own this project');
            error.statusCode = 403;
            return next(error);
        }

        // Cascade delete: Remove all tasks linked to this project
        await Task.deleteMany({ projectId });
        await project.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Project and all associated tasks deleted successfully',
            data: {
                project
            }
        });
    } catch (err) {
        next(err);
    }
}

export { createProject, getProjects, getProject, deleteProject, updateProject };