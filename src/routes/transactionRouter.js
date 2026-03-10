import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createTransaction,
  getTransactions,
  getTransaction,
} from "../controllers/transactionController.js";

const transactionRouter = Router();

transactionRouter.post("/", authMiddleware, createTransaction);
transactionRouter.get("/", authMiddleware, getTransactions);
transactionRouter.get("/:id", authMiddleware, getTransaction);

export default transactionRouter;
