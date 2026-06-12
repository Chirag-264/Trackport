import Router from 'express';
import { authUser } from '../middlewares/auth.middleware.js';
import { createProject, getProjects, getProject } from '../controllers/project.controller.js';
const projectRouter = Router();

projectRouter.get('/projects', authUser, getProjects);

projectRouter.get('/projects/:id', authUser, getProject);

projectRouter.post('/projects', authUser, createProject);

projectRouter.put('/projects/:id', authUser, //to be implemented
    );

projectRouter.delete('/projects/:id', authUser, //to be implemented
    );

export default projectRouter;