import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { summary } from "../controllers/dashboardController.js";

const dashboardRouter = Router();

dashboardRouter.get("/", authMiddleware, summary);

export default dashboardRouter;
