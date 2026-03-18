import {
  createTransaction as createTransactionService,
  getTransactions as getTransactionsService,
  getTransaction as getTransactionService,
  updateTransaction as updateTransactionService,
  deleteTransaction as deleteTransactionService,
} from "../services/transactionServices.js";

import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../schemas/transactionSchemas.js";

export async function createTransaction(req, res, next) {
  try {
    const userId = req.userId;
    const data = createTransactionSchema.parse(req.body);

    const transaction = await createTransactionService(userId, data);

    return res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
}

export async function getTransactions(req, res, next) {
  try {
    const userId = req.userId;

    const transactions = await getTransactionsService(userId);

    return res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
}

export async function getTransaction(req, res, next) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const transaction = await getTransactionService(userId, id);

    return res.status(200).json(transaction);
  } catch (error) {
    next(error);
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

export async function deleteTransaction(req, res, next) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await deleteTransactionService(userId, id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
