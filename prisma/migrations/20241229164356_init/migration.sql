/*
  Warnings:

  - Added the required column `measure_of_unit` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "measure_of_unit" TEXT NOT NULL,
ALTER COLUMN "sku" DROP NOT NULL;