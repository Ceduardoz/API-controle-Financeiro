import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import index from "./routes/index.js";
import authRouter from "./routes/authRouter.js";
import accountRouter from "./routes/accountRouter.js";

class App {
  constructor() {
    this.app = express();
    this.middleware();
    this.router();
  }

  middleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  router() {
    this.app.use("/", index);
    this.app.use("/auth", authRouter);
    this.app.use("/account", accountRouter);
  }
}

export default new App().app;
