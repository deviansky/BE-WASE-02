require('dotenv').config();
const { createDBConnection } = require('./db/db');

(async () => {
  try {
    await createDBConnection();
    console.log('Tes koneksi sukses ✅');
  } catch (err) {
    console.error('Tes koneksi gagal ❌:', err.message);
  }
})();