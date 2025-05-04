// routes/statisticsRoutes.js
const express = require('express');
const { executeQuery } = require('../db/db');
const router = express.Router();

// Fungsi helper untuk timestamp
const getCurrentTimestamp = () => {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

// Validasi data statistik
const validateStatisticsData = (data, type) => {
  switch (type) {
    case 'monthly':
      const { month, month_number, year, sales, revenue } = data;
      if (!month || !month_number || !year || sales === undefined || revenue === undefined) {
        return { valid: false, message: 'Semua field harus diisi' };
      }
      break;
    case 'quarterly':
      const { quarter, qYear, qSales, qRevenue } = data;
      if (!quarter || !qYear || qSales === undefined || qRevenue === undefined) {
        return { valid: false, message: 'Semua field harus diisi' };
      }
      break;
    case 'yearly':
      const { yYear, ySales, yRevenue } = data;
      if (!yYear || ySales === undefined || yRevenue === undefined) {
        return { valid: false, message: 'Semua field harus diisi' };
      }
      break;
    default:
      return { valid: false, message: 'Tipe statistik tidak valid' };
  }
  
  return { valid: true };
};

// GET statistik bulanan
router.get('/monthly', async (req, res, next) => {
  const year = req.query.year || new Date().getFullYear();
  
  try {
    const statistics = await executeQuery(
      'SELECT month, month_number, sales, revenue FROM monthly_statistics WHERE year = ? ORDER BY month_number',
      [year]
    );
    res.json(statistics);
  } catch (error) {
    next(error);
  }
});

// GET statistik triwulanan
router.get('/quarterly', async (req, res, next) => {
  const year = req.query.year || new Date().getFullYear();
  
  try {
    const statistics = await executeQuery(
      'SELECT quarter, sales, revenue FROM quarterly_statistics WHERE year = ? ORDER BY quarter',
      [year]
    );
    res.json(statistics);
  } catch (error) {
    next(error);
  }
});

// GET statistik tahunan
router.get('/yearly', async (req, res, next) => {
  try {
    const statistics = await executeQuery(
      'SELECT year, sales, revenue FROM yearly_statistics ORDER BY year'
    );
    res.json(statistics);
  } catch (error) {
    next(error);
  }
});

// POST menambah/update statistik bulanan
router.post('/monthly', async (req, res, next) => {
  const { month, month_number, year, sales, revenue } = req.body;
  
  const validation = validateStatisticsData(req.body, 'monthly');
  if (!validation.valid) {
    return res.status(400).json({ 
      success: false, 
      message: validation.message 
    });
  }
  
  const currentTime = getCurrentTimestamp();
  
  try {
    await executeQuery(
      `INSERT INTO monthly_statistics 
        (month, month_number, year, sales, revenue, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
        sales = VALUES(sales), 
        revenue = VALUES(revenue), 
        updated_at = VALUES(updated_at)`,
      [month, month_number, year, sales, revenue, currentTime, currentTime]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Data statistik bulanan berhasil disimpan',
      data: {
        month,
        month_number,
        year,
        sales,
        revenue,
        updated_at: currentTime
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST menambah/update statistik triwulanan
router.post('/quarterly', async (req, res, next) => {
  const { quarter, year, sales, revenue } = req.body;
  
  const validation = validateStatisticsData(
    { quarter, qYear: year, qSales: sales, qRevenue: revenue }, 
    'quarterly'
  );
  
  if (!validation.valid) {
    return res.status(400).json({ 
      success: false, 
      message: validation.message 
    });
  }
  
  const currentTime = getCurrentTimestamp();

  try {
    await executeQuery(
      `INSERT INTO quarterly_statistics 
        (quarter, year, sales, revenue, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
        sales = VALUES(sales), 
        revenue = VALUES(revenue), 
        updated_at = VALUES(updated_at)`,
      [quarter, year, sales, revenue, currentTime, currentTime]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Data statistik triwulanan berhasil disimpan',
      data: {
        quarter,
        year,
        sales,
        revenue,
        updated_at: currentTime
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST menambah/update statistik tahunan
router.post('/yearly', async (req, res, next) => {
  const { year, sales, revenue } = req.body;
  
  const validation = validateStatisticsData(
    { yYear: year, ySales: sales, yRevenue: revenue }, 
    'yearly'
  );
  
  if (!validation.valid) {
    return res.status(400).json({ 
      success: false, 
      message: validation.message 
    });
  }
  
  const currentTime = getCurrentTimestamp();
  
  try {
    await executeQuery(
      `INSERT INTO yearly_statistics 
        (year, sales, revenue, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
        sales = VALUES(sales), 
        revenue = VALUES(revenue), 
        updated_at = VALUES(updated_at)`,
      [year, sales, revenue, currentTime, currentTime]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Data statistik tahunan berhasil disimpan',
      data: {
        year,
        sales,
        revenue,
        updated_at: currentTime
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE statistik bulanan
router.delete('/monthly/:year/:month_number', async (req, res, next) => {
  const { year, month_number } = req.params;

  try {
    const result = await executeQuery(
      'DELETE FROM monthly_statistics WHERE year = ? AND month_number = ?',
      [year, month_number]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data statistik bulanan tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data statistik bulanan berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
});

// DELETE statistik triwulanan (endpoint tambahan)
router.delete('/quarterly/:year/:quarter', async (req, res, next) => {
  const { year, quarter } = req.params;

  try {
    const result = await executeQuery(
      'DELETE FROM quarterly_statistics WHERE year = ? AND quarter = ?',
      [year, quarter]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data statistik triwulanan tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data statistik triwulanan berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
});

// DELETE statistik tahunan (endpoint tambahan)
router.delete('/yearly/:year', async (req, res, next) => {
  const { year } = req.params;

  try {
    const result = await executeQuery(
      'DELETE FROM yearly_statistics WHERE year = ?',
      [year]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data statistik tahunan tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data statistik tahunan berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;