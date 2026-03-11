import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/authRouter.js";
import accountRouter from "./routes/accountRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import transactionRouter from "./routes/transactionRouter.js";
import recurringTransactionRouter from "./routes/recurringTransactionRouter.js";
import investmentRouter from "./routes/investmentRouter.js";
import dashboardRouter from "./routes/dashboardRouter.js";
import { swaggerDocument, swaggerUi } from "./routes/swagger.js";

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
    this.app.use("/auth", authRouter);
    this.app.use("/account", accountRouter);
    this.app.use("/category", categoryRouter);
    this.app.use("/transactions", transactionRouter);
    this.app.use("/recurring-transaction", recurringTransactionRouter);
    this.app.use("/investments", investmentRouter);
    this.app.use("/dashboard", dashboardRouter);
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}

export default new App().app;
