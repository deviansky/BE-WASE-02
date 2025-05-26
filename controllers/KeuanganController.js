const { createDBConnection } = require('../db/db');

exports.getAllKeuangan = async (req, res) => {
    try {
        const conn = await createDBConnection();
        const [rows] = await conn.execute(`
            SELECT 
                k.id, b.nama_bulan, t.nama_tahun AS tahun, 
                k.pemasukan, k.pengeluaran, k.created_at, k.updated_at
            FROM keuangan k
            JOIN bulan b ON k.id_bulan = b.id
            JOIN tahun t ON k.id_tahun = t.id
            ORDER BY t.nama_tahun DESC, b.id DESC
        `);
        await conn.end();
        res.json(rows);
    } catch (error) {
        console.error('❌ Error ambil keuangan:', error);
        res.status(500).json({ message: 'Gagal mengambil data keuangan' });
    }
};


exports.createKeuangan = async (req, res) => {
    const { id_bulan, id_tahun, pemasukan, pengeluaran } = req.body;
    if (!id_bulan || !id_tahun || pemasukan == null || pengeluaran == null) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    try {
        const conn = await createDBConnection();

        // Cek apakah sudah ada data keuangan untuk bulan & tahun itu
        const [check] = await conn.execute(
            'SELECT * FROM keuangan WHERE id_bulan = ? AND id_tahun = ?',
            [id_bulan, id_tahun]
        );
        if (check.length > 0) {
            await conn.end();
            return res.status(409).json({ message: 'Data untuk bulan & tahun ini sudah ada' });
        }

        await conn.execute(
            `INSERT INTO keuangan (id_bulan, id_tahun, pemasukan, pengeluaran, created_at, updated_at) 
             VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [id_bulan, id_tahun, pemasukan, pengeluaran]
        );
        await conn.end();
        res.status(201).json({ message: '✅ Data keuangan berhasil ditambahkan' });
    } catch (error) {
        console.error('❌ Gagal tambah keuangan:', error);
        res.status(500).json({ message: 'Gagal menambahkan data' });
    }
};


exports.updateKeuangan = async (req, res) => {
    const { id } = req.params;
    const { id_bulan, id_tahun, pemasukan, pengeluaran } = req.body;

    try {
        const conn = await createDBConnection();
        const [result] = await conn.execute(
            `UPDATE keuangan 
             SET id_bulan = ?, id_tahun = ?, pemasukan = ?, pengeluaran = ?, updated_at = NOW() 
             WHERE id = ?`,
            [id_bulan, id_tahun, pemasukan, pengeluaran, id]
        );
        await conn.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        res.json({ message: '✅ Data berhasil diperbarui' });
    } catch (error) {
        console.error('❌ Gagal update keuangan:', error);
        res.status(500).json({ message: 'Gagal memperbarui data' });
    }
};


exports.deleteKeuangan = async (req, res) => {
    const { id } = req.params;

    try {
        const conn = await createDBConnection();
        const [result] = await conn.execute('DELETE FROM keuangan WHERE id = ?', [id]);
        await conn.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        res.json({ message: '✅ Data berhasil dihapus' });
    } catch (error) {
        console.error('❌ Gagal hapus keuangan:', error);
        res.status(500).json({ message: 'Gagal menghapus data' });
    }
};
