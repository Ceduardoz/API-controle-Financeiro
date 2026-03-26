import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createVault } from "../controllers/vaultController.js";

const vaultrouter = Router();

vaultrouter.post("/", authMiddleware, createVault);

export default vaultrouter;
