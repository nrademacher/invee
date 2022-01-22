/*
  Warnings:

  - You are about to drop the column `total` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the `_ItemToInvoice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `invoiceId` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ItemToInvoice" DROP CONSTRAINT "_ItemToInvoice_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToInvoice" DROP CONSTRAINT "_ItemToInvoice_B_fkey";

-- DropIndex
DROP INDEX "invoices_publicId_key";

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "total";

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "invoiceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ItemToInvoice";

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
