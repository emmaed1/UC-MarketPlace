import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@test.com',
      password: "1234"
    }
  })

  const product = await prisma.product.create({
    data: {
      name: 'boots',
      desc: "warm winter boots",
      rating: "5",
      price: 30,
      quantity: 1
    }
  })

  const service = await prisma.service.create({
    data: {
      name: 'tutoring',
      desc: "tutoring in calculus 1-3",
      rating: "5",
      price: 20,
      quantity: 1
    }
  })
  console.log("USER: ", { user })
  console.log("PRODUCT: ", { product })
  console.log("SERVICE: ", { service })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })