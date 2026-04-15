import prisma from "../lib/prisma.js";
import {
  calculateAccountBalance,
  calculateAvailableBalance,
} from "../utils/calculateAccountBalance.js";
// IMPORTANTE: Importe a função de cálculo diário que criamos
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
      investiments: true, // Mantenha o "i" extra aqui para o Prisma reconhecer
    },
  });

  if (!user) return null;

  let totalInvestmentsValue = 0;

  // ... (outras somas de conta e vault)

  // Use o nome exato que está no seu model User
  if (user.investiments) {
    for (const inv of user.investiments) {
      totalInvestmentsValue += calculateInvestmentValue(inv);
    }
  }

  return {
    // ... restando dos retornos
    investments: Number(totalInvestmentsValue.toFixed(2)),
  };
}
