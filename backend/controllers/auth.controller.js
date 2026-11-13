import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

function generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function sanitizeUser(user) {
    return {
        _id: user._id,
        id: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
        college: user.college || '',
        branch: user.branch || '',
        graduationYear: user.graduationYear || null,
        githubUsername: user.githubUsername || '',
        leetcodeUsername: user.leetcodeUsername || '',
        codeforcesUsername: user.codeforcesUsername || '',
        createdAt: user.createdAt
    };
}

async function registerUser(req, res, next) {
    try {
        const { name, userName, email, password, college, branch, graduationYear, githubUsername, leetcodeUsername, codeforcesUsername } = req.body;

        if (!name || !userName || !email || !password) {
            const error = new Error('Name, username, email, and password are required');
            error.statusCode = 400;
            return next(error);
        }

        const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingEmail) {
            const error = new Error('An account with this email already exists');
            error.statusCode = 409;
            return next(error);
        }

        const existingUserName = await User.findOne({ userName: userName.toLowerCase().trim() });
        if (existingUserName) {
            const error = new Error('This username is already taken');
            error.statusCode = 409;
            return next(error);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name: name.trim(),
            userName: userName.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            college: college ? college.trim() : '',
            branch: branch ? branch.trim() : '',
            graduationYear: graduationYear ? Number(graduationYear) : undefined
        });

        const token = generateToken(newUser._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: sanitizeUser(newUser)
            }
        });
    } catch (err) {
        next(err);
    }
}

async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Email and password are required');
            error.statusCode = 400;
            return next(error);
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

        if (!user) {
            const error = new Error('No account found with this email');
            error.statusCode = 401;
            return next(error);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            return next(error);
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            data: {
                token,
                user: sanitizeUser(user)
            }
        });
    } catch (err) {
        next(err);
    }
}

async function getMe(req, res, next) {
    try {
        res.status(200).json({
            success: true,
            data: {
                user: sanitizeUser(req.user)
            }
        });
    } catch (err) {
        next(err);
    }
}

export { registerUser, loginUser, getMe };