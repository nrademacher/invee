/*
  Warnings:

  - Added the required column `clientEmail` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "clientEmail" TEXT NOT NULL,
ADD COLUMN     "clientName" TEXT NOT NULL;
