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

export async function createAccount(userId, data) {
  return prisma.account.create({
    data: {
      name: data.name,
      type: data.type,
      initialBalance: data.initialBalance,
      userId,
    },
  });
}

export async function getAccounts(userId) {
  const accounts = await prisma.account.findMany({
    where: { userId },
    include: {
      outgoingTransactions: true,
      incomingTransactions: true,
    },
  });

  return accounts.map((account) => ({
    ...account,
    balance: calculateAccountBalance(account),
  }));
}

export async function getAccount(userId, id) {
  const account = await prisma.account.findFirst({
    where: {
      id: Number(id),
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

  return {
    ...account,
    balance: calculateAccountBalance(account),
  };
}

export async function updateAccount(userId, id, data) {
  const account = await prisma.account.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!account) {
    const error = new Error("Conta não encontrada");
    error.statusCode = 404;
    throw error;
  }

  return prisma.account.update({
    where: {
      id: Number(id),
    },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.type !== undefined && { type: data.type }),
    },
  });
}

export async function deleteAccount(userId, id) {
  const account = await prisma.account.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!account) {
    const error = new Error("Conta não encontrada");
    error.statusCode = 404;
    throw error;
  }

  await prisma.account.delete({
    where: {
      id: Number(id),
    },
  });
}
