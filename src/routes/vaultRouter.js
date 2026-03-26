import { Router } from "express";
import {
  createVault,
  depositVault,
  withdrawVault,
} from "../controllers/vaultController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const vaultRouter = Router();

vaultRouter.post("/", authMiddleware, createVault);
vaultRouter.post("/:id/deposit", authMiddleware, depositVault);

export default vaultRouter;
