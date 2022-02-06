/*
  Warnings:

  - Made the column `total` on table `invoices` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "total" SET NOT NULL;

-- AlterTable
ALTER TABLE "items" ALTER COLUMN "quantity" SET DEFAULT 1;
