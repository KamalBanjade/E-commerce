// routes/productRouter.js
const express = require('express');
const Product = require('../models/product');
const router = express.Router();

// Add a new product
router.post('/products', async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const newProduct = new Product({ name, description, price });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

module.exports = router;
