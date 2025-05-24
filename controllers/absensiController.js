const { createDBConnection } = require('../db/db');

const absensiController = {
  // GET - Ambil data absensi berdasarkan kegiatan
  getByKegiatan: async (req, res) => {
    let connection;
    try {
      const { id_kegiatan } = req.params;
      
      // Validasi parameter
      if (!id_kegiatan) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID kegiatan diperlukan' 
        });
      }

      connection = await createDBConnection();

      const query = `
        SELECT a.*, p.nama as nama_penghuni 
        FROM absensi a 
        JOIN penghunis p ON a.id_penghuni = p.id 
        WHERE a.id_kegiatan = ?
      `;

      const [rows] = await connection.execute(query, [id_kegiatan]);
      
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching absensi:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Gagal mengambil data absensi',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (closeError) {
          console.error('Error closing connection:', closeError);
        }
      }
    }
  },

  // POST - Simpan/Update absensi
  create: async (req, res) => {
    let connection;
    try {
      console.log('=== DEBUG INFO ===');
      console.log('Params:', req.params);
      console.log('Body:', req.body);
      console.log('Content-Type:', req.headers['content-type']);
      
      const { id_kegiatan } = req.params;
      const { absensi_list } = req.body;

      // Validasi input
      if (!id_kegiatan) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID kegiatan diperlukan' 
        });
      }

      if (!absensi_list || !Array.isArray(absensi_list)) {
        return res.status(400).json({ 
          success: false, 
          message: 'absensi_list harus berupa array dan tidak boleh kosong',
          received: typeof absensi_list
        });
      }

      if (absensi_list.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'absensi_list tidak boleh kosong' 
        });
      }

      // Validasi setiap item dalam absensi_list
      for (let i = 0; i < absensi_list.length; i++) {
        const item = absensi_list[i];
        if (!item.id_penghuni || !item.status_kehadiran) {
          return res.status(400).json({ 
            success: false, 
            message: `Item ke-${i + 1}: id_penghuni dan status_kehadiran diperlukan`,
            item: item
          });
        }
      }

      connection = await createDBConnection();
      console.log('Database connection established');

      // Test koneksi database
      await connection.execute('SELECT 1');
      console.log('Database connection test successful');

      console.log('Starting transaction');
      await connection.beginTransaction();

      // Hapus absensi lama untuk kegiatan ini
      console.log('Deleting old absensi records for id_kegiatan:', id_kegiatan);
      const [deleteResult] = await connection.execute(
        'DELETE FROM absensi WHERE id_kegiatan = ?',
        [id_kegiatan]
      );
      console.log('Deleted rows:', deleteResult.affectedRows);

      // Insert absensi baru
      console.log('Inserting new absensi records');
      let insertedCount = 0;
      for (const item of absensi_list) {
        console.log('Inserting:', { 
          id_kegiatan, 
          id_penghuni: item.id_penghuni, 
          status_kehadiran: item.status_kehadiran 
        });
        
        const [insertResult] = await connection.execute(
          'INSERT INTO absensi (id_kegiatan, id_penghuni, status_kehadiran) VALUES (?, ?, ?)',
          [id_kegiatan, item.id_penghuni, item.status_kehadiran]
        );
        
        console.log('Insert result:', insertResult);
        insertedCount++;
      }

      console.log('Committing transaction');
      await connection.commit();
      
      console.log('Transaction committed successfully');
      res.json({ 
        success: true,
        message: 'Absensi berhasil disimpan',
        data: {
          id_kegiatan: parseInt(id_kegiatan),
          total_records: insertedCount,
          deleted_old_records: deleteResult.affectedRows
        }
      });

    } catch (error) {
      console.error('=== ERROR DETAILS ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error code:', error.code);
      console.error('Error errno:', error.errno);
      
      if (connection) {
        try {
          console.log('Rolling back transaction');
          await connection.rollback();
        } catch (rollbackError) {
          console.error('Error during rollback:', rollbackError);
        }
      }
      
      // Kirim error response yang lebih detail
      let errorMessage = 'Gagal menyimpan absensi';
      let statusCode = 500;
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        errorMessage = 'ID penghuni atau ID kegiatan tidak valid';
        statusCode = 400;
      } else if (error.code === 'ER_DUP_ENTRY') {
        errorMessage = 'Data absensi sudah ada';
        statusCode = 400;
      }
      
      res.status(statusCode).json({ 
        success: false, 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          code: error.code,
          errno: error.errno
        } : undefined
      });
    } finally {
      if (connection) {
        try {
          console.log('Closing database connection');
          await connection.end();
        } catch (closeError) {
          console.error('Error closing connection:', closeError);
        }
      }
    }
  }
};

module.exports = absensiController;