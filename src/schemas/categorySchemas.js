import { z } from "zod";
import colorSchema from "./colorSchemas.js";

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
