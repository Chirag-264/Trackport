import express from 'express';
import authRouter from '../routes/auth.routes.js';
import projectRouter from '../routes/project.routes.js';

const app = express();
app.use(express.json());

app.use('/', authRouter);
app.use('/', projectRouter);

export default app;