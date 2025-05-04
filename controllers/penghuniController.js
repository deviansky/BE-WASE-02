const createDBConnection = require('../db/db');

exports.getAllPenghunis = async (req, res) => {
  try {
    const connection = await createDBConnection();
    const [rows] = await connection.execute(`SELECT * FROM penghunis`);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data' });
  }
};

