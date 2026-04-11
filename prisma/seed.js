import prisma from "../src/lib/prisma.js";

async function main() {
  const categories = [
    // receitas
    { name: "Salário", categoryType: "INCOME", color: "#22c55e" },

    // Despesas
    { name: "Alimentação", categoryType: "EXPENSE", color: "#ef4444" },
    { name: "Transporte", categoryType: "EXPENSE", color: "#bd6019" },
    { name: "Moradia", categoryType: "EXPENSE", color: "#3b82f6" },
    { name: "Saúde", categoryType: "EXPENSE", color: "#ebc817" },
    { name: "Lazer", categoryType: "EXPENSE", color: "#f59e0b" },
    { name: "Educação", categoryType: "EXPENSE", color: "#6366f1" },
    { name: "Outros", categoryType: "EXPENSE", color: "#94a3b8" },
  ];

  for (const cat of categories) {
    const existing = await prisma.category.findFirst({
      where: {
        name: cat.name,
        userId: null,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          categoryType: cat.categoryType,
          color: cat.color,
          userId: null,
        },
      });
    } else {
      await prisma.category.update({
        where: { id: existing.id },
        data: {
          categoryType: cat.categoryType,
          color: cat.color,
        },
      });
    }
  }
}

main();
