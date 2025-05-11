const express = require('express');
const router = express.Router();
const {
  getAllPemasukan,
  createPemasukan,
  updatePemasukan,
  deletePemasukan
} = require('../controllers/pemasukanController');

router.get('/', getAllPemasukan);
router.post('/', createPemasukan);
router.put('/:id', updatePemasukan);
router.delete('/:id', deletePemasukan);

module.exports = router;
