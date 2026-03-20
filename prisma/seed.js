import prisma from "../src/lib/prisma.js";

async function main() {
  const categories = [
    "Salário",
    "Alimentação",
    "Transporte",
    "Moradia",
    "Saúde",
    "Lazer",
    "Educação",
    "Assinaturas",
    "Outros",
  ];

  for (const name of categories) {
    const existing = await prisma.category.findFirst({
      where: {
        name,
        userId: null,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name,
          userId: null,
        },
      });
    }
  }

  console.log("Categorias globais criadas 🚀");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
