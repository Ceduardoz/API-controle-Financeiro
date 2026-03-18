import {
  createTransaction as createTransactionService,
  getTransactions as getTransactionsService,
  getTransaction as getTransactionService,
  updateTransaction as updateTransactionService,
} from "../services/transactionServices.js";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../schemas/transactionSchemas.js";

export async function createTransaction(req, res) {
  try {
    const data = createTransactionSchema.parse(req.body);

    const transaction = await createTransactionService(req.userId, data);

    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao criar transação",
    });
  }
}

export async function getTransactions(req, res) {
  try {
    const transactions = await getTransactionsService(req.userId);

    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao listar transações",
    });
  }
}

export async function getTransaction(req, res) {
  try {
    const transaction = await getTransactionService(req.userId, req.params.id);

    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao buscar transação",
    });
  }
}

export async function updateTransaction(req, res, next) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const data = updateTransactionSchema.parse(req.body);

    const transaction = await updateTransactionService(userId, id, data);

    return res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
}
