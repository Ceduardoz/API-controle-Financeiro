import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  create,
  list,
  show,
  remove,
} from "../controllers/investmentController.js";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, list);
router.get("/:id", authMiddleware, show);
router.delete("/:id", authMiddleware, remove);

export default router;
