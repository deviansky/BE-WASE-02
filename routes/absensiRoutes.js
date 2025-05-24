const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensiController');

// GET /api/absensi/kegiatan/:id_kegiatan
router.get('/kegiatan/:id_kegiatan', absensiController.getByKegiatan);
// POST /api/absensi/:id_kegiatan
router.post('/:id_kegiatan', absensiController.create);

module.exports = router;