import prisma from "../lib/prisma.js";

function isRecurringTransactionDue(
  recurringTransaction,
  referenceDate = new Date(),
) {
  const now = new Date(referenceDate);
  const startDate = new Date(recurringTransaction.startDate);

  if (startDate > now) return false;

  if (recurringTransaction.endDate) {
    const endDate = new Date(recurringTransaction.endDate);
    if (now > endDate) return false;
  }

  if (!recurringTransaction.isActive) return false;

  const lastRunAt = recurringTransaction.lastRunAt
    ? new Date(recurringTransaction.lastRunAt)
    : null;

  if (recurringTransaction.frequency === "DAILY") {
    if (lastRunAt) {
      return lastRunAt.toDateString() !== now.toDateString();
    }
    return true;
  }

  if (recurringTransaction.frequency === "WEEKLY") {
    const currentDay = now.getDay();
    if (recurringTransaction.dayOfWeek !== currentDay) return false;

    if (lastRunAt) {
      const diffInDays = Math.floor(
        (now.getTime() - lastRunAt.getTime()) / (1000 * 60 * 60 * 24),
      );
      return diffInDays >= 7;
    }

    return true;
  }

  if (recurringTransaction.frequency === "MONTHLY") {
    const currentDay = now.getDate();
    if (recurringTransaction.dayOfMonth !== currentDay) return false;

    if (lastRunAt) {
      return (
        lastRunAt.getMonth() !== now.getMonth() ||
        lastRunAt.getFullYear() !== now.getFullYear()
      );
    }

    return true;
  }

  if (recurringTransaction.frequency === "YEARLY") {
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1;

    if (
      recurringTransaction.dayOfMonth !== currentDay ||
      recurringTransaction.monthOfYear !== currentMonth
    ) {
      return false;
    }

    if (lastRunAt) {
      return lastRunAt.getFullYear() !== now.getFullYear();
    }

    return true;
  }

  return false;
}

export async function createRecurringTransaction(userId, data) {
  const account = await prisma.account.findFirst({
    where: {
      id: Number(data.accountId),
      userId,
    },
  });

  if (!account) {
    const error = new Error("Conta não encontrada");
    error.statusCode = 404;
    throw error;
  }

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
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

  return prisma.recurringTransaction.create({
    data: {
      title: data.title,
      description: data.description,
      amount: data.amount,
      type: data.type,
      frequency: data.frequency,
      dayOfMonth: data.dayOfMonth ?? null,
      dayOfWeek: data.dayOfWeek ?? null,
      monthOfYear: data.monthOfYear ?? null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      isActive: data.isActive ?? true,
      userId,
      accountId: Number(data.accountId),
      categoryId: data.categoryId ? Number(data.categoryId) : null,
    },
  });
}

export async function getRecurringTransactions(userId) {
  return prisma.recurringTransaction.findMany({
    where: { userId },
    include: {
      account: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getRecurringTransaction(userId, id) {
  const recurringTransaction = await prisma.recurringTransaction.findFirst({
    where: {
      id: Number(id),
      userId,
    },
    include: {
      account: true,
      category: true,
    },
  });

  if (!recurringTransaction) {
    const error = new Error("Lançamento recorrente não encontrado");
    error.statusCode = 404;
    throw error;
  }

  return recurringTransaction;
}

export async function updateRecurringTransaction(userId, id, data) {
  const recurringTransaction = await prisma.recurringTransaction.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!recurringTransaction) {
    const error = new Error("Lançamento recorrente não encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (data.accountId) {
    const account = await prisma.account.findFirst({
      where: {
        id: Number(data.accountId),
        userId,
      },
    });

    if (!account) {
      const error = new Error("Conta não encontrada");
      error.statusCode = 404;
      throw error;
    }
  }

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
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

  return prisma.recurringTransaction.update({
    where: {
      id: Number(id),
    },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.frequency !== undefined && { frequency: data.frequency }),
      ...(data.dayOfMonth !== undefined && { dayOfMonth: data.dayOfMonth }),
      ...(data.dayOfWeek !== undefined && { dayOfWeek: data.dayOfWeek }),
      ...(data.monthOfYear !== undefined && { monthOfYear: data.monthOfYear }),
      ...(data.startDate !== undefined && {
        startDate: new Date(data.startDate),
      }),
      ...(data.endDate !== undefined && {
        endDate: data.endDate ? new Date(data.endDate) : null,
      }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.accountId !== undefined && {
        accountId: Number(data.accountId),
      }),
      ...(data.categoryId !== undefined && {
        categoryId: data.categoryId ? Number(data.categoryId) : null,
      }),
    },
  });
}

export async function deleteRecurringTransaction(userId, id) {
  const recurringTransaction = await prisma.recurringTransaction.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!recurringTransaction) {
    const error = new Error("Lançamento recorrente não encontrado");
    error.statusCode = 404;
    throw error;
  }

  await prisma.recurringTransaction.delete({
    where: {
      id: Number(id),
    },
  });
}

export async function processRecurringTransactions(userId) {
  const recurringTransactions = await prisma.recurringTransaction.findMany({
    where: {
      userId,
      isActive: true,
    },
  });

  const createdTransactions = [];

  for (const recurringTransaction of recurringTransactions) {
    const isDue = isRecurringTransactionDue(recurringTransaction);

    if (!isDue) continue;

    const transaction = await prisma.transaction.create({
      data: {
        title: recurringTransaction.title,
        description: recurringTransaction.description,
        amount: recurringTransaction.amount,
        type: recurringTransaction.type,
        date: new Date(),
        userId,
        accountId: recurringTransaction.accountId,
        categoryId: recurringTransaction.categoryId,
        toAccountId: null,
      },
    });

    await prisma.recurringTransaction.update({
      where: {
        id: recurringTransaction.id,
      },
      data: {
        lastRunAt: new Date(),
      },
    });

    createdTransactions.push(transaction);
  }

  return createdTransactions;
}
