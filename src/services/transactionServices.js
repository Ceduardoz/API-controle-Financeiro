import prisma from "../lib/prisma.js";

function calculateAccountBalance(account) {
  let balance = Number(account.initialBalance);

  for (const transaction of account.outgoingTransactions) {
    const amount = Number(transaction.amount);

    if (transaction.type === "INCOME") {
      balance += amount;
    } else if (transaction.type === "EXPENSE") {
      balance -= amount;
    } else if (transaction.type === "TRANSFER") {
      balance -= amount;
    }
  }

  for (const transaction of account.incomingTransactions) {
    const amount = Number(transaction.amount);

    if (transaction.type === "TRANSFER") {
      balance += amount;
    }
  }

  return balance;
}

export async function createTransaction(userId, data) {
  return prisma.$transaction(async (tx) => {
    const amount = Number(data.amount);

    if (amount <= 0) {
      const error = new Error("O valor da transação deve ser maior que zero");
      error.statusCode = 400;
      throw error;
    }

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
        where: {
          id: Number(data.accountId),
          userId,
        },
        include: {
          outgoingTransactions: true,
          incomingTransactions: true,
        },
      });

      const toAccount = await tx.account.findFirst({
        where: {
          id: Number(data.toAccountId),
          userId,
        },
        include: {
          outgoingTransactions: true,
          incomingTransactions: true,
        },
      });

      if (!fromAccount || !toAccount) {
        const error = new Error("Conta de origem ou destino não encontrada");
        error.statusCode = 404;
        throw error;
      }

      const fromAccountBalance = calculateAccountBalance(fromAccount);

      if (fromAccountBalance < amount) {
        const error = new Error("Saldo insuficiente para transferência");
        error.statusCode = 400;
        throw error;
      }

      const transaction = await tx.transaction.create({
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
        },
      });

      return transaction;
    }

    if (!data.accountId) {
      const error = new Error("A transação exige uma conta");
      error.statusCode = 400;
      throw error;
    }

    const account = await tx.account.findFirst({
      where: {
        id: Number(data.accountId),
        userId,
      },
      include: {
        outgoingTransactions: true,
        incomingTransactions: true,
      },
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
          userId,
        },
      });

      if (!category) {
        const error = new Error("Categoria não encontrada");
        error.statusCode = 404;
        throw error;
      }
    }

    const currentBalance = calculateAccountBalance(account);

    if (data.type === "EXPENSE" && currentBalance < amount) {
      const error = new Error("Saldo insuficiente para despesa");
      error.statusCode = 400;
      throw error;
    }

    const transaction = await tx.transaction.create({
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
      },
    });

    return transaction;
  });
}

export async function getTransactions(userId) {
  return prisma.transaction.findMany({
    where: { userId },
    include: {
      account: true,
      toAccount: true,
      category: true,
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
      where: {
        id: Number(id),
        userId,
      },
    });

    if (!transaction) {
      const error = new Error("Transação não encontrada");
      error.statusCode = 404;
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

    const account = await tx.account.findFirst({
      where: {
        id: newAccountId,
        userId,
      },
      include: {
        outgoingTransactions: true,
        incomingTransactions: true,
      },
    });

    if (!account) {
      const error = new Error("Conta não encontrada");
      error.statusCode = 404;
      throw error;
    }

    if (newCategoryId) {
      const category = await tx.category.findFirst({
        where: {
          id: newCategoryId,
          userId,
        },
      });

      if (!category) {
        const error = new Error("Categoria não encontrada");
        error.statusCode = 404;
        throw error;
      }
    }

    if (newType === "TRANSFER") {
      if (!newToAccountId) {
        const error = new Error(
          "Transferência exige conta de origem e destino",
        );
        error.statusCode = 400;
        throw error;
      }

      if (newAccountId === newToAccountId) {
        const error = new Error(
          "A conta de origem e destino devem ser diferentes",
        );
        error.statusCode = 400;
        throw error;
      }

      const toAccount = await tx.account.findFirst({
        where: {
          id: newToAccountId,
          userId,
        },
      });

      if (!toAccount) {
        const error = new Error("Conta de destino não encontrada");
        error.statusCode = 404;
        throw error;
      }
    }

    const accountWithoutCurrentTransaction = await tx.account.findFirst({
      where: {
        id: newAccountId,
        userId,
      },
      include: {
        outgoingTransactions: {
          where: {
            id: {
              not: Number(id),
            },
          },
        },
        incomingTransactions: {
          where: {
            id: {
              not: Number(id),
            },
          },
        },
      },
    });

    const currentBalance = calculateAccountBalance(
      accountWithoutCurrentTransaction,
    );

    if (
      (newType === "EXPENSE" || newType === "TRANSFER") &&
      currentBalance < newAmount
    ) {
      const error = new Error("Saldo insuficiente");
      error.statusCode = 400;
      throw error;
    }

    return tx.transaction.update({
      where: {
        id: Number(id),
      },
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
