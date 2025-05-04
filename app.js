// app.js
const express = require('express');
const cors = require('cors');
const { createDBConnection } = require('./db/db');
const productRoutes = require('./routes/productRoutes');
const penghuniRoutes = require('./routes/penghuniRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Server berjalan dan koneksi database siap!');
});

// Register route modules
app.use('/products', productRoutes);
app.use('/penghunis', penghuniRoutes);
app.use('/statistics', statisticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Terjadi kesalahan pada server' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});