import mongoose from 'mongoose';
import Project from '../models/project.model.js';
import Task from '../models/tasks.model.js';
import { getGithubRepositories } from '../services/github.service.js';

async function createProject(req, res, next) {
    try {
        const { title, description, status, githubUrl, liveUrl, techStack } = req.body;
        const userId = req.user._id;

        if (typeof title !== 'string' || !title.trim()) {
            const error = new Error('Project title is required');
            error.statusCode = 400;
            return next(error);
        }
        for (const [field, value] of Object.entries({ description, githubUrl, liveUrl })) {
            if (value !== undefined && typeof value !== 'string') {
                const error = new Error(`${field} must be text`);
                error.statusCode = 400;
                return next(error);
            }
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
        if (search !== undefined && typeof search !== 'string') {
            const error = new Error('Search must be a single text value');
            error.statusCode = 400;
            return next(error);
        }

        const filter = { userId };

        if (status && status !== 'all') {
            filter.status = status;
        }

        if (search && search.trim()) {
            const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const searchRegex = new RegExp(safeSearch, 'i');
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
        const tasks = await Task.find({ projectId, userId: req.user._id }).sort({ order: 1, createdAt: 1 });

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
            if (typeof title !== 'string' || !title.trim()) {
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

        if (description !== undefined && typeof description !== 'string') {
            const error = new Error('Description must be text');
            error.statusCode = 400;
            return next(error);
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

        if (githubUrl !== undefined && typeof githubUrl !== 'string') {
            const error = new Error('GitHub URL must be text');
            error.statusCode = 400;
            return next(error);
        }
        if (githubUrl !== undefined) {
            project.githubUrl = githubUrl.trim();
        }

        if (liveUrl !== undefined && typeof liveUrl !== 'string') {
            const error = new Error('Live URL must be text');
            error.statusCode = 400;
            return next(error);
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

async function importGithubProjects(req, res, next) {
    try {
        const selected = req.body?.repositories;
        if (!Array.isArray(selected) || selected.length === 0 || selected.length > 100
            || selected.some((name) => typeof name !== 'string' || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(name))) {
            const error = new Error('Choose between 1 and 100 valid GitHub repositories');
            error.statusCode = 400;
            return next(error);
        }

        const repositories = await getGithubRepositories(req.user.githubUsername);
        const selectedNames = new Set(selected.map((name) => name.toLowerCase()));
        const selectedRepos = repositories.filter((repo) => selectedNames.has(repo.fullName.toLowerCase()));
        const existing = await Project.find({ userId: req.user._id }).select('title githubUrl').lean();
        const existingUrls = new Set(existing.map((project) => project.githubUrl.trim().replace(/\/$/, '').toLowerCase()).filter(Boolean));
        const existingTitles = new Set(existing.map((project) => project.title.trim().toLowerCase()));
        const imports = [];
        let skipped = selected.length - selectedRepos.length;

        for (const repo of selectedRepos) {
            const repoUrl = repo.htmlUrl.replace(/\/$/, '');
            const titleKey = repo.name.trim().toLowerCase();
            if (existingUrls.has(repoUrl.toLowerCase()) || existingTitles.has(titleKey)) {
                skipped += 1;
                continue;
            }
            imports.push({
                title: repo.name,
                description: repo.description,
                status: 'In Progress',
                githubUrl: repoUrl,
                liveUrl: repo.homepage,
                techStack: repo.language ? [repo.language] : [],
                userId: req.user._id
            });
            existingUrls.add(repoUrl.toLowerCase());
            existingTitles.add(titleKey);
        }

        const imported = imports.length ? await Project.insertMany(imports) : [];
        res.status(201).json({
            success: true,
            data: {
                imported: imported.length,
                skipped,
                projects: imported
            }
        });
    } catch (error) {
        next(error);
    }
}

export { createProject, getProjects, getProject, deleteProject, updateProject, importGithubProjects };
