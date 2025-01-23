const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post("/products", async (req, res) => {
  const { name, desc, rating, price, quantity, img } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        desc,
        rating,
        price,
        quantity,
        img
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
});

app.post("/messages", async (req, res) => {
  const { senderId, receiverId, productId, content } = req.body;

  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        productId,
        content,
      },
    });
    res.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Error creating message" });
  }
});

app.get("/messages/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: true,
        receiver: true,
        product: true,
      },
    });
    res.json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Error getting messages" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// export default async function handler(req, res) {
//     const products = await prisma.product.findMany()
//     res.status(200).json(products)
// }
app.get("/products", async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.log("Error!");
    res.status(500).json({ error: "Error getting products" });
  }
});

app.get("/products/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  try {
    const product = await prisma.product.findUnique({
      where: { productId: productId },
    });
    res.json(product);
  } catch (error) {
    console.log("Error!");
    res.status(500).json({ error: "Error getting products" });
  }
});

app.delete("/products/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  try {
    const deletedProduct = await prisma.product.delete({
      where: { productId: productId },
    });
    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: "Errors deleting product" });
  }
});

// api for services listing
app.post("/services", async (req, res) => {
  const { title, desc, rating, price, quantity, img } = req.body;

  try {
    const service = await prisma.service.create({
      data: {
        title,
        desc,
        rating,
        price,
        quantity,
        img
      },
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: "Error creating service" });
  }
});

app.get("/services", async (req, res) => {
  try {
    const services = await prisma.service.findMany();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error getting services" });
  }
});

app.get("/services/:serviceId", async (req, res) => {
  const serviceId = parseInt(req.params.serviceId);
  try {
    const services = await prisma.service.findUnique({
      where: { serviceId: serviceId },
    });
    res.json(services);
  } catch (error) {
    console.log("Error!");
    res.status(500).json({ error: "Error getting services" });
  }
});

app.delete("/services/:serviceId", async (req, res) => {
  const serviceId = parseInt(req.params.serviceId);
  try {
    const deletedService = await prisma.service.delete({
      where: { serviceId: serviceId },
    });
    res.json(deletedService);
  } catch (error) {
    res.status(500).json({ error: "Errors deleting service" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
