import express from 'express';
import authRouter from '../routes/auth.routes.js';
import projectRouter from '../routes/project.routes.js';
import taskRouter from '../routes/task.routes.js';
import dashRouter from '../routes/dash.routes.js';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', authRouter);
app.use('/', projectRouter);
app.use('/', taskRouter);
app.use('/', dashRouter);

export default app;