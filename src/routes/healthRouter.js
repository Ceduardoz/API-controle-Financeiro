import { Router } from "express";

const healthRoutes = Router();

healthRoutes.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API Controle Financeiro está rodando | Documentação: /docs",
    timestamp: new Date().toISOString(),
  });
});

export default healthRoutes;
