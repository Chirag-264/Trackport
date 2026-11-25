import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/user.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

export async function authUser(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('Unauthorized: No or invalid authorization token provided');
            error.statusCode = 401;
            return next(error);
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            const error = new Error('Unauthorized: Token missing');
            error.statusCode = 401;
            return next(error);
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET, {
                issuer: 'trackport-api',
                audience: 'trackport-web'
            });
            if (decoded.type !== 'access') throw new Error('Token is not an access token');
        } catch (jwtErr) {
            const error = new Error('Unauthorized: Token is invalid or has expired');
            error.statusCode = 401;
            return next(error);
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            const error = new Error('Unauthorized: User not found');
            error.statusCode = 401;
            return next(error);
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}
