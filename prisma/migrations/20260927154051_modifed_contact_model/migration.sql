-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('PENDING', 'CONTACTED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "ContactStatus" NOT NULL DEFAULT 'PENDING';
