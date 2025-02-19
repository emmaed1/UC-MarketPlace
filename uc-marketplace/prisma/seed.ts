import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...');

  // First create all product categories
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

  console.log('Creating product categories...');
  for (const category of productCategories) {
    const created = await prisma.productCategory.create({
      data: category
    });
    console.log(`Created product category: ${created.name}`);
  }

  // Then create service categories
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

  console.log('Creating service categories...');
  for (const category of serviceCategories) {
    const created = await prisma.serviceCategory.create({
      data: category
    });
    console.log(`Created service category: ${created.name}`);
  }

  // Create test user
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@test.com',
      password: "1234"
    }
  });
  console.log('Created test user:', user.email);

  // Create test product with category
  const product = await prisma.product.create({
    data: {
      name: 'boots',
      desc: "warm winter boots",
      rating: 5,
      price: 30,
      quantity: 1,
      categories: {
        connect: [{ name: "Clothing" }]
      }
    },
    include: {
      categories: true
    }
  });

  // Create test service with category
  const service = await prisma.service.create({
    data: {
      name: 'tutoring',
      desc: "tutoring in calculus 1-3",
      rating: 5,
      price: 20,
      quantity: 1,
      categories: {
        connect: [{ name: "Academic Help" }]
      }
    },
    include: {
      categories: true
    }
  });

  console.log("Categories and user created successfully");
  console.log("USER: ", { user });
  console.log("PRODUCT: ", { product });
  console.log("SERVICE: ", { service });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error in seed script:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Disconnecting Prisma Client...');
    await prisma.$disconnect();
  });