import prisma from "../lib/prisma.js";

export async function updateUserService(userId, data) {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  // verificar email duplicado
  if (data.email) {
    const emailExists = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: {
          id: Number(userId),
        },
      },
    });

    if (emailExists) {
      const error = new Error("Email já está em uso");
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
    },
  });

  return updatedUser;
}

export async function deleteUserService(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  await prisma.user.delete({
    where: {
      id: Number(userId),
    },
  });
}
