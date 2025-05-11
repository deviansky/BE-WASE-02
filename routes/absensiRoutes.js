const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensiController');

router.get('/', absensiController.getAllAbsensi);
router.get('/kegiatan/:id_kegiatan', absensiController.getAbsensiByKegiatan);
router.post('/', absensiController.createAbsensi);
router.put('/:id', absensiController.updateAbsensi);
router.delete('/:id', absensiController.deleteAbsensi);

module.exports = router;
