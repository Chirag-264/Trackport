import { Timestamp } from 'mongodb';
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        trim: true,
        required: [true, 'Name is required']
    },
    userName: {
        type: String,
        minlength: 3,
        maxlength: 50,
        trim: true,
        unique: true,
        required: [true, 'Username is required'],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        trim: true,                                  
        lowercase: true,                               
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'password is required.'],
        Select: false
    },
    college: {
        type: String,
        trim: true
    },
    branch: {
        type: String,
        trim: true
    },
    graduationYear: {
        type: Number,
        min: 2020,
        max: 2035
    },
}, {timestamps: true})

const User = new mongoose.model('User', userSchema);
export default User;