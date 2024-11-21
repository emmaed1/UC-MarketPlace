/*
  Warnings:

  - The `rating` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rating` column on the `Service` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "rating",
ADD COLUMN     "rating" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "rating",
ADD COLUMN     "rating" DOUBLE PRECISION;
