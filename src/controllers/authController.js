import {
  registerUser,
  loginUser,
  getProfile,
} from "../services/authServices.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

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
