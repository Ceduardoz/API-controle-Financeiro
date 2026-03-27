import prisma from "../lib/prisma.js";

export async function createVaultServices(userId, data) {
  return await prisma.vault.create({
    data: {
      ...data,
      userId,
      balance: 0,
    },
  });
}

export async function depositVaultServices(
  userId,
  vaultId,
  { accountId, amount, title },
) {
  return await prisma.$transaction(async (tx) => {
    const account = await tx.account.findUnique({ where: { id: accountId } });

    if (!account || account.userId !== userId) {
      throw new Error("Conta não encontrada ou acesso negado");
    }
    if (Number(account.balance) < amount) {
      throw new Error("Saldo insuficiente na conta");
    }

    const transaction = await tx.transaction.create({
      data: {
        title,
        amount,
        type: "TRANSFER",
        date: new Date(),
        userId,
        accountId,
        toVaultId: vaultId,
      },
    });

    await tx.account.update({
      where: { id: accountId },
      data: { initialBalance: { decrement: amount } },
    });

    const updatedVault = await tx.vault.update({
      where: { id: vaultId },
      data: { balance: { increment: amount } },
    });

    return { transaction, vault: updatedVault };
  });
}

export async function withdrawVaultServices(
  userId,
  vaultId,
  { accountId, amount, title },
) {
  return await prisma.$transaction(async (tx) => {
    const vault = await tx.vault.findUnique({ where: { id: vaultId } });

    if (!vault || vault.userId !== userId) {
      throw new Error("Caixinha não encontrada");
    }

    if (Number(vault.balance) < amount) {
      throw new Error("Saldo insuficiente na caixinha");
    }

    await tx.transaction.create({
      data: {
        title,
        amount,
        type: "TRANSFER",
        date: new Date(),
        userId,
        vaultId: vaultId,
        toAccountId: accountId,
      },
    });

    await tx.vault.update({
      where: { id: vaultId },
      data: { balance: { decrement: amount } },
    });

    return await tx.account.update({
      where: { id: accountId },
      data: { initialBalance: { increment: amount } },
    });
  });
}
