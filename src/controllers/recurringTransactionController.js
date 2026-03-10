import { z } from "zod";
import {
  createRecurringTransaction as createRecurringTransactionService,
  getRecurringTransactions as getRecurringTransactionsService,
  getRecurringTransaction as getRecurringTransactionService,
  updateRecurringTransaction as updateRecurringTransactionService,
  deleteRecurringTransaction as deleteRecurringTransactionService,
  processRecurringTransactions as processRecurringTransactionsService,
} from "../services/recurringTransactionServices.js";

const recurrenceFrequencyEnum = z.enum([
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
]);
const transactionTypeEnum = z.enum(["INCOME", "EXPENSE"]);

const createRecurringTransactionSchema = z
  .object({
    title: z.string().min(2),
    description: z.string().optional(),
    amount: z.coerce.number().positive(),
    type: transactionTypeEnum,
    frequency: recurrenceFrequencyEnum,
    dayOfMonth: z.coerce.number().int().min(1).max(31).optional(),
    dayOfWeek: z.coerce.number().int().min(0).max(6).optional(),
    monthOfYear: z.coerce.number().int().min(1).max(12).optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    isActive: z.boolean().optional(),
    accountId: z.coerce.number().int().positive(),
    categoryId: z.coerce.number().int().positive().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.frequency === "WEEKLY" && data.dayOfWeek === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["dayOfWeek"],
        message: "dayOfWeek é obrigatório para recorrência semanal",
      });
    }

    if (data.frequency === "MONTHLY" && data.dayOfMonth === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["dayOfMonth"],
        message: "dayOfMonth é obrigatório para recorrência mensal",
      });
    }

    if (data.frequency === "YEARLY") {
      if (data.dayOfMonth === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["dayOfMonth"],
          message: "dayOfMonth é obrigatório para recorrência anual",
        });
      }

      if (data.monthOfYear === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["monthOfYear"],
          message: "monthOfYear é obrigatório para recorrência anual",
        });
      }
    }
  });

const updateRecurringTransactionSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  amount: z.coerce.number().positive().optional(),
  type: transactionTypeEnum.optional(),
  frequency: recurrenceFrequencyEnum.optional(),
  dayOfMonth: z.coerce.number().int().min(1).max(31).optional(),
  dayOfWeek: z.coerce.number().int().min(0).max(6).optional(),
  monthOfYear: z.coerce.number().int().min(1).max(12).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  accountId: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
});

export async function createRecurringTransaction(req, res) {
  try {
    const data = createRecurringTransactionSchema.parse(req.body);
    const recurringTransaction = await createRecurringTransactionService(
      req.userId,
      data,
    );

    return res.status(201).json(recurringTransaction);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao criar lançamento recorrente",
    });
  }
}

export async function getRecurringTransactions(req, res) {
  try {
    const recurringTransactions = await getRecurringTransactionsService(
      req.userId,
    );
    return res.status(200).json(recurringTransactions);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao listar lançamentos recorrentes",
    });
  }
}

export async function getRecurringTransaction(req, res) {
  try {
    const recurringTransaction = await getRecurringTransactionService(
      req.userId,
      req.params.id,
    );

    return res.status(200).json(recurringTransaction);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao buscar lançamento recorrente",
    });
  }
}

export async function updateRecurringTransaction(req, res) {
  try {
    const data = updateRecurringTransactionSchema.parse(req.body);

    const recurringTransaction = await updateRecurringTransactionService(
      req.userId,
      req.params.id,
      data,
    );

    return res.status(200).json(recurringTransaction);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao atualizar lançamento recorrente",
    });
  }
}

export async function deleteRecurringTransaction(req, res) {
  try {
    await deleteRecurringTransactionService(req.userId, req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao deletar lançamento recorrente",
    });
  }
}

export async function processRecurringTransactions(req, res) {
  try {
    const transactions = await processRecurringTransactionsService(req.userId);

    return res.status(200).json({
      message: "Processamento concluído",
      createdCount: transactions.length,
      transactions,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao processar lançamentos recorrentes",
    });
  }
}
