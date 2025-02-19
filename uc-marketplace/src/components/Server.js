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

const JWT_SECRET = "1234567890";

const generateJwt = (user) => {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

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

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const SIGHTENGINE_API_USER = '1623082989';
const SIGHTENGINE_API_SECRET = 'Bxzv9ouesgZeYyJKieHz7g4oWWCuLeAk';

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

const server = http.createServer(app);
const wsServer = new WebSocketServer({
  httpServer: server
});

let clients = [];

wsServer.on('request', function(request) {
  const connection = request.accept(null, request.origin);
  let userId = null;
  clients.push({ connection, userId });

  connection.on('message', async function(message) {
    const data = JSON.parse(message.utf8Data);

    if (data.type === 'authenticate') {
      const token = data.token;
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
        const client = clients.find(client => client.connection === connection);
        if (client) {
          client.userId = userId;
        }
      } catch (err) {}
      return;
    }

    const name = data.sender || 'Unknown';
    const recipientId = parseInt(data.recipient);

    const senderUser = await prisma.user.findFirst({
      where: { name: name },
    });

    if (!senderUser) {
      return;
    }

    if (!recipientId) {
      return;
    }

    const recipientUser = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipientUser) {
      return;
    }

    const recipientClient = clients.find(client => client.userId === recipientUser.id);

    if (recipientClient) {
      const messageData = { ...data, sender: name };
      recipientClient.connection.sendUTF(JSON.stringify(messageData));
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
  });
});

app.post("/products", upload.single('image'), async (req, res) => {
  const { name, desc, rating, price, quantity, categories } = req.body;
  let imagePath = null;

  if (req.file) {
    try {
      const contentCheck = await checkImageContent(req.file.path);

      if (!contentCheck.isAppropriate) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          error: "Image contains inappropriate content",
          details: contentCheck.details
        });
      }

      imagePath = `http://localhost:3001/uploads/${req.file.filename}`;
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: "Failed to process image",
        details: error.message
      });
    }
  }

  try {
    let categoryNames = [];
    if (categories && categories !== '[]') {
      try {
        categoryNames = JSON.parse(categories);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid categories format' });
      }
    }

    const productData = {
      name,
      desc,
      rating: rating ? parseFloat(rating) : null,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      img: imagePath,
    };

    if (categoryNames.length > 0) {
      productData.categories = {
        connect: categoryNames.map(name => ({ name }))
      };
    }

    const product = await prisma.product.create({
      data: productData,
      include: {
        categories: true
      }
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
});

app.get("/products", async (req, res) => {
  const category = req.query.category;
  try {
    const products = await prisma.product.findMany({
      where: category ? {
        categories: {
          some: {
            name: category
          }
        }
      } : {},
      include: {
        categories: true
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error getting products" });
  }
});

app.get("/products/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  try {
    const product = await prisma.product.findUnique({
      where: { productId: productId },
      include: {
        categories: true
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error getting product" });
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
    res.status(500).json({ error: "Error deleting product" });
  }
});

app.post("/services", upload.single('image'), async (req, res) => {
  const { name, desc, rating, price, quantity, categories } = req.body;
  let imagePath = null;

  if (req.file) {
    try {
      const contentCheck = await checkImageContent(req.file.path);

      if (!contentCheck.isAppropriate) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          error: "Image contains inappropriate content",
          details: contentCheck.details
        });
      }

      imagePath = `http://localhost:3001/uploads/${req.file.filename}`;
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: "Failed to process image",
        details: error.message
      });
    }
  }

  try {
    let categoryNames = [];
    if (categories && categories !== '[]') {
      try {
        categoryNames = JSON.parse(categories);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid categories format' });
      }
    }

    const serviceData = {
      name,
      desc,
      rating: rating ? parseFloat(rating) : null,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      img: imagePath,
    };

    if (categoryNames.length > 0) {
      serviceData.categories = {
        connect: categoryNames.map(name => ({ name }))
      };
    }

    const service = await prisma.service.create({
      data: serviceData,
      include: {
        categories: true
      }
    });

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: "Error creating service" });
  }
});

app.get("/services", async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        categories: true
      }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error getting services" });
  }
});

app.get("/services/:serviceId", async (req, res) => {
  const serviceId = parseInt(req.params.serviceId);
  try {
    const service = await prisma.service.findUnique({
      where: { serviceId: serviceId },
      include: {
        categories: true
      }
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: "Error getting service" });
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
    res.status(500).json({ error: "Error deleting service" });
  }
});

app.get("/user", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error getting users" });
  }
});

app.post("/user", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        ...req.body, 
        password: hash
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

app.get("/categories", async (req, res) => {
  try {
    const productCategories = await prisma.productCategory.findMany();
    const serviceCategories = await prisma.serviceCategory.findMany();
    
    res.json({
      productCategories,
      serviceCategories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/init-categories", async (req, res) => {
  try {
    await prisma.productCategory.deleteMany({});
    await prisma.serviceCategory.deleteMany({});

    const productCategories = [
      "Academic Materials",
      "Home Essentials",
      "Clothing",
      "Accessories",
      "Technology & Electronics",
      "Food & Beverage",
      "Entertainment",
      "Collectibles",
      "Miscellaneous"
    ];

    const serviceCategories = [
      "Academic Help",
      "Technology Support",
      "Photography & Videography",
      "Beauty & Personal Care",
      "Automotive Services",
      "Creative Work",
      "Pet Services",
      "Entertainment & Event Planning",
      "Miscellaneous"
    ];

    for (const name of productCategories) {
      try {
        await prisma.productCategory.create({
          data: { name }
        });
      } catch (error) {}
    }

    for (const name of serviceCategories) {
      try {
        await prisma.serviceCategory.create({
          data: { name }
        });
      } catch (error) {}
    }

    const finalProductCategories = await prisma.productCategory.findMany({
      orderBy: { name: 'asc' }
    });
    const finalServiceCategories = await prisma.serviceCategory.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      productCategories: finalProductCategories,
      serviceCategories: finalServiceCategories,
      message: "Categories reset and initialized successfully"
    });

  } catch (error) {
    res.status(500).json({ 
      error: "Error initializing categories",
      details: error.message
    });
  }
});

const authenticate = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    });
    req.user = user ?? undefined;
    next();
  } catch (err) {
    req.user = undefined;
    next();
  }
};

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