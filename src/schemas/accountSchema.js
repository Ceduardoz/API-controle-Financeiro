import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["CHECKING", "SAVINGS", "VAULT", "INVESTMENT"]),
  initialBalance: z.coerce.number().nonnegative(),
});

export const updateAccountSchema = z.object({
  name: z.string().min(2).optional(),
  type: z.enum(["CHECKING", "SAVINGS", "VAULT", "INVESTMENT"]).optional(),
});
