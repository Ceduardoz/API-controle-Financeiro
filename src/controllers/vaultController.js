import {
  createVaultServices,
  depositVaultServices,
  withdrawVaultServices,
  getVaultsService,
  deleteVaultService,
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
      .json({ error: error.message || "Erro ao criar cofre" });
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

export async function withdrawVault(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const data = depositWithdrawSchema.parse(req.body);

    const result = await withdrawVaultServices(userId, Number(id), data);
    return res.json({
      message: "Resgate realizado com sucesso!",
      ...result,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listVaults(req, res) {
  try {
    const userId = req.userId;
    const vaults = await getVaultsService(userId);
    return res.json(vaults);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao buscar a lista de caixinhas" });
  }
}

export async function deleteVault(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await deleteVaultService(userId, Number(id));

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
