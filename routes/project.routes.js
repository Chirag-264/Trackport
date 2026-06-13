import Router from 'express';
import { authUser } from '../middlewares/auth.middleware.js';
import { createProject, getProjects, getProject, deleteProject, updateProject } from '../controllers/project.controller.js';
const projectRouter = Router();

projectRouter.get('/projects', authUser, getProjects);

projectRouter.get('/projects/:id', authUser, getProject);

projectRouter.post('/projects', authUser, createProject);

projectRouter.put('/projects/:id', authUser, updateProject);

projectRouter.delete('/projects/:id', authUser, deleteProject);

export default projectRouter;