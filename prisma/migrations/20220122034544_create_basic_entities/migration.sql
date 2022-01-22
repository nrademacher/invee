/*
  Warnings:

  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postCode` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetAddress` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'PENDING', 'PAID');

-- CreateEnum
CREATE TYPE "PaymentTerms" AS ENUM ('PIA', 'CIA', 'UPON_RECEIPT', 'NET_7', 'NET_21', 'NET_30', 'EOM', 'FIFTEEN_MFI', 'TWO_TEN_NET_30', 'FIFTY_PERCENT_UPFRONT');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('STRIPE', 'PAYPAL');

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "postCode" TEXT NOT NULL,
ADD COLUMN     "streetAddress" TEXT NOT NULL;

-- DropTable
DROP TABLE "posts";

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "InvoiceStatus" NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectDescription" TEXT,
    "paymentTerms" "PaymentTerms" NOT NULL,
    "total" INTEGER NOT NULL,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "fee" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "refunded" BOOLEAN NOT NULL,
    "data" JSONB NOT NULL,
    "externalId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ItemToInvoice" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_createdAt_key" ON "clients"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "clients_updatedAt_key" ON "clients"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "clients_name_key" ON "clients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_publicId_key" ON "invoices"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_createdAt_key" ON "invoices"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_updatedAt_key" ON "invoices"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_externalId_key" ON "Payment"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "items_createdAt_key" ON "items"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "items_updatedAt_key" ON "items"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "_ClientToUser_AB_unique" ON "_ClientToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientToUser_B_index" ON "_ClientToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToInvoice_AB_unique" ON "_ItemToInvoice"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToInvoice_B_index" ON "_ItemToInvoice"("B");

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToUser" ADD FOREIGN KEY ("A") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToUser" ADD FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToInvoice" ADD FOREIGN KEY ("A") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToInvoice" ADD FOREIGN KEY ("B") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
