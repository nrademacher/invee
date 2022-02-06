/*
  Warnings:

  - You are about to drop the column `payeeId` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `projectDescription` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `projectName` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_payeeId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_senderId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_userId_fkey";

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "payeeId",
DROP COLUMN "projectDescription",
DROP COLUMN "projectName",
DROP COLUMN "senderId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "items" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "payments";

-- DropEnum
DROP TYPE "PaymentType";

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
