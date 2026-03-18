import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { updateUser, deleteUser } from "../controllers/userController.js";

const userRouter = Router();

userRouter.patch("/", authMiddleware, updateUser);
userRouter.delete("/", authMiddleware, deleteUser);

export default userRouter;
