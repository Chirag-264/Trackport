import express from 'express';
import cors from 'cors';
import authRouter from '../routes/auth.routes.js';
import projectRouter from '../routes/project.routes.js';
import taskRouter from '../routes/task.routes.js';
import userRouter from '../routes/user.routes.js';
import integrationRouter from '../routes/integration.routes.js';
import dashboardRouter from '../routes/dash.routes.js';
import analyticsRouter from '../routes/analytics.routes.js';
import dsaRouter from '../routes/dsa.routes.js';
import passport from '../passport.js';


const app = express();

const allowedOrigins = new Set([
    (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, ''),
    'http://localhost:5173',
    'http://127.0.0.1:5173'
]);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) return callback(null, true);
        const error = new Error('Origin is not allowed by CORS');
        error.statusCode = 403;
        return callback(error);
    },
    credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(passport.initialize());

// API Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/users', userRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/dsa', dsaRouter);
app.use('/api/integrations', integrationRouter);


// 404 Not Found handler for unknown routes
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});

// Centralized Error-Handling Middleware
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    const statusCode = err.statusCode
        || err.status
        || (err.name === 'ValidationError' ? 400 : null)
        || (err.name === 'CastError' ? 400 : null)
        || (err.code === 11000 ? 409 : null)
        || (res.statusCode === 200 ? 500 : res.statusCode);
    const message = err.code === 11000
        ? 'A record with that value already exists'
        : err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export default app;
