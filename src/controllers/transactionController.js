import { z } from "zod";
import {
  createTransaction as createTransactionService,
  getTransactions as getTransactionsService,
  getTransaction as getTransactionService,
} from "../services/transactionServices.js";

const createTransactionSchema = z
  .object({
    title: z.string().min(2, "O título deve ter pelo menos 2 caracteres"),
    description: z.string().optional(),
    amount: z.number().positive("O valor deve ser maior que zero"),
    type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
    date: z.string(),
    accountId: z.number().int().positive().optional(),
    toAccountId: z.number().int().positive().optional(),
    categoryId: z.number().int().positive().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "TRANSFER") {
      if (!data.accountId) {
        ctx.addIssue({
          code: "custom",
          path: ["accountId"],
          message: "Conta de origem é obrigatória para transferência",
        });
      }

      if (!data.toAccountId) {
        ctx.addIssue({
          code: "custom",
          path: ["toAccountId"],
          message: "Conta de destino é obrigatória para transferência",
        });
      }
    }

    if (
      (data.type === "INCOME" || data.type === "EXPENSE") &&
      !data.accountId
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["accountId"],
        message: "Conta é obrigatória para essa transação",
      });
    }
  });

export async function createTransaction(req, res) {
  try {
    const data = createTransactionSchema.parse(req.body);

    const transaction = await createTransactionService(req.userId, data);

    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao criar transação",
    });
  }
}

export async function getTransactions(req, res) {
  try {
    const transactions = await getTransactionsService(req.userId);

    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao listar transações",
    });
  }
}

export async function getTransaction(req, res) {
  try {
    const transaction = await getTransactionService(req.userId, req.params.id);

    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao buscar transação",
    });
  }
}
