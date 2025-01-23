const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001; // Change the port number

app.use(cors());
app.use(bodyParser.json());

// Existing API for product listings
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

// Create a User
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

// Create a Message
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
    console.error("Error creating message:", error); // Log the error details
    res.status(500).json({ error: "Error creating message" });
  }
});

// Get Messages for a User
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
    console.error("Error getting messages:", error); // Log the error details
    res.status(500).json({ error: "Error getting messages" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});