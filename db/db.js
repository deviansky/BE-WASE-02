require('dotenv').config();
// db/db.js
const mysql = require('mysql2/promise');

// Konfigurasi database
const dbConfig = {
  host: process.env.DB_HOST || 'mysql.railway.internal',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'PwqZSguMkMDXLSDluaYWTWfEEvFwHZzz',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 3306
};

// Fungsi untuk membuat koneksi database
async function createDBConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Berhasil terhubung ke database');
    return connection;
  } catch (error) {
    console.error('Gagal terhubung ke database:', error);
    throw error;
  }
}

// Helper untuk eksekusi query dengan penanganan error
async function executeQuery(query, params = []) {
  let connection;
  try {
    connection = await createDBConnection();
    const [result] = await connection.execute(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  createDBConnection,
  executeQuery
};