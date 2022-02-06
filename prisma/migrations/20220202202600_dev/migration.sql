/*
  Warnings:

  - Added the required column `clientCity` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientCountry` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientPostCode` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientStreetAddress` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCity` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCountry` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userPostCode` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userStreetAddress` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "clientCity" TEXT NOT NULL,
ADD COLUMN     "clientCountry" TEXT NOT NULL,
ADD COLUMN     "clientPostCode" TEXT NOT NULL,
ADD COLUMN     "clientStreetAddress" TEXT NOT NULL,
ADD COLUMN     "userCity" TEXT NOT NULL,
ADD COLUMN     "userCountry" TEXT NOT NULL,
ADD COLUMN     "userPostCode" TEXT NOT NULL,
ADD COLUMN     "userStreetAddress" TEXT NOT NULL;
