
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require('form-data');
const cors = require("cors");
const http = require('http');
const WebSocketServer = require('websocket').server;

const prisma = new PrismaClient();
const app = express();
const port = 3001;

// Sightengine credentials
const SIGHTENGINE_API_USER = '1623082989';
const SIGHTENGINE_API_SECRET = 'Bxzv9ouesgZeYyJKieHz7g4oWWCuLeAk';

// JWT configuration
const JWT_SECRET = "1234567890"; // Replace with real secret later

const generateJwt = (user) => {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

// Configure multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, 'image-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Function to check image content with Sightengine
async function checkImageContent(filePath) {
  try {
    const formData = new FormData();
    formData.append('media', fs.createReadStream(filePath));
    formData.append('models', 'nudity-2.1,weapon,alcohol,recreational_drug,medical,face-attributes,gore-2.0,violence');
    formData.append('api_user', SIGHTENGINE_API_USER);
    formData.append('api_secret', SIGHTENGINE_API_SECRET);

    const response = await axios.post('https://api.sightengine.com/1.0/check.json', 
      formData, 
      {
        headers: formData.getHeaders()
      }
    );

    console.log('Sightengine response:', JSON.stringify(response.data, null, 2));

    const result = response.data;
    return {
      isAppropriate: isContentAppropriate(result),
      details: result
    };
  } catch (error) {
    console.error('Sightengine error:', error.response?.data || error);
    throw error;
  }
}

function isContentAppropriate(result) {
  const weaponDetected = 
    result.weapon.classes.firearm > 0.5 || 
    result.weapon.classes.knife > 0.5 ||
    result.weapon.classes.firearm_gesture > 0.5 ||
    result.weapon.classes.firearm_toy > 0.5;

  const checks = [
    result.nudity.sexual_activity > 0.1,
    result.nudity.sexual_display > 0.1,
    result.nudity.erotica > 0.1,
    result.nudity.very_suggestive > 0.1,
    result.nudity.suggestive > 0.1,
    weaponDetected,
    result.recreational_drug.prob > 0.1,
    result.medical.prob > 0.1,
    result.violence.prob > 0.1,
    result.gore.prob > 0.1
  ];

  console.log('Weapon Detection:', {
    firearm: result.weapon.classes.firearm,
    knife: result.weapon.classes.knife,
    firearmGesture: result.weapon.classes.firearm_gesture,
    weaponDetected
  });

  return !checks.some(check => check);
}

// WebSocket server setup
const server = http.createServer(app);
const wsServer = new WebSocketServer({
  httpServer: server
});

let clients = [];
const JWT_SECRET = "1234567890";
wsServer.on('request', function(request) {
  const connection = request.accept(null, request.origin);
  let userId = null; }); });
  const generateJwt = (user) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};
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

    if (recipientClient) {
      const messageData = { ...data, sender: name };
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
  });

  connection.on('close', function(reasonCode, description) {
    clients = clients.filter(client => client.connection !== connection);
    console.log('Peer disconnected.');
  });
});

// Product routes
app.post("/products", upload.single('image'), async (req, res) => {
  const { name, desc, rating, price, quantity, img, categoryIds} = req.body;
  let imagePath = null;

  if (req.file) {
    try {
      const contentCheck = await checkImageContent(req.file.path);
      console.log('Content check result:', contentCheck);

      if (!contentCheck.isAppropriate) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          error: "Image contains inappropriate content",
          details: contentCheck.details
        });
      }

      imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } catch (error) {
      console.error('Content check failed:', error);
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: "Failed to validate image content",
        details: error.message
      });
    }
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        desc,
        rating: rating ? parseFloat(rating) : null,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        img: imagePath,
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
    const products = await prisma.product.findMany();
    include:{
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
      include:{
        categories:true,
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

// Service routes
app.post("/services", upload.single('image'), async (req, res) => {
  const { name, desc, rating, price, quantity, img, categoryIds } = req.body;
  let imagePath = null;

  if (req.file) {
    try {
      const contentCheck = await checkImageContent(req.file.path);
      console.log('Content check result:', contentCheck);

      if (!contentCheck.isAppropriate) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          error: "Image contains inappropriate content",
          details: contentCheck.details
        });
      }

      imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } catch (error) {
      console.error('Content check failed:', error);
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: "Failed to validate image content",
        details: error.message
      });
    }
  }

  try {
    const service = await prisma.service.create({
      data: {
        name,
        desc,
        rating: rating ? parseFloat(rating) : null,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        img: imagePath,
        categories: {
          connect: categoryIds.map((categoryId) => ({ id: categoryId })),
        },
      },
      include: {
        categories: true,
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
    include:{
      categories:true,
        },
  }),
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
      include:{
        categories:true,
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

// User routes
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

// Image moderation routes
app.get("/test-moderation", async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('models', 'nudity-2.1,weapon,alcohol,recreational_drug,medical,face-attributes,gore-2.0,violence');
    formData.append('api_user', SIGHTENGINE_API_USER);
    formData.append('api_secret', SIGHTENGINE_API_SECRET);
    formData.append('url', 'https://sightengine.com/assets/img/examples/example7.jpg');

    const response = await axios.post('https://api.sightengine.com/1.0/check.json', 
      formData, 
      {
        headers: formData.getHeaders()
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "API test failed",
      details: error.response?.data || error.message
    });
  }
});

app.post("/check-image-url", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    const formData = new FormData();
    formData.append('models', 'nudity-2.1,weapon,alcohol,recreational_drug,medical,face-attributes,gore-2.0,violence');
    formData.append('api_user', SIGHTENGINE_API_USER);
    formData.append('api_secret', SIGHTENGINE_API_SECRET);
    formData.append('url', imageUrl);

    const response = await axios.post('https://api.sightengine.com/1.0/check.json', 
      formData, 
      {
        headers: formData.getHeaders()
      }
    );

    const result = response.data;
    const isAppropriate = isContentAppropriate(result);

    res.json({
      isAppropriate,
      details: result
    });
  } catch (error) {
    res.status(500).json({
      error: "Image check failed",
      details: error.response?.data || error.message
    });
  }
});

// Authentication middleware
const authenticate = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token not found" });
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

// Protected routes
app.get("/user/profile", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    const { password: _password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: "Error fetching profile" });
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
