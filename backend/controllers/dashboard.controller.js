import mongoose from "mongoose";
import Project from "../models/project.model.js";
import Task from "../models/tasks.model.js";

async function dashboard(req, res, next) {
    try {
        const userId = req.user._id;
        const totalProjects = await Project.countDocuments({userId});
        const totalTasks = await Task.countDocuments({userId});
        const completedProjects = await Project.countDocuments({userId, status: "Completed"});
        const completedTasks = await Task.countDocuments({userId, completed: true});
        const pendingTasks = await Task.countDocuments({userId, completed: false});

        res.status(200).json({
            totalProjects,
            totalTasks,
            completedProjects,
            completedTasks,
            pendingTasks
        })
    }

    catch(err) {
        next(err);
    }
    
}

export default dashboard;