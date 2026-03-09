import { Router } from "express";

import authRoutes from "./authRouter.js";

const router = Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "API rodando normalmente",
  });
});

export default router;
