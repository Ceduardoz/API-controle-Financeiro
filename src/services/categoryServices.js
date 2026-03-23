import prisma from "../lib/prisma.js";

function normalizeName(name) {
  return name.trim().toLowerCase();
}

export async function createCategory(userId, data) {
  const normalizedName = normalizeName(data.name);

  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        {
          name: {
            equals: normalizedName,
            mode: "insensitive",
          },
          userId: null,
        },
        {
          name: {
            equals: normalizedName,
            mode: "insensitive",
          },
          userId,
        },
      ],
    },
  });

  if (existingCategory) {
    const error = new Error("Categoria já existe");
    error.statusCode = 409;
    throw error;
  }

  return prisma.category.create({
    data: {
      name: data.name.trim(),
      userId,
      categoryType: data.categoryType ?? null,
    },
  });
}

export async function getCategories(userId) {
  return prisma.category.findMany({
    where: {
      OR: [{ userId: null }, { userId }],
    },
    orderBy: [{ name: "asc" }],
  });
}

export async function getCategory(userId, id) {
  const category = await prisma.category.findFirst({
    where: {
      id: Number(id),
      OR: [{ userId: null }, { userId }],
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
      userId: null,
    },
  });

  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.statusCode = 404;
    throw error;
  }

  if (data.name !== undefined) {
    const normalizedName = normalizeName(data.name);

    const existingCategory = await prisma.category.findFirst({
      where: {
        NOT: {
          id: Number(id),
        },
        OR: [
          {
            name: {
              equals: normalizedName,
              mode: "insensitive",
            },
            userId: null,
          },
          {
            name: {
              equals: normalizedName,
              mode: "insensitive",
            },
            userId,
          },
        ],
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
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.categoryType !== undefined && {
        categoryType: data.categoryType,
      }),
      ...(data.color !== undefined && { color: data.color }),
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
