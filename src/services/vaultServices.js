import prisma from "../lib/prisma.js";

export async function VaultService(userId, data) {
  return await prisma.vault.create({
    data: {
      ...data,
      userId,
      balance: 0,
    },
  });
}
