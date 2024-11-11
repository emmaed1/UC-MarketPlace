const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.use(bodyParser.json());

// api for product listings
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
        res.status(500).json({error: 'Error creating product'});
    }
});

app.get('/products', async(req, res) => {
    try{
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({error: 'Error getting products'});
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


// api for services listing
app.post("/services", async (req, res) => {
    const { title, desc, rating, price, quantity } = req.body;

    try {
        const service = await prisma.service.create({
            data: {
                title,
                desc,
                rating,
                price,
                quantity
            },
        });
        res.json(service)
    }
    catch (error) {
        res.status(500).json({error: 'Error creating service'});
    }
});

app.get('/services', async(req, res) => {
    try{
        const services = await prisma.service.findMany();
        res.json(services);
    } catch (error) {
        res.status(500).json({error: 'Error getting services'});
    }
});

app.delete('/services/:serviceId', async (req, res) => {
    const serviceId = parseInt(req.params.serviceId);
    try{
        const deletedService = await prisma.service.delete({
            where: {serviceId: serviceId}
        });
        res.json(deletedService);
    } catch (error) {
        res.status(500).json({error: "Errors deleting service"});
    }   
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});