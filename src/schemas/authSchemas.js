import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("email inválido."),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

export const loginSchema = z.object({
  email: z.string().email("email inválido"),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});
