const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.use(bodyParser.json());

app.post("/products", async (req, res) => {
    const { name, desc, rating, price, quantity } = req.body;

    try {
        const product = await prisma.product.create({
            data: {
                name,
                desc,
                rating,
                price,
                quantity
            },
        });
        res.json(product)
    }
    catch (error) {
        res.status(500).json({error: 'Error creating user'});
    }
});

app.get('/products', async(req, res) => {
    try{
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({error: 'Error getting users'});
    }
});

app.delete('/products/:productId', async (req, res) => {
    const productId = parseInt(req.params.productId);
    try{
        const deletedProduct = await prisma.product.delete({
            where: {productId: productId}
        });
        res.json(deletedProduct);
    } catch (error) {
        res.status(500).json({error: "Errors deleting product"});
    }   
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});