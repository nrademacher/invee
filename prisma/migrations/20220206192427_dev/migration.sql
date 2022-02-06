/*
  Warnings:

  - Made the column `status` on table `invoices` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "items_createdAt_key";

-- DropIndex
DROP INDEX "items_updatedAt_key";

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "status" SET NOT NULL;
