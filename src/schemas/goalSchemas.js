import { z } from "zod";

export const createGoalSchema = z.object({
  name: z.string().min(2, "O nome da meta deve ter pelo menos 2 caracteres"),
  description: z.string().optional().nullable(),
  targetAmount: z.number().positive("O valor da meta deve ser maior que zero"),
  accountId: z
    .number()
    .int()
    .positive("É necessário vincular a meta a uma conta"),
});

export const updateGoalSchema = z.object({
  name: z
    .string()
    .min(2, "O nome da meta deve ter pelo menos 2 caracteres")
    .optional(),
  description: z.string().optional().nullable(),
  targetAmount: z.coerce
    .number()
    .positive("O valor da meta deve ser maior que zero")
    .optional(),
});
