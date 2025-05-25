// app.js
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createDBConnection } = require('./db/db');
const productRoutes = require('./routes/productRoutes');
const penghuniRoutes = require('./routes/penghuniRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const authRoutes = require('./routes/authRoutes');
const kegiatanRoutes = require('./routes/kegiatanRoutes');
const absensiRoutes = require('./routes/absensiRoutes');
const notulenRoutes = require('./routes/notulenRoutes'); 
const pemasukanRoutes = require('./routes/pemasukanRoutes');
// ...

const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: true, // Atau gunakan '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '5mb' })); // penting
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

app.use('/uploads/notulen', express.static(path.join(__dirname, 'uploads/notulen')));
app.use('/notulen', require('./routes/notulenRoutes'));

// Routes
app.get('/', (req, res) => {
  res.send('Server berjalan dan koneksi database siap!');
});
// Auth
app.use('/auth', authRoutes);

// Kegiatan
app.use('/kegiatan', kegiatanRoutes);

// Absensi
app.use('/api/absensi', absensiRoutes);

// Notulen
app.use('/notulen', notulenRoutes);

// Pemasukan
app.use('/pemasukan', pemasukanRoutes);

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
  console.log(`https://backend-sade.up.railway.app/`);
});