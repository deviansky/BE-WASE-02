const express = require('express');
const router = express.Router();
const kegiatanController = require('../controllers/kegiatanController');

router.get('/', kegiatanController.getAllKegiatan);
router.get('/:id', kegiatanController.getKegiatanById);
router.post('/', kegiatanController.createKegiatan);
router.put('/:id', kegiatanController.updateKegiatan);
router.delete('/:id', kegiatanController.deleteKegiatan);

module.exports = router;
