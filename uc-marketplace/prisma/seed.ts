import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Product Categories
  const productCategories = [
    { name: "Academic Materials" },
    { name: "Home Essentials" },
    { name: "Clothing" },
    { name: "Accesories" },
    { name: "Technology & Electronics" },
    { name: "Food & Beverage" },
    { name: "Entertainment" },
    { name: "Collectibles" },
    { name: "Miscellaneous" },
  ];

  // Service Categories
  const serviceCategories = [
    { name: "Academic Help" },
    { name: "Technology Support" },
    { name: "Photography & Videography" },
    { name: "Beauty & Personal Care" },
    { name: "Automotive Services" },
    { name: "Creative Work" },
    { name: "Pet Services" },
    { name: "Entertainment & Event Planning" },
    { name: "Miscellaneous" },
  ];

  console.log('Seeding product categories...');
  for (const category of productCategories) {
    await prisma.productCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Seeding service categories...');
  for (const category of serviceCategories) {
    await prisma.serviceCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })