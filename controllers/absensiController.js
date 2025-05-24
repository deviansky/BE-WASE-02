const { createDBConnection } = require('../db/db');

const absensiController = {
  // GET - Ambil data absensi berdasarkan kegiatan
  getByKegiatan: async (req, res) => {
    let connection;
    try {
      const { id_kegiatan } = req.params;
      connection = await createDBConnection();

      const query = `
        SELECT a.*, p.nama as nama_penghuni 
        FROM absensi a 
        JOIN penghunis p ON a.id_penghuni = p.id 
        WHERE a.id_kegiatan = ?
      `;

      const [rows] = await connection.execute(query, [id_kegiatan]);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching absensi:', error);
      res.status(500).json({ error: 'Gagal mengambil data absensi' });
    } finally {
      if (connection) await connection.end();
    }
  },

  // POST - Simpan/Update absensi
  create: async (req, res) => {
    let connection;
    try {
      const { id_kegiatan } = req.params;
      const { absensi_list } = req.body;

      connection = await createDBConnection();
      console.log('Mulai transaksi');
      await connection.beginTransaction();

      console.log('Hapus absensi lama');
      await connection.execute(
        'DELETE FROM absensi WHERE id_kegiatan = ?',
        [id_kegiatan]
      );

      for (const item of absensi_list) {
        await connection.execute(
          'INSERT INTO absensi (id_kegiatan, id_penghuni, status_kehadiran) VALUES (?, ?, ?)',
          [id_kegiatan, item.id_penghuni, item.status_kehadiran]
        );
      }

      console.log('Commit');
      await connection.commit();
      res.json({ message: 'Absensi berhasil disimpan' });
    } catch (error) {
      if (connection) await connection.rollback();
      console.error('Error saving absensi:', error);
      res.status(500).json({ error: 'Gagal menyimpan absensi' });
    } finally {
      if (connection) await connection.end();
    }
  }
};

module.exports = absensiController;
