const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// WebSocket server
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const { senderId, receiverId, content } = JSON.parse(message);
    try {
      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content,
        },
      });
      // Broadcast the new message to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(newMessage));
        }
      });
    } catch (error) {
      console.error("Error creating message:", error);
    }
  });
});

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Existing API for product listings
app.post("/products", async (req, res) => {
  const { name, desc, rating, price, quantity, img, sellerId } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        desc,
        rating,
        price,
        quantity,
        img,
        seller: {
          connect: { id: sellerId }
        }
      },
    });
    res.json(product);
  } catch (error) {
    console.error("Error creating product:", error); // Log the error details
    res.status(500).json({ error: "Error creating product" });
  }
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        seller: true,
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error getting products:", error); // Log the error details
    res.status(500).json({ error: "Error getting products" });
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

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Create a Message
app.post("/messages", async (req, res) => {
  const { senderId, receiverId, productId, content } = req.body;

  console.log("Received data:", { senderId, receiverId, productId, content }); // Add this line to log the received data

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
    console.log("Fetched messages:", messages); // Log the fetched messages
    res.json(messages);
  } catch (error) {
    console.error("Error getting messages:", error); // Log the error details
    res.status(500).json({ error: "Error getting messages" });
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    prisma.$disconnect();
    process.exit(0);
  });
});