import mongoose from 'mongoose';
import Project from '../models/project.model.js';

async function createProject(req, res, next) {
    try {
        const {title, description, status, githubUrl, liveUrl, techStack} = req.body;
        const userId = req.user._id;

        const existingProject = await Project.findOne({title, userId});
        if(existingProject) {
            const error = new Error('Project with this name already exists.');
            error.statusCode = 409;
            throw error;
        }

        const newProject = await Project.create({title, description, status, githubUrl, liveUrl, techStack, userId});

        res.status(201).json({
            success: true,
            message: "project created successfully",
            data: {
                project: newProject
            }
        })

    }
    catch (err) {
        next(err);
    }
}

async function getProjects(req, res, next) {
    try {
        const userId = req.user._id;
        const projects = await Project.find({userId});

        res.status(200).json({
            success: true,
            data: projects
        })
    }

    catch(err) {
        next(err);
    }
}

async function getProject(req, res, next) {
    try {
        const projectId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            const error = new Error("Invalid project ID");
            error.statusCode = 400;
            throw error;
        }
        const project = await Project.findOne({_id: projectId});

        if (!project) {
            throw new Error("Project not found");
        }

        if(!project.userId.equals(req.user._id)) {
            const error = new Error('Forbidden');
            error.statusCode = 403;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: {
                project
            }
        })
    }

    catch(err) {
        next(err);
    }
}

async function deleteProject(req, res, next) {
    try {
        const projectId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(projectId)) {
            const error = new Error('Project ID is not valid');
            error.statusCode = 400;
            throw error;
        }

        const project = await Project.findById(projectId);

        if (!project) {
            const error = new Error("Project not found");
            error.statusCode = 404;
            throw error;
        }

        if(!project.userId.equals(req.user._id)) {
            const error = new Error('Unauthorized');
            error.statusCode = 403;
            throw error;
        }

        await project.deleteOne();

        res.status(200).json({
            success: true,
            data: project
        });
    }
    catch(err) {
        next(err);
    }
}

async function updateProject(req, res, next) {
    try {
        const projectId = req.params.id;
        const {title, description, status, githubUrl, liveUrl, techStack} = req.body;
        
        if(!mongoose.Types.ObjectId.isValid(projectId)) {
            const error = new Error('Project ID is not valid');
            error.statusCode = 400;
            throw error;
        }

        const project = await Project.findById(projectId);

        if(!project) {
            const error = new Error('Project not found.');
            error.statusCode = 404;
            throw error;
        }

        if(!project.userId.equals(req.user._id)) {
            const error = new Error('Forbidden');
            error.statusCode = 403;
            throw error;
        }

        const updates = Object.keys(req.body);

        if (updates.length === 0) {
            const error = new Error("No update fields provided");
            error.statusCode = 400;
            throw error;
        }

        if (title !== undefined) {
            const existingProject = await Project.findOne({
                title,
                userId: req.user._id,
                _id: { $ne: projectId }
            });

            if (existingProject) {
                const error = new Error("Project title already exists");
                error.statusCode = 409;
                throw error;
            }

            project.title = title;
        }

        if(description !== undefined) {
            project.description = description;
        }

        if(status !== undefined) {
            project.status = status;
        }

        if(githubUrl!== undefined) {
            project.githubUrl = githubUrl;
        }

        if(liveUrl !== undefined) {
            project.liveUrl = liveUrl;
        }

        if(techStack !== undefined) {
            project.techStack = techStack;
        }

        await project.save();

        res.status(200).json({
            success: true,
            data: project
        })
    }

    catch(err) {
        next(err);
    }
}

export {createProject, getProjects, getProject, deleteProject, updateProject};