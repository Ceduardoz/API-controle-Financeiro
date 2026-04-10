import prisma from "../lib/prisma.js";
import {
  calculateAccountBalance,
  calculateAvailableBalance,
} from "../utils/calculateAccountBalance.js";

export async function getDashboardSummary(userId) {
  const idFormatado = Number(userId);

  const accounts = await prisma.account.findMany({
    where: { userId: idFormatado },
    include: {
      outgoingTransactions: true,
      incomingTransactions: true,
    },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId: idFormatado },
  });

  let accountBalance = 0;
  let vault = 0;
  let expenses = 0;
  let investments = 0;

  for (const account of accounts) {
    if (account.type === "INVESTMENT") {
      investments += calculateAccountBalance(account);
    } else {
      const available = calculateAvailableBalance(account);
      const reserved = Number(account.reservedBalance || 0);

      accountBalance += available;
      vault += reserved;
    }
  }

  for (const transaction of transactions) {
    if (transaction.type === "EXPENSE") {
      expenses += Number(transaction.amount);
    }
  }

  return {
    accountBalance: Number(accountBalance.toFixed(2)),
    expenses: Number(expenses.toFixed(2)),
    vault: Number(vault.toFixed(2)),
    investments: Number(investments.toFixed(2)),
  };
}
