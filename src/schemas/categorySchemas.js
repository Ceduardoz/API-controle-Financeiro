import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").trim(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").trim(),
});
