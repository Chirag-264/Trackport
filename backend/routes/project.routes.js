import { Router } from 'express';
import { authUser } from '../middlewares/auth.middleware.js';
import {
    createProject,
    getProjects,
    getProject,
    deleteProject,
    updateProject,
    importGithubProjects
} from '../controllers/project.controller.js';

const projectRouter = Router();

projectRouter.use(authUser);

projectRouter.get('/', getProjects);
projectRouter.post('/', createProject);
projectRouter.post('/import/github', importGithubProjects);
projectRouter.get('/:id', getProject);
projectRouter.put('/:id', updateProject);
projectRouter.delete('/:id', deleteProject);

export default projectRouter;
