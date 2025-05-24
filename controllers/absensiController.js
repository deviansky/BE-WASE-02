const db = require('../db/db'); // Sesuaikan dengan config DB Anda

const absensiController = {
  // GET - Ambil data absensi berdasarkan kegiatan
  getByKegiatan: async (req, res) => {
    try {
      const { id_kegiatan } = req.params;
      
      const query = `
        SELECT a.*, p.nama as nama_penghuni 
        FROM absensi a 
        JOIN penghunis p ON a.id_penghuni = p.id 
        WHERE a.id_kegiatan = ?
      `;
      
      const [rows] = await db.execute(query, [id_kegiatan]);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching absensi:', error);
      res.status(500).json({ error: 'Gagal mengambil data absensi' });
    }
  },

  // POST - Simpan/Update absensi
  create: async (req, res) => {
    try {
      const { id_kegiatan } = req.params;
      const { absensi_list } = req.body; // Array of {id_penghuni, status_kehadiran}

      // Start transaction
      await db.beginTransaction();

      // Delete existing absensi untuk kegiatan ini
      await db.execute('DELETE FROM absensi WHERE id_kegiatan = ?', [id_kegiatan]);

      // Insert new absensi data
      for (const item of absensi_list) {
        await db.execute(
          'INSERT INTO absensi (id_kegiatan, id_penghuni, status_kehadiran) VALUES (?, ?, ?)',
          [id_kegiatan, item.id_penghuni, item.status_kehadiran]
        );
      }

      await db.commit();
      res.json({ message: 'Absensi berhasil disimpan' });
    } catch (error) {
      await db.rollback();
      console.error('Error saving absensi:', error);
      res.status(500).json({ error: 'Gagal menyimpan absensi' });
    }
  }
};

module.exports = absensiController;