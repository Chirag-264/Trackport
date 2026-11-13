import express from 'express';
import cors from 'cors';
import authRouter from '../routes/auth.routes.js';
import projectRouter from '../routes/project.routes.js';
import taskRouter from '../routes/task.routes.js';
import userRouter from '../routes/user.routes.js';

import integrationRouter from '../routes/integration.routes.js';


const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/integrations', integrationRouter);


// 404 Not Found handler for unknown routes
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});

// Centralized Error-Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export default app;