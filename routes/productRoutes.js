// routes/productRoutes.js
const express = require('express');
const { executeQuery } = require('../db/db');
const router = express.Router();

// GET semua produk dengan kategori
router.get('/', async (req, res, next) => {
  try {
    const products = await executeQuery(`
      SELECT 
        p.id, p.name, p.price, p.description, 
        GROUP_CONCAT(c.name) AS categories
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      GROUP BY p.id
    `);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Endpoint lain untuk produk bisa ditambahkan di sini

module.exports = router;