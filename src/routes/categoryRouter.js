import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const categoryRouter = Router();

categoryRouter.post("/", authMiddleware, createCategory);
categoryRouter.get("/", authMiddleware, getCategories);
categoryRouter.get("/:id", authMiddleware, getCategory);
categoryRouter.patch("/:id", authMiddleware, updateCategory);
categoryRouter.delete("/:id", authMiddleware, deleteCategory);

export default categoryRouter;
