import { z } from "zod";

const recurrenceFrequencyEnum = z.enum([
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
]);
const transactionTypeEnum = z.enum(["INCOME", "EXPENSE"]);

export const createRecurringTransactionSchema = z
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

export const updateRecurringTransactionSchema = z.object({
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
