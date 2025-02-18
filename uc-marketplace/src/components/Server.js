const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const http = require('http');
const WebSocketServer = require('websocket').server;

const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const wsServer = new WebSocketServer({
  httpServer: server
});

let clients = [];

const JWT_SECRET = "1234567890";

wsServer.on('request', function(request) {
  const connection = request.accept(null, request.origin);
  let userId = null;
  clients.push({ connection, userId });
  console.log('Connection accepted.');

  connection.on('message', async function(message) {
    const data = JSON.parse(message.utf8Data);
    console.log('Received Message:', data);

    if (data.type === 'authenticate') {
      const token = data.token;
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
        const client = clients.find(client => client.connection === connection);
        if (client) {
          client.userId = userId;
        }
        console.log('User authenticated:', userId);
      } catch (err) {
        console.log('Authentication failed:', err);
      }
      return;
    }

    if (data.type === 'message') {
      const name = data.sender || 'Unknown';
      const recipientId = parseInt(data.recipient);

      const senderUser = await prisma.user.findFirst({
        where: { name: name },
      });

      if (!senderUser) {
        console.log('Sender not found');
        return;
      }

      if (!recipientId) {
        console.log('Recipient ID not specified or invalid');
        return;
      }

      const recipientUser = await prisma.user.findUnique({
        where: { id: recipientId },
      });

      if (!recipientUser) {
        console.log('Recipient not found');
        return;
      }

      const recipientClient = clients.find(client => client.userId === recipientUser.id);

      const messageData = {
        type: 'message',
        message: data.message,
        sender: { id: senderUser.id, name: senderUser.name },
        recipient: { id: recipientUser.id, name: recipientUser.name },
        timestamp: new Date()
      };

      if (recipientClient) {
        console.log('Sending message to recipient:', recipientUser.id);
        recipientClient.connection.sendUTF(JSON.stringify(messageData));
      } else {
        console.log('Recipient client not found');
      }

      await prisma.message.create({
        data: {
          sender: { connect: { id: senderUser.id } },
          recipient: { connect: { id: recipientUser.id } },
          message: data.message,
          timestamp: new Date(),
        },
      });

      connection.sendUTF(JSON.stringify(messageData));
    }
  });

  connection.on('close', function(reasonCode, description) {
    clients = clients.filter(client => client.connection !== connection);
    console.log('Peer disconnected.');
  });
});

const generateJwt = (user) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

app.get("/friends/:accountName", async (req, res) => {
  const accountName = req.params.accountName;
  try {
    const user = await prisma.user.findFirst({
      where: { name: accountName },
      include: { friends: true, friendOf: true }
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const friends = [...user.friends, ...user.friendOf];
    res.json(friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Error fetching friends" });
  }
});

app.post("/friends/:accountName", async (req, res) => {
  const accountName = req.params.accountName;
  const { friendId } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: { name: accountName }
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const friend = await prisma.user.findUnique({
      where: { id: friendId }
    });
    if (!friend) {
      return res.status(404).json({ error: "Friend not found" });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        friends: {
          connect: { id: friend.id }
        }
      }
    });
    res.json(friend);
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ error: "Error adding friend" });
  }
});

app.delete("/friends/:accountName/:friendId", async (req, res) => {
  const accountName = req.params.accountName;
  const friendId = parseInt(req.params.friendId);
  try {
    const user = await prisma.user.findFirst({
      where: { name: accountName }
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        friends: {
          disconnect: { id: friendId }
        }
      }
    });
    res.json({ message: "Friend removed" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ error: "Error removing friend" });
  }
});

app.post("/products", async (req, res) => {
  const { name, desc, rating, price, quantity, img, categoryIds } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        desc,
        rating,
        price,
        quantity,
        img,
        categories: {
          connect: categoryIds.map((categoryId) => ({ id: categoryId })),
        },
      },
      include: {
        categories: true,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
});

app.get("/products", async (req, res) => {
  try {

    const products = await prisma.product.findMany({
      include: { 
        categories: true,
      },
    });
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
      include: {
        categories: true,
      },
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

app.post("/services", async (req, res) => {
  const { name, desc, rating, price, quantity, img, categoryIds } = req.body;

  try {
    const service = await prisma.service.create({
      data: {
        name,
        desc,
        rating,
        price,
        quantity,
        img,
        categories: { // Connect to existing categories
          connect: categoryIds.map((categoryId) => ({ id: categoryId })),
        },
      },
      include: { // Include categories in the response
        categories: true,
      },
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
});

app.get("/services", async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        categories: true,
      },
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: "Error getting services" });
  }
});

app.get("/services/:serviceId", async (req, res) => {
  const serviceId = parseInt(req.params.serviceId);
  try {
    const services = await prisma.service.findUnique({
      where: { serviceId: serviceId },
      include: {
        categories: true,
      },
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

app.get("/user", async (req, res) => {
  try {
    const user = await prisma.user.findMany();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error getting users" });
  }
});

app.post("/user", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        ...req.body, password: hash
      },
    });
    const { password: _password, ...userWithoutPassword } = user;
    res.json({ ...userWithoutPassword, token: generateJwt(user) });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

app.get("/user/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    res.json(user);
  } catch (error) {
    console.log("Error!");
    res.status(500).json({ error: "Error getting user" });
  }
});

app.post("/user/login", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect Password" });
    }
    const { password: _password, ...userWithoutPassword } = user;
    res.json({ ...userWithoutPassword, token: generateJwt(user) });
  } catch (error) {
    res.status(500).json({ error: "Error logging in." });
  }
});

app.get("/messages/:recipientId", async (req, res) => {
  const recipientId = parseInt(req.params.recipientId);
  const userId = req.query.userId;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId: recipientId },
          { senderId: recipientId, recipientId: userId }
        ]
      },
      orderBy: {
        timestamp: 'asc'
      },
      include: {
        sender: true,
        recipient: true
      }
    });
    res.json(messages);
  } catch (error) {
    console.log("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
});

app.get("/user", async (req, res, next) => {
  try {
    const user = await prisma.user.findMany();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

app.post("/user/refresh-token", async (req, res) => {
  const userId = req.body.userId; 
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = generateJwt(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error refreshing token" });
  }
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});