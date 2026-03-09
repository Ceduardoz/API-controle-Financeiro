import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
} from "../controllers/accountController.js";

const accountRouter = Router();

accountRouter.post("/", authMiddleware, createAccount);
accountRouter.get("/", authMiddleware, getAccounts);
accountRouter.get("/:id", authMiddleware, getAccount);
accountRouter.patch("/:id", authMiddleware, updateAccount);
accountRouter.delete("/:id", authMiddleware, deleteAccount);

export default accountRouter;
