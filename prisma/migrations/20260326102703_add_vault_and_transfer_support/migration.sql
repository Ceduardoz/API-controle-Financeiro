/*
  Warnings:

  - The values [VAULT,INVESTMENT] on the enum `AccountType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccountType_new" AS ENUM ('CHECKING', 'SAVINGS');
ALTER TABLE "Account" ALTER COLUMN "type" TYPE "AccountType_new" USING ("type"::text::"AccountType_new");
ALTER TYPE "AccountType" RENAME TO "AccountType_old";
ALTER TYPE "AccountType_new" RENAME TO "AccountType";
DROP TYPE "public"."AccountType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "fromVaultId" INTEGER,
ADD COLUMN     "toVaultId" INTEGER;

-- CreateTable
CREATE TABLE "Vault" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Vault_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vault_userId_idx" ON "Vault"("userId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromVaultId_fkey" FOREIGN KEY ("fromVaultId") REFERENCES "Vault"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toVaultId_fkey" FOREIGN KEY ("toVaultId") REFERENCES "Vault"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vault" ADD CONSTRAINT "Vault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
