import { z } from "zod";

const colorSchema = z
  .string()
  .regex(
    /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
    "A cor deve estar em formato HEX, ex: #FF5733",
  );

export const createCategorySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").trim(),
  categoryType: z.enum(["INCOME", "EXPENSE"]).nullable().optional(),
  color: colorSchema.optional(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .trim()
    .optional(),
  categoryType: z.enum(["INCOME", "EXPENSE"]).nullable().optional(),
  color: colorSchema.optional(),
});
