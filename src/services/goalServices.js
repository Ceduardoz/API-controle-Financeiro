import prisma from "../lib/prisma.js";

export async function createGoal(userId, data) {
  const account = await prisma.account.findFirst({
    where: {
      id: Number(data.accountId),
      userId: Number(userId),
    },
  });

  if (!account) {
    const error = new Error(
      "Conta não encontrada ou não pertence a este usuário",
    );
    error.statusCode = 404;
    throw error;
  }

  return prisma.goal.create({
    data: {
      name: data.name,
      description: data.description,
      targetAmount: Number(data.targetAmount),
      accountId: Number(data.accountId),
    },
  });
}

export async function getGoals(userId) {
  return prisma.goal.findMany({
    where: {
      account: {
        userId: Number(userId),
      },
    },
    include: {
      account: {
        select: {
          name: true,
          type: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getGoal(userId, id) {
  const goal = await prisma.goal.findFirst({
    where: {
      id: Number(id),
      account: {
        userId: Number(userId),
      },
    },
    include: {
      account: true,
      transactions: true,
    },
  });

  if (!goal) {
    const error = new Error("Meta não encontrada");
    error.statusCode = 404;
    throw error;
  }

  return goal;
}

export async function updateGoal(userId, id, data) {
  const goal = await prisma.goal.findFirst({
    where: {
      id: Number(id),
      account: {
        userId: Number(userId),
      },
    },
  });

  if (!goal) {
    const error = new Error("Meta não encontrada");
    error.statusCode = 404;
    throw error;
  }

  return prisma.goal.update({
    where: { id: Number(id) },
    data: {
      name: data.name !== undefined ? data.name : goal.name,
      description:
        data.description !== undefined ? data.description : goal.description,
      targetAmount:
        data.targetAmount !== undefined
          ? Number(data.targetAmount)
          : goal.targetAmount,
    },
  });
}

export async function deleteGoal(userId, id) {
  return prisma.$transaction(async (tx) => {
    const goal = await tx.goal.findFirst({
      where: {
        id: Number(id),
        account: {
          userId: Number(userId),
        },
      },
    });

    if (!goal) {
      const error = new Error("Meta não encontrada");
      error.statusCode = 404;
      throw error;
    }

    if (Number(goal.currentAmount) > 0) {
      await tx.account.update({
        where: { id: goal.accountId },
        data: {
          reservedBalance: {
            decrement: goal.currentAmount,
          },
        },
      });
    }

    await tx.transaction.updateMany({
      where: { goalId: goal.id },
      data: { goalId: null },
    });

    await tx.goal.delete({
      where: { id: Number(id) },
    });

    return { message: "Meta deletada e saldo devolvido à conta com sucesso" };
  });
}
