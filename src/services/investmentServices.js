import prisma from "../lib/prisma.js";
import { calculateInvestmentValue } from "../utils/calculateInvestmentValue.js";

export async function createInvestment(userId, data) {
  return prisma.investment.create({
    data: {
      name: data.name,
      type: data.type,
      institution: data.institution,
      investedAmount: data.investedAmount,
      annualRate: data.annualRate,
      startDate: new Date(data.startDate),
      userId,
    },
  });
}

export async function getInvestments(userId) {
  const investments = await prisma.investment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return investments.map((inv) => ({
    ...inv,
    currentValue: calculateInvestmentValue(inv),
  }));
}

export async function getInvestment(userId, id) {
  const investment = await prisma.investment.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!investment) {
    const error = new Error("Investimento não encontrado");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...investment,
    currentValue: calculateInvestmentValue(investment),
  };
}

export async function deleteInvestment(userId, id) {
  const investment = await prisma.investment.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!investment) {
    const error = new Error("Investimento não encontrado");
    error.statusCode = 404;
    throw error;
  }

  await prisma.investment.delete({
    where: { id: Number(id) },
  });
}
