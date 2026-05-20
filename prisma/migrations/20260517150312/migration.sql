/*
  Warnings:

  - Made the column `description` on table `Promocion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Promocion" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "people" DROP DEFAULT,
ALTER COLUMN "price" DROP DEFAULT;
