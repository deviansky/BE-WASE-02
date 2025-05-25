const path = require('path');
const fs = require('fs');
const { createDBConnection } = require('../db/db');

// Middleware multer
const multer = require('multer');
const uploadFolder = path.join(__dirname, '..', 'uploads', 'notulen');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Pastikan folder ada
        if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Middleware upload
exports.uploadNotulenMiddleware = upload.single('file');

// Handler simpan notulen
exports.createNotulen = async (req, res) => {
    try {
        const { id_kegiatan, file } = req.body;

        if (!id_kegiatan || !file) {
            return res.status(400).json({ message: 'id_kegiatan dan file wajib diisi' });
        }

        // Ekstrak data base64
        const matches = file.match(/^data:(.+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return res.status(400).json({ message: 'Format file base64 tidak valid' });
        }

        const mimeType = matches[1];
        const base64Data = matches[2];
        const extension = mimeType.split('/')[1];
        const filename = `${Date.now()}.${extension}`;
        const filePath = path.join(uploadFolder, filename);

        // Pastikan folder ada
        if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

        // Simpan file
        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

        // Simpan ke DB
        const conn = await createDBConnection();
        await conn.execute(`
            INSERT INTO notulen (id_kegiatan, file, created_at, update_at)
            VALUES (?, ?, NOW(), NOW())
        `, [id_kegiatan, filename]);
        await conn.end();

        res.status(201).json({ message: '✅ Notulen berhasil disimpan', filename });
    } catch (error) {
        console.error('❌ Gagal menyimpan notulen:', error);
        res.status(500).json({ message: 'Gagal menyimpan notulen' });
    }
};



// Handler update notulen (ganti file lama)
exports.updateNotulen = async (req, res) => {
    const { id } = req.params;
    const filePath = req.file ? req.file.filename : null;

    if (!filePath) {
        return res.status(400).json({ message: 'File baru wajib diunggah' });
    }

    try {
        const conn = await createDBConnection();

        // Ambil data notulen lama untuk hapus file lama
        const [rows] = await conn.execute('SELECT file FROM notulen WHERE id = ?', [id]);
        if (rows.length === 0) {
            await conn.end();
            return res.status(404).json({ message: 'Notulen tidak ditemukan' });
        }

        const oldFile = rows[0].file;
        const oldPath = path.join(uploadFolder, oldFile);

        // Update file baru di DB
        await conn.execute(`
        UPDATE notulen SET file = ?, update_at = NOW() WHERE id = ?
      `, [filePath, id]);

        await conn.end();

        // Hapus file lama
        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }

        res.json({ message: '✅ Notulen berhasil diperbarui' });
    } catch (error) {
        console.error('❌ Gagal update notulen:', error);
        res.status(500).json({ message: 'Gagal update notulen' });
    }
};

exports.getNotulenByKegiatan = async (req, res) => {
    const { id_kegiatan } = req.params;
    try {
        const conn = await createDBConnection();
        const [rows] = await conn.execute(`
        SELECT * FROM notulen WHERE id_kegiatan = ?
      `, [id_kegiatan]);
        await conn.end();

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Notulen tidak ditemukan' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('❌ Gagal mengambil notulen:', error);
        res.status(500).json({ message: 'Gagal mengambil notulen' });
    }
};
  
