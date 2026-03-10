import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createRecurringTransaction,
  getRecurringTransactions,
  getRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  processRecurringTransactions,
} from "../controllers/recurringTransactionController.js";

const recurringTransactionRouter = Router();

recurringTransactionRouter.post(
  "/",
  authMiddleware,
  createRecurringTransaction,
);
recurringTransactionRouter.get("/", authMiddleware, getRecurringTransactions);
recurringTransactionRouter.get("/:id", authMiddleware, getRecurringTransaction);
recurringTransactionRouter.patch(
  "/:id",
  authMiddleware,
  updateRecurringTransaction,
);
recurringTransactionRouter.delete(
  "/:id",
  authMiddleware,
  deleteRecurringTransaction,
);
recurringTransactionRouter.post(
  "/process/run",
  authMiddleware,
  processRecurringTransactions,
);

export default recurringTransactionRouter;
