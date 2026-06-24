import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'title is required.'],
        trim: true,
        maxlength: 200
    },

    deadline: {
        type: Date,
    },
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    completed: {
        type: Boolean,
        default: false,
        required: true
    }
}, {timestamps: true})

const Task = new mongoose.model('Task', taskSchema);

export default Task;