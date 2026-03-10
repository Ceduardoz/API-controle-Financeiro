-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('CDB', 'CDI', 'LCI', 'LCA');

-- CreateTable
CREATE TABLE "Investment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InvestmentType" NOT NULL,
    "institution" TEXT,
    "investedAmount" DECIMAL(12,2) NOT NULL,
    "annualRate" DECIMAL(5,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
