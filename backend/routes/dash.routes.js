import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import getDashboardData from "../controllers/dashboard.controller.js";

const dashRouter = Router();

dashRouter.get('/', authUser, getDashboardData);

export default dashRouter;

