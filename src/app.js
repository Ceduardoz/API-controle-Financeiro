import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import index from "./routes/index.js";
import authRouter from "./routes/authRouter.js";
import accountRouter from "./routes/accountRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import transactionRouter from "./routes/transactionRouter.js";
import recurringTransactionRouter from "./routes/recurringTransactionRouter.js";

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
    this.app.use("/category", categoryRouter);
    this.app.use("/transactions", transactionRouter);
    this.app.use("/recurring-transaction", recurringTransactionRouter);
  }
}

export default new App().app;
