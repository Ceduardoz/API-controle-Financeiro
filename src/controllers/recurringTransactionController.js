import {
  createRecurringTransaction as createRecurringTransactionService,
  getRecurringTransactions as getRecurringTransactionsService,
  getRecurringTransaction as getRecurringTransactionService,
  updateRecurringTransaction as updateRecurringTransactionService,
  deleteRecurringTransaction as deleteRecurringTransactionService,
  processRecurringTransactions as processRecurringTransactionsService,
} from "../services/recurringTransactionServices.js";
import {
  createRecurringTransactionSchema,
  updateRecurringTransactionSchema,
} from "../schemas/recurringTransactionSchemas.js";

export async function createRecurringTransaction(req, res) {
  try {
    const data = createRecurringTransactionSchema.parse(req.body);
    const recurringTransaction = await createRecurringTransactionService(
      req.userId,
      data,
    );

    return res.status(201).json(recurringTransaction);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao criar lançamento recorrente",
    });
  }
}

export async function getRecurringTransactions(req, res) {
  try {
    const recurringTransactions = await getRecurringTransactionsService(
      req.userId,
    );
    return res.status(200).json(recurringTransactions);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao listar lançamentos recorrentes",
    });
  }
}

export async function getRecurringTransaction(req, res) {
  try {
    const recurringTransaction = await getRecurringTransactionService(
      req.userId,
      req.params.id,
    );

    return res.status(200).json(recurringTransaction);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao buscar lançamento recorrente",
    });
  }
}

export async function updateRecurringTransaction(req, res) {
  try {
    const data = updateRecurringTransactionSchema.parse(req.body);

    const recurringTransaction = await updateRecurringTransactionService(
      req.userId,
      req.params.id,
      data,
    );

    return res.status(200).json(recurringTransaction);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao atualizar lançamento recorrente",
    });
  }
}

export async function deleteRecurringTransaction(req, res) {
  try {
    await deleteRecurringTransactionService(req.userId, req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao deletar lançamento recorrente",
    });
  }
}

export async function processRecurringTransactions(req, res) {
  try {
    const transactions = await processRecurringTransactionsService(req.userId);

    return res.status(200).json({
      message: "Processamento concluído",
      createdCount: transactions.length,
      transactions,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao processar lançamentos recorrentes",
    });
  }
}
