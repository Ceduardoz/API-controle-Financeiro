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

export const depositWithdrawSchema = z.object({
  accountId: z.number().int("ID da conta inválido"),
  amount: z.number().positive("O valor deve ser maior que zero"),
  title: z.string().min(1, "O título da transferência é obrigatório"),
});

export const movementSchema = z.object({
  accountId: z.number().int(),
  amount: z.number().positive("O valor deve ser maior que zero"),
  title: z.string().min(1, "O título é obrigatório"),
});
