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

const JWT_SECRET = "your_jwt_secret"; // Replace with your actual secret

wsServer.on('request', function(request) {
  const connection = request.accept(null, request.origin);
  clients.push(connection);
  console.log('Connection accepted.');

  connection.on('message', async function(message) {
    const data = JSON.parse(message.utf8Data);
    console.log('Received Message:', data);

    // Use the sender field from the received message data
    const name = data.sender || 'Unknown';

    const messageData = { ...data, sender: name };
    clients.forEach(client => {
      client.sendUTF(JSON.stringify(messageData));
    });
  });

  connection.on('close', function(reasonCode, description) {
    clients = clients.filter(client => client !== connection);
    console.log('Peer disconnected.');
  });
});

const generateJwt = (user) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

// API for product listings
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
        img,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
});

app.get("/products", async (req, res) => {
  try {
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

// API for services listing
app.post("/services", async (req, res) => {
  const { name, desc, rating, price, quantity, img } = req.body;

  try {
    const service = await prisma.service.create({
      data: {
        name,
        desc,
        rating,
        price,
        quantity,
        img,
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
    res.status500().json({ error: "Error getting services" });
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

// API calls for users
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

const authenticate = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.json("Unauthorized");
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.json("Token not found");
  }

  try {
    const decode = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        email: decode.email,
      },
    });
    req.user = user ?? undefined;
    next();
  } catch (err) {
    req.user = undefined;
    next();
  }
};

app.get("/user", authenticate, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { password: _password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
});

app.post("/user/refresh-token", authenticate, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = generateJwt(req.user);
  res.json({ token });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});