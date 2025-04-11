-- DropIndex
DROP INDEX "_ProductToProductCategory_AB_unique";

-- DropIndex
DROP INDEX "_ServiceToServiceCategory_AB_unique";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" TEXT DEFAULT 'available';
