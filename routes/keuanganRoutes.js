const express = require('express');
const router = express.Router();

const {
  getAllKeuangan,
  createKeuangan,
  updateKeuangan,
  deleteKeuangan
} = require('../controllers/KeuanganController');

// Routes
router.get('/', getAllKeuangan);         
router.post('/', createKeuangan);        
router.put('/:id', updateKeuangan);      
router.delete('/:id', deleteKeuangan);  

module.exports = router;
