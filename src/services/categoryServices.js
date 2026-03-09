import prisma from "../lib/prisma.js";

export async function createCategory(userId, data) {
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: data.name,
      userId,
    },
  });

  if (existingCategory) {
    const error = new Error("Categoria já existe");
    error.statusCode = 409;
    throw error;
  }

  return prisma.category.create({
    data: {
      name: data.name,
      userId,
    },
  });
}

export async function getCategories(userId) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCategory(userId, id) {
  const category = await prisma.category.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  return category;
}

export async function updateCategory(userId, id, data) {
  const category = await prisma.category.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  if (data.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: data.name,
        userId,
        NOT: {
          id: Number(id),
        },
      },
    });

    if (existingCategory) {
      const error = new Error("Já existe uma categoria com esse nome");
      error.statusCode = 409;
      throw error;
    }
  }

  return prisma.category.update({
    where: {
      id: Number(id),
    },
    data: {
      ...(data.name !== undefined && { name: data.name }),
    },
  });
}

export async function deleteCategory(userId, id) {
  const category = await prisma.category.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  await prisma.category.delete({
    where: {
      id: Number(id),
    },
  });
}
