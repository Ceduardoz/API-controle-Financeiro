import {
  createVaultServices,
  depositVaultServices,
  withdrawVaultServices,
} from "../services/vaultServices.js";
import {
  createVaultSchema,
  depositWithdrawSchema,
} from "../schemas/vaultSchemas.js";

export async function createVault(req, res) {
  try {
    const userId = req.userId;
    const data = createVaultSchema.parse(req.body);

    const vault = await createVaultServices(userId, data);
    return res.status(201).json(vault);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message || "Erro ao criar vault" });
  }
}

export async function depositVault(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const data = depositWithdrawSchema.parse(req.body);

    const result = await depositVaultServices(userId, Number(id), data);
    return res.json({
      message: "Valor guardado com sucesso!",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
