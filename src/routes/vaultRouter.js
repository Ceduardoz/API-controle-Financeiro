import { Router } from "express";
import { createVault } from "../controllers/vaultController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const vaultRouter = Router();

vaultRouter.post("/", authMiddleware, createVault);

export default vaultRouter;
