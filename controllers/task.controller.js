import mongoose from "mongoose";
import Task from "../models/tasks.model.js";

async function createTask(req, res, next) {
    try {
        const {title, deadline} = req.body;
        const userId = req.user._id;

        const newTask = await Task.create({title, deadline, userId});
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: {
                task: newTask
            }
        })
    }

    catch(err) {
        next(err);
    }
}

async function getTasks(req, res, next) {
    try {
        const userId = req.user._id;
        const tasks = await Task.find({userId});

        res.status(200).json({
            success: true,
            data: tasks
        })
    }

    catch(err) {
        next(err);
    }
}

async function getTask(req, res, next) {
    try {
        const taskId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(taskId)) {
            const error = new Error('Invalid Task ID');
            error.statusCode = 400;
            throw error;
        }

        const task = await Task.findById(taskId);

        if(!task) {
            const error = new Error('No such task exists!');
            error.statusCode = 404;
            throw error;
        }

        if(!task.userId.equals(req.user._id)) {
            const error = new Error('Forbidden');
            error.statusCode = 403;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: task
        })
    }

    catch(err) {
        next(err);
    }
}

async function updateTask(req, res, next) {
    try{
        const {title, deadline, completed} = req.body;
        const taskId = req.params.id;
        
        if(!mongoose.Types.ObjectId.isValid(taskId)) {
            const error = new Error('Task ID is invalid!');
            error.statusCode = 400;
            throw error;
        }

        const task = await Task.findById(taskId);
        if(!task) {
            const error = new Error('No such task exists!');
            error.statusCode = 404;
            throw error;
        }

        if(!task.userId.equals(req.user._id)) {
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

        if(title !== undefined) {
            const existingTask = await Task.findOne({
                title, 
                userId: req.user._id
            })

            task.title = title;
        }

        if(deadline !== undefined) {
            task.deadline = deadline;
        }

        if(completed !== undefined) {
            task.completed = completed;
        }

        await task.save();

        res.status(200).json({
            success: true,
            message: 'Task updated successfullY!',
            data: task
        })
    }

    catch(err) {
        next(err);
    }
}

async function deleteTask(req, res, next) {
    try {
        const taskId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(taskId)) {
            const error = new Error('Task ID is invalid!');
            error.statusCode = 400;
            throw error;
        }

        const task = await Task.findById(taskId);
        if(!task) {
            const error = new Error('No such task exists!');
            error.statusCode = 404;
            throw error;
        }

        if(!task.userId.equals(req.user._id)) {
            const error = new Error('Forbidden!');
            error.statusCode = 403;
            throw error;
        }

        const deletedTask = await task.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully!',
            data: deletedTask
        })
    }

    catch(err) {
        next(err);
    }
}

export {createTask, getTasks, getTask, updateTask, deleteTask};