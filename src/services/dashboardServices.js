import prisma from "../lib/prisma.js";
import { calculateAccountBalance } from "../utils/calculateAccountBalance.js";

export async function getDashboardSummary(userId) {
  const accounts = await prisma.account.findMany({
    where: { userId },
    include: {
      outgoingTransactions: true,
      incomingTransactions: true,
    },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId },
  });

  let accountBalance = 0;
  let vault = 0;
  let expenses = 0;
  let investments = 0;

  for (const account of accounts) {
    const balance = calculateAccountBalance(account);

    if (account.type === "VAULT") {
      vault += balance;
    } else if (account.type === "INVESTMENT") {
      investments += balance;
    } else {
      accountBalance += balance;
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
