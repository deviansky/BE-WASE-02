// routes/notulenRoutes.js
const express = require('express');
const router = express.Router();
const {
    createNotulen,
    updateNotulen,
    getNotulenByKegiatan
  } = require('../controllers/notulenController');
const multer = require('multer');
const path = require('path');

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/notulen');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// POST: Upload notulen baru
router.post('/upload', createNotulen);

// PUT: Update notulen
router.put('/:id', updateNotulen);

// GET: Ambil notulen berdasarkan id_kegiatan
router.get('/kegiatan/:id_kegiatan', getNotulenByKegiatan);


module.exports = router;
