-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "helpsWith" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tiers" JSONB[] DEFAULT ARRAY[]::JSONB[];
