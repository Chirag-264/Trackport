import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/user.model.js'

export async function authUser(req, res, next) {

    try {
        const authHeader = req.headers.authorization || "";
        console.log(req.headers.authorization);
        if(!authHeader) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 401;
            throw error;
        }

        req.user = user;
        next();
    }

    catch(err) {
        res.status(401).json({
            success: false,
            message: err.message
        });
    }   

}