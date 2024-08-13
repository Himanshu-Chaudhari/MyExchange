/*
  Warnings:

  - You are about to drop the column `publicKet` on the `SolWallet` table. All the data in the column will be lost.
  - Added the required column `publicKey` to the `SolWallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SolWallet" DROP COLUMN "publicKet",
ADD COLUMN     "publicKey" TEXT NOT NULL;
