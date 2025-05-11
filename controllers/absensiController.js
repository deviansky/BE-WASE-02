const { createDBConnection } = require('../db/db');

// GET semua absensi
exports.getAllAbsensi = async (req, res) => {
    try {
        const conn = await createDBConnection();
        const [rows] = await conn.execute(`
      SELECT a.*, p.nama AS nama_penghuni, k.judul AS judul_kegiatan
      FROM absensi a
      JOIN penghunis p ON a.id_penghuni = p.id
      JOIN kegiatans k ON a.id_kegiatan = k.id
      ORDER BY a.created_at DESC
    `);
        await conn.end();
        res.json(rows);
    } catch (error) {
        console.error('❌ Error get absensi:', error);
        res.status(500).json({ message: 'Gagal mengambil data absensi' });
    }
};

// GET absensi berdasarkan kegiatan
exports.getAbsensiByKegiatan = async (req, res) => {
    const { id_kegiatan } = req.params;
    try {
        const conn = await createDBConnection();
        const [rows] = await conn.execute(`
      SELECT a.*, p.nama AS nama_penghuni
      FROM absensi a
      JOIN penghunis p ON a.id_penghuni = p.id
      WHERE a.id_kegiatan = ?
    `, [id_kegiatan]);
        await conn.end();
        res.json(rows);
    } catch (error) {
        console.error('❌ Error get absensi by kegiatan:', error);
        res.status(500).json({ message: 'Gagal mengambil absensi kegiatan' });
    }
};

// POST tambah absensi
exports.createAbsensi = async (req, res) => {
    const { id_kegiatan, absensi_list } = req.body; // array: [{ id_penghuni, status_kehadiran }, ...]

    if (!Array.isArray(absensi_list)) {
        return res.status(400).json({ message: 'Format absensi_list harus array' });
    }

    try {
        const conn = await createDBConnection();

        // Hapus absensi lama untuk kegiatan tersebut (opsional, tergantung logika aplikasi)
        await conn.execute('DELETE FROM absensi WHERE id_kegiatan = ?', [id_kegiatan]);

        // Insert baru
        for (const item of absensi_list) {
            await conn.execute(`
        INSERT INTO absensi (id_kegiatan, id_penghuni, status_kehadiran, created_at, updated_at)
        VALUES (?, ?, ?, NOW(), NOW())
      `, [id_kegiatan, item.id_penghuni, item.status_kehadiran]);
        }

        await conn.end();
        res.status(201).json({ message: 'Absensi berhasil disimpan' });
    } catch (error) {
        console.error('❌ Error create absensi:', error);
        res.status(500).json({ message: 'Gagal menyimpan data absensi' });
    }
};

// PUT update 1 absensi
exports.updateAbsensi = async (req, res) => {
    const { id } = req.params;
    const { status_kehadiran } = req.body;

    try {
        const conn = await createDBConnection();
        const [result] = await conn.execute(`
      UPDATE absensi SET status_kehadiran = ?, updated_at = NOW() WHERE id = ?
    `, [status_kehadiran, id]);
        await conn.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Absensi tidak ditemukan' });
        }

        res.json({ message: 'Absensi berhasil diperbarui' });
    } catch (error) {
        console.error('❌ Error update absensi:', error);
        res.status(500).json({ message: 'Gagal update absensi' });
    }
};

// DELETE absensi
exports.deleteAbsensi = async (req, res) => {
    const { id } = req.params;

    try {
        const conn = await createDBConnection();
        const [result] = await conn.execute('DELETE FROM absensi WHERE id = ?', [id]);
        await conn.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Absensi tidak ditemukan' });
        }

        res.json({ message: 'Absensi berhasil dihapus' });
    } catch (error) {
        console.error('❌ Error delete absensi:', error);
        res.status(500).json({ message: 'Gagal hapus absensi' });
    }
};
