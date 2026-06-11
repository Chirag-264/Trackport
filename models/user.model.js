import mongoose from 'mongoose'

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        min: 3,
        max: 50,
        trim: true,
        required: [true, 'Name is required']
    },
    userName: {
        type: String,
        min: 3,
        max: 50,
        trim: true,
        unique: true,
        required: [true, 'Username is required']
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
        //to be implemented
    },
    college: {
        type: String
        //rest to be implemented
    },
    branch: {
        type: String
        //rest to be implemented
    },
    graduationYear: {
        type: Number,
        //to be implemented
    },
    createdAt: {
        type: Date
        //rest to be implemented
    }
})

const User = new mongoose.model('User', userSchema);
export default User;