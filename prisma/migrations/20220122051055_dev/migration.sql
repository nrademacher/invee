/*
  Warnings:

  - You are about to drop the `_ClientToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClientToUser" DROP CONSTRAINT "_ClientToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientToUser" DROP CONSTRAINT "_ClientToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_invoiceId_fkey";

-- DropTable
DROP TABLE "_ClientToUser";

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
