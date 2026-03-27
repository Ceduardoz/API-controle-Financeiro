import prisma from "../lib/prisma.js";
import { calculateAccountBalance } from "../utils/calculateAccountBalance.js";

export async function getDashboardSummary(userId) {
  const [accounts, vaults, investments, expenseTransactions] =
    await Promise.all([
      prisma.account.findMany({
        where: { userId },
        include: {
          outgoingTransactions: true,
          incomingTransactions: true,
        },
      }),
      prisma.vault.findMany({
        where: { userId },
      }),
      prisma.investment.findMany({
        where: { userId },
      }),
      prisma.transaction.findMany({
        where: {
          userId,
          type: "EXPENSE",
        },
      }),
    ]);

  // 1. Saldo em Contas
  const accountBalance = accounts.reduce((acc, account) => {
    return acc + calculateAccountBalance(account);
  }, 0);

  // 2. Saldo total nos Cofres (Caixinhas)
  const vaultTotal = vaults.reduce((acc, vault) => {
    return acc + Number(vault.balance);
  }, 0);

  // 3. Saldo total em Investimentos
  const investmentTotal = investments.reduce((acc, inv) => {
    return acc + Number(inv.investedAmount);
  }, 0);

  // 4. Soma das Despesas
  const totalExpenses = expenseTransactions.reduce((acc, trans) => {
    return acc + Number(trans.amount);
  }, 0);

  return {
    accountBalance: Number(accountBalance.toFixed(2)),
    expenses: Number(totalExpenses.toFixed(2)),
    vault: Number(vaultTotal.toFixed(2)),
    investments: Number(investmentTotal.toFixed(2)),
    totalNetWorth: Number(
      (accountBalance + vaultTotal + investmentTotal).toFixed(2),
    ), // Patrimônio Total
  };
}
