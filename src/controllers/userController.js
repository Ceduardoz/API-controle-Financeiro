import {
  updateUserService,
  deleteUserService,
} from "../services/userServices.js";
import { updateUserSchema } from "../schemas/userSchemas.js";

export async function updateUser(req, res) {
  try {
    const data = updateUserSchema.parse(req.body);

    const updatedUser = await updateUserService(req.userId, data);

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao atualizar o usuário",
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await deleteUserService(req.userId);

    return res.status(204).send(user);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao deletar usuário",
    });
  }
}
