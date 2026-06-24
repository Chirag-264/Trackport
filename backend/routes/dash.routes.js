import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import dashboard from "../controllers/dashboard.controller.js";

const dashRouter = new Router();

dashRouter.get('/dashboard', authUser, dashboard);

export default dashRouter;

