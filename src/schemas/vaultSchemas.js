import { z } from "zod";

export const createVaultSchema = z.object({
  name: z.string().min(1, "Dê um nome para sua caixinha"),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .default("#946afc"),
  targetAmount: z.number().positive().optional(),
  targetDate: z.string().datetime().optional(),
});
