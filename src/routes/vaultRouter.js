import { Router } from "express";
import {
  createVault,
  depositVault,
  withdrawVault,
  listVaults,
  deleteVault,
} from "../controllers/vaultController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const vaultRouter = Router();

vaultRouter.post("/", authMiddleware, createVault);
vaultRouter.post("/:id/deposit", authMiddleware, depositVault);
vaultRouter.post("/:id/withdraw", authMiddleware, withdrawVault);
vaultRouter.get("/", authMiddleware, listVaults);
vaultRouter.delete("/:id", authMiddleware, deleteVault);

export default vaultRouter;
