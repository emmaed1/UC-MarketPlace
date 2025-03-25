/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_ProductToProductCategory_AB_unique";

-- DropIndex
DROP INDEX "_ServiceToServiceCategory_AB_unique";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
