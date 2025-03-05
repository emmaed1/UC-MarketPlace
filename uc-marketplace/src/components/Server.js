const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const http = require('http');
const WebSocketServer = require('websocket').server;
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const stripe = require('stripe')('sk_test_51Qyy4aKCv8fIXaN0G9vgCE4TBbt4I5e4DfKGyvkrIuPRtewz53WUTErFOswyTiN7YzBBmjbEfIChjLQB9qsT3bcV00fmhOVYCB');


const prisma = new PrismaClient();
const app = express();
const port = 3001;

// SightEngine API credentials
const SIGHTENGINE_API_USER = '1623082989';
const SIGHTENGINE_API_SECRET = 'Bxzv9ouesgZeYyJKieHz7g4oWWCuLeAk';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('public/uploads')) {
  fs.mkdirSync('public/uploads', { recursive: true });
}

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

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

// User registration endpoint
app.post("/register", async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    console.log('User created:', user.id);

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: "Registration failed",
      details: error.message 
    });
  }
});

// Add these functions
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

    const result = response.data;
    return {
      isAppropriate: isContentAppropriate(result),
      details: result
    };
  } catch (error) {
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

  return !checks.some(check => check);
}

// Product creation endpoint
app.post("/products", upload.single('image'), async (req, res) => {
  try {
    console.log('File received:', req.file);
    console.log('Form data received:', req.body);

    // Add this image check block
    if (req.file) {
      const imageCheck = await checkImageContent(req.file.path);
      
      if (!imageCheck.isAppropriate) {
        // Delete the uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          error: "Inappropriate image content detected",
          details: imageCheck.details
        });
      }
    }

    const { name, desc, price, quantity, categoryIds } = req.body;
    
    // Parse category IDs
    const parsedCategoryIds = JSON.parse(categoryIds).map(id => parseInt(id));

    const data = {
      name: String(name),
      desc: String(desc),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      rating: 0,
      img: req.file ? `/uploads/${req.file.filename}` : null,
      categories: {
        connect: parsedCategoryIds.map(id => ({ id }))
      }
    };

    console.log('Creating product with data:', data);

    const result = await prisma.product.create({
      data,
      include: {
        categories: true
      }
    });

    res.json(result);

  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ 
      error: "Error creating product",
      details: error.message 
    });
  }
});

// Service creation endpoint
app.post("/services", upload.single('image'), async (req, res) => {
  try {
    console.log('Service creation attempt:', req.body);
    const { name, desc, price, quantity, categoryIds } = req.body;
    
    // Validate price
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ 
        error: "Invalid price",
        details: "Price must be a positive number"
      });
    }

    // Handle the uploaded file
    const img = req.file ? `/uploads/${req.file.filename}` : null;
    console.log('Uploaded file:', req.file);

    // Parse categoryIds
    let categories;
    try {
      categories = categoryIds ? 
        (Array.isArray(categoryIds) ? categoryIds : JSON.parse(categoryIds))
        .map(id => ({ id: parseInt(id) })) : [];
    } catch (e) {
      console.error('Error parsing categoryIds:', e);
      categories = [];
    }

    const data = {
      name: String(name),
      desc: String(desc),
      price: parsedPrice,
      quantity: parseInt(quantity),
      rating: 0,
      img,
      categories: {
        connect: categories
      }
    };

    console.log('Creating service with data:', data);

    const result = await prisma.service.create({
      data,
      include: {
        categories: true
      }
    });

    // Add full URL to image
    if (result.img) {
      result.img = `http://localhost:3001${result.img}`;
    }

    res.json(result);
  } catch (error) {
    console.error('Service creation error:', error);
    res.status(500).json({ 
      error: "Error creating service",
      details: error.message 
    });
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

// Create Setup Intent
app.post('/create-setup-intent', async (req, res) => {
  try {
      const setupIntent = await stripe.setupIntents.create();
      res.send({ clientSecret: setupIntent.client_secret });
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});

// Confirmation route
app.get('/confirmation', (req, res) => {
  res.send('Payment method saved successfully!');
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

app.get("/favorites/:accountName", async (req, res) => {
  const accountName = req.params.accountName;
  try {
    const user = await prisma.user.findFirst({
      where: { name: accountName },
      include: { favoriteFriends: true }
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.favoriteFriends);
  } catch (error) {
    console.error("Error fetching favorite friends:", error);
    res.status(500).json({ error: "Error fetching favorite friends" });
  }
});

app.post("/favorites/:accountName", async (req, res) => {
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
        favoriteFriends: {
          connect: { id: friend.id }
        }
      }
    });
    res.json(friend);
  } catch (error) {
    console.error("Error adding favorite friend:", error);
    res.status(500).json({ error: "Error adding favorite friend" });
  }
});

app.delete("/favorites/:accountName/:friendId", async (req, res) => {
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
        favoriteFriends: {
          disconnect: { id: friendId }
        }
      }
    });
    res.json({ message: "Favorite friend removed" });
  } catch (error) {
    console.error("Error removing favorite friend:", error);
    res.status(500).json({ error: "Error removing favorite friend" });
  }
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});