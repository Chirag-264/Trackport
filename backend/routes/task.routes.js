import { Router } from "express";
import { getTask, getTasks, createTask, updateTask, deleteTask } from "../controllers/task.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const taskRouter = new Router();

taskRouter.get('/tasks', authUser, getTasks);

taskRouter.get('/tasks/:id', authUser, getTask);

taskRouter.post('/tasks', authUser, createTask);

taskRouter.post('/tasks/:id', authUser, updateTask);

taskRouter.delete('/tasks/:id', authUser, deleteTask);

export default taskRouter;