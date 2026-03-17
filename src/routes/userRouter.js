import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { updateUser, deleteUser } from "../controllers/userController.js";

const userRouter = Router();

userRouter.patch("/update", authMiddleware, updateUser);
userRouter.delete("/delete", authMiddleware, deleteUser);

export default userRouter;
