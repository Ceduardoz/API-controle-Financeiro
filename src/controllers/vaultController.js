import { VaultService } from "../services/vaultServices.js";
import { createVaultSchema } from "../schemas/vaultSchemas.js";

export async function createVault(req, res) {
  try {
    const userId = req.userId;
    const data = createVaultSchema.parse(req.body);

    const vault = await VaultService(userId, data);
    return res.status(201).json(vault);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message || "Erro ao criar vault" });
  }
}
