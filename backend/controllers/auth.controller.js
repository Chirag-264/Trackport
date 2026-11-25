import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

import {
    accessTokenResponse,
    createRefreshSession,
    revokeRefreshSession,
    rotateRefreshSession
} from '../utils/auth-session.js';
import sanitizeUser from '../utils/sanitize-user.js';

async function registerUser(req, res, next) {
    try {
        const { name, userName, email, password, college, branch, graduationYear, githubUsername, leetcodeUsername, codeforcesUsername } = req.body;

        if ([name, userName, email, password].some((value) => typeof value !== 'string' || !value.trim())) {
            const error = new Error('Name, username, email, and password are required');
            error.statusCode = 400;
            return next(error);
        }
        const normalizedUserName = userName.trim().toLowerCase();
        if (!/^[a-z0-9_]{3,30}$/.test(normalizedUserName)) {
            const error = new Error('Username must be 3–30 characters using letters, numbers, and underscores');
            error.statusCode = 400;
            return next(error);
        }
        if (password.length < 6 || Buffer.byteLength(password, 'utf8') > 72) {
            const error = new Error('Password must be at least 6 characters and no more than 72 UTF-8 bytes');
            error.statusCode = 400;
            return next(error);
        }

        const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingEmail) {
            const error = new Error('An account with this email already exists');
            error.statusCode = 409;
            return next(error);
        }

        const existingUserName = await User.findOne({ userName: normalizedUserName });
        if (existingUserName) {
            const error = new Error('This username is already taken');
            error.statusCode = 409;
            return next(error);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name: name.trim(),
            userName: normalizedUserName,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            college: college ? college.trim() : '',
            branch: branch ? branch.trim() : '',
            graduationYear: graduationYear ? Number(graduationYear) : undefined
        });

        const token = accessTokenResponse(newUser._id);
        await createRefreshSession(newUser._id, res);

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

        if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
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

        const token = accessTokenResponse(user._id);
        await createRefreshSession(user._id, res);

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

async function refreshSession(req, res, next) {
    try {
        const userId = await rotateRefreshSession(req, res);
        if (!userId) {
            const error = new Error('Refresh session is missing, expired, or already used');
            error.statusCode = 401;
            return next(error);
        }
        const user = await User.findById(userId);
        if (!user) {
            await revokeRefreshSession(req, res);
            const error = new Error('User not found');
            error.statusCode = 401;
            return next(error);
        }
        res.json({ success: true, data: { token: accessTokenResponse(user._id), user: sanitizeUser(user) } });
    } catch (err) {
        next(err);
    }
}

async function logoutUser(req, res, next) {
    try {
        await revokeRefreshSession(req, res);
        res.json({ success: true, message: 'Logged out successfully' });
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

export { registerUser, loginUser, getMe, refreshSession, logoutUser };
