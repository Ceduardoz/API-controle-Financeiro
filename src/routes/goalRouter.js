import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";

const goalRouter = Router();

goalRouter.post("/", authMiddleware, createGoal);
goalRouter.get("/", authMiddleware, getGoals);
goalRouter.get("/:id", authMiddleware, getGoal);
goalRouter.patch("/:id", authMiddleware, updateGoal);
goalRouter.delete("/:id", authMiddleware, deleteGoal);

export default goalRouter;
