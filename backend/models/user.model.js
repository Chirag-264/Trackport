import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
        trim: true,
        required: [true, 'Name is required']
    },
    userName: {
        type: String,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        trim: true,
        unique: true,
        required: [true, 'Username is required'],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    college: {
        type: String,
        trim: true,
        default: ''
    },
    branch: {
        type: String,
        trim: true,
        default: ''
    },
    graduationYear: {
        type: Number,
        min: 2020,
        max: 2035
    },
    githubUsername: {
        type: String,
        trim: true,
        default: ''
    },
    leetcodeUsername: {
        type: String,
        trim: true,
        default: ''
    },
    codeforcesUsername: {
        type: String,
        trim: true,
        default: ''
    },
    googleId: {
        type: String,
        default: ''
    },
    githubId: {
        type: String,
        default: ''
    },
    dailyGoal: {
        type: Number,
        default: 2,
        min: 1
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;