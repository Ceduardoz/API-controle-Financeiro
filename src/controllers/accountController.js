import { z } from "zod";
import {
  createAccount as createAccountServices,
  getAccounts as getAccountsServices,
  getAccount as getAccountServices,
  updateAccount as updateAccountServices,
  deleteAccount as deleteAccountServices,
} from "../services/accountServices.js";

const accountSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["CHECKING", "SAVINGS", "VAULT", "INVESTMENT"]),
  initialBalance: z.coerce.number(),
});

export async function createAccount(req, res) {
  try {
    const data = accountSchema.parse(req.body);

    const account = await createAccountServices(req.userId, data);

    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAccounts(req, res) {
  const accounts = await getAccountsServices(req.userId);
  res.json(accounts);
}

export async function getAccount(req, res) {
  const account = await getAccountServices(req.userId, req.params.id);
  res.json(account);
}

export async function updateAccount(req, res) {
  const data = accountSchema.partial().parse(req.body);

  const account = await updateAccountServices(req.userId, req.params.id, data);

  res.json(account);
}

export async function deleteAccount(req, res) {
  await deleteAccountServices(req.userId, req.params.id);

  res.status(204).send();
}
