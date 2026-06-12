import mongoose from "mongoose";
import User from '../models/user.model.js'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import 'dotenv/config'

async function registerUser(req, res, next) {
    try {
        const {name, userName, email, password, college, branch, graduationYear} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser) {
            const error = new Error('User already exists!');
            error.statusCode = 409;
            throw error;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({name, userName, email, password: hashedPassword, college, branch, graduationYear});

        const token = jwt.sign({userId: newUsers[0]._id}, process.env.JWT_SECRET);

        res.status(201).json({
            success: true,
            message: 'User Created Successfully.',
            data: {
                token,
                user: newUser
            }
        });

    }

    catch(err) {
        next(err);
    }
    

}

async function loginUser(req, res, next) {
    try {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email}).select('+password');

        if(!existingUser) {
            const error = new Error('No account with this email exists. Please register before logging in.');
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if(!isMatch) {
            const error = new Error('Password is incorrect.');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId: existingUser._id}, process.env.JWT_SECRET);

        res.status(200).json({
            success: true,
            message: 'User Logged in Successfully',
            data: {
                token,
                User: {
                    userId: existingUser._id,
                    userName: existingUser.userName,
                    name: existingUser.name,
                    email: existingUser.email,
                    college: existingUser.college,
                    branch: existingUser.branch,
                    graduationYear: existingUser.graduationYear,
                }
            }
        })

    }

    catch(err) {
        next(err);
    }
}

export {registerUser, loginUser};