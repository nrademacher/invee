-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "isDraft" DROP NOT NULL;
