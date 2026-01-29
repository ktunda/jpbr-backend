-- AlterTable
ALTER TABLE "Quote"
ADD COLUMN "breakdownJson" JSONB NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN "ruleVersion" TEXT NOT NULL DEFAULT 'pricing-v1';
