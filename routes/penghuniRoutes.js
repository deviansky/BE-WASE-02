// routes/penghuniRoutes.js
const express = require('express');
const { executeQuery } = require('../db/db');
const router = express.Router();

// Fungsi helper untuk mendapatkan timestamp saat ini
const getCurrentTimestamp = () => {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

// Validasi input penghuni
const validatePenghuniInput = (data) => {
  const { nama, prodi, angkatan, asalDaerah, noHp } = data;
  if (!nama || !prodi || !angkatan || !asalDaerah || !noHp) {
    return { valid: false, message: 'Semua field harus diisi' };
  }
  return { valid: true };
};

// GET semua penghuni
router.get('/', async (req, res, next) => {
  try {
    const penghunis = await executeQuery(`
      SELECT 
        id, nama, prodi, angkatan, asalDaerah, noHp, created_at, updated_at
      FROM penghunis
    `);
    res.json(penghunis);
  } catch (error) {
    next(error);
  }
});

// GET penghuni berdasarkan ID
router.get('/:id', async (req, res, next) => {
  try {
    const penghuni = await executeQuery(
      'SELECT * FROM penghunis WHERE id = ?',
      [req.params.id]
    );
    
    if (penghuni.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Penghuni tidak ditemukan' 
      });
    }
    
    res.status(200).json(penghuni[0]);
  } catch (error) {
    next(error);
  }
});

// POST menambahkan penghuni baru
router.post('/', async (req, res, next) => {
  const validation = validatePenghuniInput(req.body);
  if (!validation.valid) {
    return res.status(400).json({ 
      success: false, 
      message: validation.message 
    });
  }
  
  const { nama, prodi, angkatan, asalDaerah, noHp } = req.body;
  const currentTime = getCurrentTimestamp();
  
  try {
    const result = await executeQuery(
      `INSERT INTO penghunis 
        (nama, prodi, angkatan, asalDaerah, noHp, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nama, prodi, angkatan, asalDaerah, noHp, currentTime, currentTime]
    );
    
    const newPenghuni = {
      id: result.insertId,
      nama,
      prodi,
      angkatan,
      asalDaerah,
      noHp,
      created_at: currentTime,
      updated_at: currentTime
    };
    
    res.status(201).json({ 
      success: true, 
      message: 'Penghuni berhasil ditambahkan', 
      data: newPenghuni 
    });
  } catch (error) {
    next(error);
  }
});

// PUT mengupdate penghuni
router.put('/:id', async (req, res, next) => {
  const validation = validatePenghuniInput(req.body);
  if (!validation.valid) {
    return res.status(400).json({ 
      success: false, 
      message: validation.message 
    });
  }
  
  const id = req.params.id;
  const { nama, prodi, angkatan, asalDaerah, noHp } = req.body;
  const currentTime = getCurrentTimestamp();
  
  try {
    const result = await executeQuery(
      `UPDATE penghunis
       SET nama = ?, prodi = ?, angkatan = ?, asalDaerah = ?, noHp = ?, updated_at = ?
       WHERE id = ?`,
      [nama, prodi, angkatan, asalDaerah, noHp, currentTime, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Penghuni tidak ditemukan' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Penghuni berhasil diupdate', 
      data: {
        id: parseInt(id),
        nama,
        prodi,
        angkatan,
        asalDaerah,
        noHp,
        updated_at: currentTime
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE menghapus penghuni
router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  
  try {
    const result = await executeQuery(
      'DELETE FROM penghunis WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Penghuni tidak ditemukan' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Penghuni berhasil dihapus',
      data: { id: parseInt(id) }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;