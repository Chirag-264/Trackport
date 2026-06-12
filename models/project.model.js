import mongoose from "mongoose";
import User from "./user.model.js";

const projectSchema = new mongoose.Schema({

    title: {
        type: String,
        maxlength: 100,
        required: [true, 'Project name is required!'],
        trim: true
    },

    description: {
        type: String,
        trim: true,
        maxlength: 2000
    },

    status: {
        type: String,
        enum: ["Planning", "In Progress", "Completed"],
        required: true,
        default: "Planning"
    },

    githubUrl: {
        type: String,
        trim: true
    },

    liveUrl: {
        type: String,
        trim: true
    },

    techStack: {
        type: [String],
        default: []
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, {timestamps: true})

const Project = new mongoose.model("Project", projectSchema);

export default Project;
