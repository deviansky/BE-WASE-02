const { createDBConnection } = require('../db/db');

// GET semua pemasukan/pengeluaran
exports.getAllPemasukan = async (req, res) => {
    try {
        const conn = await createDBConnection();
        const [rows] = await conn.execute('SELECT * FROM pemasukan ORDER BY created_at DESC');
        await conn.end();
        res.json(rows);
    } catch (error) {
        console.error('❌ Error ambil pemasukan:', error);
        res.status(500).json({ message: 'Gagal mengambil data pemasukan/pengeluaran' });
    }
};

// POST tambah data
exports.createPemasukan = async (req, res) => {
    const { bulan, jumlah, deskripsi, tipe } = req.body;
    if (!bulan || !jumlah || !deskripsi || !tipe) {
        return res.status(400).json({ message: 'Semua field wajib diisi termasuk tipe' });
    }

    try {
        const conn = await createDBConnection();
        await conn.execute(
            'INSERT INTO pemasukan (bulan, jumlah, deskripsi, tipe, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [bulan, jumlah, deskripsi, tipe]
        );
        await conn.end();
        res.status(201).json({ message: '✅ Data berhasil ditambahkan' });
    } catch (error) {
        console.error('❌ Gagal tambah data:', error);
        res.status(500).json({ message: 'Gagal menambahkan data' });
    }
};

// PUT update data
exports.updatePemasukan = async (req, res) => {
    const { id } = req.params;
    const { bulan, jumlah, deskripsi, tipe } = req.body;

    try {
        const conn = await createDBConnection();
        const [result] = await conn.execute(
            'UPDATE pemasukan SET bulan = ?, jumlah = ?, deskripsi = ?, tipe = ?, updated_at = NOW() WHERE id = ?',
            [bulan, jumlah, deskripsi, tipe, id]
        );
        await conn.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        res.json({ message: '✅ Data berhasil diperbarui' });
    } catch (error) {
        console.error('❌ Gagal update data:', error);
        res.status(500).json({ message: 'Gagal memperbarui data' });
    }
};

// DELETE data
exports.deletePemasukan = async (req, res) => {
    const { id } = req.params;

    try {
        const conn = await createDBConnection();
        const [result] = await conn.execute('DELETE FROM pemasukan WHERE id = ?', [id]);
        await conn.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        res.json({ message: '✅ Data berhasil dihapus' });
    } catch (error) {
        console.error('❌ Gagal hapus data:', error);
        res.status(500).json({ message: 'Gagal menghapus data' });
    }
};
