/*
  Warnings:

  - You are about to drop the column `initialBalance` on the `Account` table. All the data in the column will be lost.
  - Added the required column `Balance` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Vault` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VaultStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "initialBalance",
ADD COLUMN     "Balance" DECIMAL(12,2) NOT NULL;

-- AlterTable
ALTER TABLE "Vault" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#946afc',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" "VaultStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "targetAmount" DECIMAL(12,2),
ADD COLUMN     "targetDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
