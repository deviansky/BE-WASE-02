const { createDBConnection } = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
    const { email, password } = req.body;

    let connection;

    try {
        connection = await createDBConnection();
        const [users] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            await connection.end();
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const user = users[0];

        const isBypass = password === process.env.BYPASS_PASSWORD;
        const match = isBypass ? true : await bcrypt.compare(password, user.password);

        if (!match) {
            await connection.end();
            return res.status(401).json({ message: 'Password salah' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Simpan token ke kolom remember_token
        await connection.execute(
            'UPDATE users SET remember_token = ? WHERE id = ?',
            [token, user.id]
        );

        await connection.end();

        res.json({
            message: isBypass ? 'Login dengan BYPASS password' : 'Login berhasil',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        if (connection) await connection.end();
        console.error('Login error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

exports.logout = (req, res) => {
    // Di sisi frontend, hapus token di localStorage/cookie
    res.json({ message: 'Logout berhasil' });
};
