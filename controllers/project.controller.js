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

export {createProject, getProjects, getProject};