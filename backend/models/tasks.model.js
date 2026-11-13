import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    deadline: {
        type: Date,
        validate: {
            validator: function (value) {
                // Allow null or future dates only
                return !value || value > new Date();
            },
            message: 'Deadline cannot be in the past'
        }
    },
    // Tasks are now optional to a project; they can exist independently
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        // No required flag – independent tasks are allowed
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
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

taskSchema.index({ projectId: 1, order: 1 });
taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, deadline: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;