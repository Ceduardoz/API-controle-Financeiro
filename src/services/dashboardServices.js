import prisma from "../lib/prisma.js";
import { calculateAvailableBalance } from "../utils/calculateAccountBalance.js";
import { calculateInvestmentValue } from "../utils/calculateInvestmentValue.js";

export async function getDashboardSummary(userId) {
  const idFormatado = Number(userId);

  const user = await prisma.user.findUnique({
    where: { id: idFormatado },
    include: {
      accounts: {
        include: {
          outgoingTransactions: true,
          incomingTransactions: true,
        },
      },
      transactions: true,
      investiments: true,
    },
  });

  if (!user) throw new Error("Usuário não encontrado");

  let accountBalance = 0;
  let vault = 0;
  let expenses = 0;
  let totalInvestmentsValue = 0;

  for (const account of user.accounts) {
    if (account.type !== "INVESTMENT") {
      accountBalance += calculateAvailableBalance(account);
      vault += Number(account.reservedBalance || 0);
    }
  }

  if (user.investiments && user.investiments.length > 0) {
    for (const inv of user.investiments) {
      totalInvestmentsValue += calculateInvestmentValue(inv);
    }
  }

  for (const transaction of user.transactions) {
    if (transaction.type === "EXPENSE") {
      expenses += Number(transaction.amount);
    }
  }

  return {
    accountBalance: Number(accountBalance.toFixed(2)),
    expenses: Number(expenses.toFixed(2)),
    vault: Number(vault.toFixed(2)),
    investments: Number(totalInvestmentsValue.toFixed(2)),
  };
}
