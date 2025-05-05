const { createDBConnection } = require('../db/db');

// GET semua kegiatan
exports.getAllKegiatan = async (req, res) => {
    try {
        const conn = await createDBConnection();
        const [rows] = await conn.execute('SELECT * FROM kegiatans ORDER BY tanggal ASC');
        await conn.end();
        res.json(rows);
    } catch (error) {
        console.error('Error mengambil kegiatan:', error);
        res.status(500).json({ message: 'Gagal mengambil data kegiatan' });
    }
};

// GET 1 kegiatan by ID
exports.getKegiatanById = async (req, res) => {
    const { id } = req.params;
    try {
        const conn = await createDBConnection();
        const [rows] = await conn.execute('SELECT * FROM kegiatans WHERE id = ?', [id]);
        await conn.end();

        if (rows.length === 0) return res.status(404).json({ message: 'Kegiatan tidak ditemukan' });

        res.json(rows[0]);
    } catch (error) {
        console.error('Error mengambil detail kegiatan:', error);
        res.status(500).json({ message: 'Gagal mengambil data kegiatan' });
    }
};

// POST tambah kegiatan
exports.createKegiatan = async (req, res) => {
    const { judul, deskripsi, tanggal, waktu_acara } = req.body;
    try {
        const conn = await createDBConnection();
        const [result] = await conn.execute(
            'INSERT INTO kegiatans (judul, deskripsi, tanggal, waktu_acara, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [judul, deskripsi, tanggal, waktu_acara]
        );
        await conn.end();
        res.status(201).json({ message: 'Kegiatan berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        console.error('Error menambah kegiatan:', error);
        res.status(500).json({ message: 'Gagal menambah kegiatan' });
    }
};

// PUT update kegiatan
exports.updateKegiatan = async (req, res) => {
    const { id } = req.params;
    const { judul, deskripsi, tanggal, waktu_acara } = req.body;
    try {
        const conn = await createDBConnection();
        const [result] = await conn.execute(
            'UPDATE kegiatans SET judul = ?, deskripsi = ?, tanggal = ?, waktu_acara = ?, updated_at = NOW() WHERE id = ?',
            [judul, deskripsi, tanggal, waktu_acara, id]
        );
        await conn.end();

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Kegiatan tidak ditemukan' });

        res.json({ message: 'Kegiatan berhasil diperbarui' });
    } catch (error) {
        console.error('Error update kegiatan:', error);
        res.status(500).json({ message: 'Gagal memperbarui kegiatan' });
    }
};

// DELETE kegiatan
exports.deleteKegiatan = async (req, res) => {
    const { id } = req.params;
    try {
        const conn = await createDBConnection();
        const [result] = await conn.execute('DELETE FROM kegiatans WHERE id = ?', [id]);
        await conn.end();

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Kegiatan tidak ditemukan' });

        res.json({ message: 'Kegiatan berhasil dihapus' });
    } catch (error) {
        console.error('Error hapus kegiatan:', error);
        res.status(500).json({ message: 'Gagal menghapus kegiatan' });
    }
};
