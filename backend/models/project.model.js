import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 100,
        required: [true, 'Project title is required!'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: ""
    },
    status: {
        type: String,
        enum: ["Planning", "In Progress", "Completed"],
        required: true,
        default: "Planning"
    },
    githubUrl: {
        type: String,
        trim: true,
        default: ""
    },
    liveUrl: {
        type: String,
        trim: true,
        default: ""
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
}, { timestamps: true });

projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ userId: 1, status: 1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;
