import { Router } from "express";
import {
    getTask,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks
} from "../controllers/task.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const taskRouter = Router();

taskRouter.use(authUser);

taskRouter.get('/', getTasks);
taskRouter.post('/', createTask);
taskRouter.put('/reorder', reorderTasks);
taskRouter.get('/:id', getTask);
taskRouter.put('/:id', updateTask);
taskRouter.delete('/:id', deleteTask);

export default taskRouter;