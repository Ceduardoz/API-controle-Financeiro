import { z } from "zod";

export const createTransactionSchema = z
  .object({
    title: z.string().min(2, "O título deve ter pelo menos 2 caracteres"),
    description: z.string().optional(),
    amount: z.number().positive("O valor deve ser maior que zero").optional(),
    type: z.enum(["INCOME", "EXPENSE", "TRANSFER", "RESERVE", "UNRESERVE"]),
    date: z.string(),
    accountId: z.number().int().positive().optional(),
    toAccountId: z.number().int().positive().optional(),
    categoryId: z.number().int().positive().optional(),
    goalId: z.number().int().positive().optional(),
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

    if (data.type === "RESERVE" || data.type === "UNRESERVE") {
      if (!data.accountId) {
        ctx.addIssue({
          code: "custom",
          path: ["accountId"],
          message: "A conta vinculada é obrigatória para acessar a caixinha",
        });
      }

      if (!data.goalId) {
        ctx.addIssue({
          code: "custom",
          path: ["goalId"],
          message: "A meta (caixinha) é obrigatória para essa operação",
        });
      }
    }
  });

export const updateTransactionSchema = z.object({
  title: z.string().min(1, "Título obrigatório").optional(),
  description: z.string().optional().nullable(),
  amount: z.coerce
    .number()
    .positive("O valor deve ser maior que zero")
    .optional(),
  type: z
    .enum(["INCOME", "EXPENSE", "TRANSFER", "RESERVE", "UNRESERVE"])
    .optional(),
  date: z.coerce.date().optional(),
  accountId: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().nullable().optional(),
  toAccountId: z.coerce.number().int().positive().nullable().optional(),
  // Adicionado goalId
  goalId: z.coerce.number().int().positive().nullable().optional(),
});
