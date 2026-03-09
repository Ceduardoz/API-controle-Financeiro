import { Router } from "express";
import { login, register, profile } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", authMiddleware, profile);

export default authRoutes;
