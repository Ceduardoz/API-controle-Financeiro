import { z } from "zod";

export const createTransactionSchema = z
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
