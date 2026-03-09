import { z } from "zod";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../services/authServices.js";

const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("email inválido."),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

const loginSchema = z.object({
  email: z.string().email("email inválido"),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

export async function register(req, res) {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    return res.status(201).json({
      message: "Usuário criado com sucesso",
      user,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Falha ao registrar o usuário",
    });
  }
}

export async function login(req, res) {
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data);

    return res.status(200).json({
      message: "Login bem sucedido",
      ...result,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Falha no login",
    });
  }
}

export async function profile(req, res) {
  try {
    const user = await getProfile(req.userId);

    return res.status(200).json(user);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Não foi possível encontrar o perfil.",
    });
  }
}
