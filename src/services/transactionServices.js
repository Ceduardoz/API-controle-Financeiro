import prisma from "../lib/prisma.js";
import { calculateAvailableBalance } from "../utils/calculateAccountBalance.js";

export async function createTransaction(userId, data) {
  return prisma.$transaction(async (tx) => {
    const amount = Number(data.amount);

    if (amount <= 0) {
      const error = new Error("O valor da transação deve ser maior que zero");
      error.statusCode = 400;
      throw error;
    }

    // --- 1. LÓGICA DE TRANSFERÊNCIA ENTRE CONTAS ---
    if (data.type === "TRANSFER") {
      if (!data.accountId || !data.toAccountId) {
        const error = new Error(
          "Transferência exige conta de origem e destino",
        );
        error.statusCode = 400;
        throw error;
      }

      if (Number(data.accountId) === Number(data.toAccountId)) {
        const error = new Error(
          "A conta de origem e destino devem ser diferentes",
        );
        error.statusCode = 400;
        throw error;
      }

      const fromAccount = await tx.account.findFirst({
        where: { id: Number(data.accountId), userId },
        include: { outgoingTransactions: true, incomingTransactions: true },
      });

      const toAccount = await tx.account.findFirst({
        where: { id: Number(data.toAccountId), userId },
        include: { outgoingTransactions: true, incomingTransactions: true },
      });

      if (!fromAccount || !toAccount) {
        const error = new Error("Conta de origem ou destino não encontrada");
        error.statusCode = 404;
        throw error;
      }

      // Transferência usa o Saldo Disponível (não pode transferir o que tá no cofre)
      const fromAccountAvailableBalance =
        calculateAvailableBalance(fromAccount);

      if (fromAccountAvailableBalance < amount) {
        const error = new Error(
          "Saldo disponível insuficiente para transferência",
        );
        error.statusCode = 400;
        throw error;
      }

      return await tx.transaction.create({
        data: {
          title: data.title,
          description: data.description,
          amount,
          type: data.type,
          date: new Date(data.date),
          userId,
          accountId: Number(data.accountId),
          toAccountId: Number(data.toAccountId),
          categoryId: null,
          goalId: null,
        },
      });
    }

    // --- 2. LÓGICA DE CAIXINHA (GUARDAR E RESGATAR) ---
    if (data.type === "RESERVE" || data.type === "UNRESERVE") {
      if (!data.accountId || !data.goalId) {
        const error = new Error(
          "Essa operação exige a seleção de uma conta e de uma meta (caixinha).",
        );
        error.statusCode = 400;
        throw error;
      }

      const account = await tx.account.findFirst({
        where: { id: Number(data.accountId), userId },
        include: { outgoingTransactions: true, incomingTransactions: true },
      });

      const goal = await tx.goal.findFirst({
        where: { id: Number(data.goalId), accountId: Number(data.accountId) },
      });

      if (!account || !goal) {
        const error = new Error("Conta ou Meta não encontrada.");
        error.statusCode = 404;
        throw error;
      }

      const availableBalance = calculateAvailableBalance(account);

      if (data.type === "RESERVE") {
        if (availableBalance < amount) {
          const error = new Error(
            "Saldo disponível insuficiente para guardar esse valor.",
          );
          error.statusCode = 400;
          throw error;
        }

        await tx.goal.update({
          where: { id: goal.id },
          data: { currentAmount: { increment: amount } },
        });

        await tx.account.update({
          where: { id: account.id },
          data: { reservedBalance: { increment: amount } },
        });
      } else if (data.type === "UNRESERVE") {
        if (Number(goal.currentAmount) < amount) {
          const error = new Error(
            "Você não tem esse valor guardado nesta meta para resgatar.",
          );
          error.statusCode = 400;
          throw error;
        }

        await tx.goal.update({
          where: { id: goal.id },
          data: { currentAmount: { decrement: amount } },
        });

        await tx.account.update({
          where: { id: account.id },
          data: { reservedBalance: { decrement: amount } },
        });
      }

      return await tx.transaction.create({
        data: {
          title: data.title,
          description: data.description,
          amount,
          type: data.type,
          date: new Date(data.date),
          userId,
          accountId: Number(data.accountId),
          goalId: Number(data.goalId),
          categoryId: null,
          toAccountId: null,
        },
      });
    }

    if (!data.accountId) {
      const error = new Error("A transação exige uma conta");
      error.statusCode = 400;
      throw error;
    }

    const account = await tx.account.findFirst({
      where: { id: Number(data.accountId), userId },
      include: { outgoingTransactions: true, incomingTransactions: true },
    });

    if (!account) {
      const error = new Error("Conta não encontrada");
      error.statusCode = 404;
      throw error;
    }

    if (data.categoryId) {
      const category = await tx.category.findFirst({
        where: {
          id: Number(data.categoryId),
          OR: [{ userId: null }, { userId }],
        },
      });

      if (!category) {
        const error = new Error("Categoria não encontrada");
        error.statusCode = 404;
        throw error;
      }
    }

    const availableBalanceForExpense = calculateAvailableBalance(account);

    if (data.type === "EXPENSE" && availableBalanceForExpense < amount) {
      const error = new Error(
        "Saldo disponível insuficiente (o restante pode estar guardado no cofre).",
      );
      error.statusCode = 400;
      throw error;
    }

    return await tx.transaction.create({
      data: {
        title: data.title,
        description: data.description,
        amount,
        type: data.type,
        date: new Date(data.date),
        userId,
        accountId: Number(data.accountId),
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        toAccountId: null,
        goalId: null,
      },
    });
  });
}

export async function getTransactions(userId) {
  return prisma.transaction.findMany({
    where: { userId },
    include: {
      account: true,
      toAccount: true,
      category: true,
      goal: true,
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function getTransaction(userId, id) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: Number(id),
      userId,
    },
    include: {
      account: true,
      toAccount: true,
      category: true,
      goal: true,
    },
  });

  if (!transaction) {
    const error = new Error("Transação não encontrada");
    error.statusCode = 404;
    throw error;
  }

  return transaction;
}

export async function updateTransaction(userId, id, data) {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findFirst({
      where: { id: Number(id), userId },
    });

    if (!transaction) {
      const error = new Error("Transação não encontrada");
      error.statusCode = 404;
      throw error;
    }

    if (
      transaction.type === "RESERVE" ||
      transaction.type === "UNRESERVE" ||
      data.type === "RESERVE" ||
      data.type === "UNRESERVE"
    ) {
      const error = new Error(
        "Não é possível editar transações do cofre. Se errou o valor, delete a transação ou faça um novo resgate/depósito.",
      );
      error.statusCode = 400;
      throw error;
    }

    const newTitle = data.title !== undefined ? data.title : transaction.title;
    const newDescription =
      data.description !== undefined
        ? data.description
        : transaction.description;
    const newAmount =
      data.amount !== undefined
        ? Number(data.amount)
        : Number(transaction.amount);
    const newType = data.type !== undefined ? data.type : transaction.type;
    const newDate =
      data.date !== undefined ? new Date(data.date) : transaction.date;
    const newAccountId =
      data.accountId !== undefined
        ? Number(data.accountId)
        : transaction.accountId;

    const newCategoryId =
      data.categoryId !== undefined
        ? data.categoryId
          ? Number(data.categoryId)
          : null
        : transaction.categoryId;

    const newToAccountId =
      data.toAccountId !== undefined
        ? data.toAccountId
          ? Number(data.toAccountId)
          : null
        : transaction.toAccountId;

    if (newAmount <= 0) {
      const error = new Error("O valor da transação deve ser maior que zero");
      error.statusCode = 400;
      throw error;
    }

    const accountWithoutCurrentTransaction = await tx.account.findFirst({
      where: { id: newAccountId, userId },
      include: {
        outgoingTransactions: { where: { id: { not: Number(id) } } },
        incomingTransactions: { where: { id: { not: Number(id) } } },
      },
    });

    if (!accountWithoutCurrentTransaction) {
      const error = new Error("Conta não encontrada");
      error.statusCode = 404;
      throw error;
    }

    const currentAvailableBalance = calculateAvailableBalance(
      accountWithoutCurrentTransaction,
    );

    if (
      (newType === "EXPENSE" || newType === "TRANSFER") &&
      currentAvailableBalance < newAmount
    ) {
      const error = new Error("Saldo disponível insuficiente");
      error.statusCode = 400;
      throw error;
    }

    return tx.transaction.update({
      where: { id: Number(id) },
      data: {
        title: newTitle,
        description: newDescription,
        amount: newAmount,
        type: newType,
        date: newDate,
        accountId: newAccountId,
        categoryId: newType === "TRANSFER" ? null : newCategoryId,
        toAccountId: newType === "TRANSFER" ? newToAccountId : null,
      },
    });
  });
}

export async function deleteTransaction(userId, id) {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findFirst({
      where: { id: Number(id), userId },
    });

    if (!transaction) {
      const error = new Error("Transação não encontrada");
      error.statusCode = 404;
      throw error;
    }

    if (transaction.type === "RESERVE" && transaction.goalId) {
      await tx.goal.update({
        where: { id: transaction.goalId },
        data: { currentAmount: { decrement: transaction.amount } },
      });
      await tx.account.update({
        where: { id: transaction.accountId },
        data: { reservedBalance: { decrement: transaction.amount } },
      });
    } else if (transaction.type === "UNRESERVE" && transaction.goalId) {
      await tx.goal.update({
        where: { id: transaction.goalId },
        data: { currentAmount: { increment: transaction.amount } },
      });
      await tx.account.update({
        where: { id: transaction.accountId },
        data: { reservedBalance: { increment: transaction.amount } },
      });
    }

    await tx.transaction.delete({
      where: { id: Number(id) },
    });

    return { message: "Transação deletada com sucesso" };
  });
}
