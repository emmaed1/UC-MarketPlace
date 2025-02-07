const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const prisma = new PrismaClient();
const app = express();
const port = 3001;

// Ensure upload directory exists
const uploadDir = "public/images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const generateJwt = (user) => {
  return jwt.sign({ email: user.email }, "JWT_SECRET");
};

// Middleware
app.use(express.json());
app.use(cors());
app.use("/images", express.static(uploadDir));

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File is too large. Maximum size is 5MB." });
    }
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

// Product Routes
app.post("/products", upload.single("image"), async (req, res) => {
  console.log("Received request body:", req.body);
  console.log("Received file:", req.file);

  try {
    const { name, desc, rating, price, quantity } = req.body;
    const img = req.file ? `/images/${req.file.filename}` : null;

    console.log("Attempting to create product with data:", {
      name,
      desc,
      rating,
      price,
      quantity,
      img,
    });

    const product = await prisma.product.create({
      data: {
        name,
        desc,
        rating: rating ? parseFloat(rating) : 5,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        img,
      },
    });

    console.log("Product created successfully:", product);
    res.json(product);
  } catch (error) {
    console.error("Error creating product:", error);

    // If there was an uploaded file but database creation failed, clean it up
    if (req.file) {
      fs.unlink(req.file.path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      });
    }

    res.status(500).json({
      error: "Error creating product",
      details: error.message,
    });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ error: "Error getting products", details: error.message });
  }
});

app.get("/products/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  try {
    const product = await prisma.product.findUnique({
      where: { productId: productId },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ error: "Error getting product", details: error.message });
  }
});

app.delete("/products/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  try {
    // First get the product to find its image path
    const product = await prisma.product.findUnique({
      where: { productId: productId },
    });

    const deletedProduct = await prisma.product.delete({
      where: { productId: productId },
    });

    // If product had an image, delete it
    if (product?.img) {
      const imagePath = path.join(__dirname, product.img);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting image file:", err);
      });
    }

    res.json(deletedProduct);
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ error: "Error deleting product", details: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Upload directory is set to: ${path.resolve(uploadDir)}`);
});
