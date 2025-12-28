const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER_NAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT), // Pastikan menjadi angka
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Mengizinkan koneksi SSL tanpa file .pem manual
            }
        },
        // Tambahkan pool agar koneksi lebih stabil terhadap latency cloud
        pool: {
            max: 5,
            min: 0,
            acquire: 60000,
            idle: 10000
        }
    }
);

// Fungsi untuk sinkronisasi tabel
const syncTables = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Berhasil terhubung ke Aiven MySQL.');
        
        await sequelize.sync({ alter: true });
        console.log('✅ Semua tabel berhasil disinkronisasi.');
    } catch (error) {
        console.error('❌ Gagal sinkronisasi:', error.message);
        // Jika masih timeout, cetak detail untuk debug
        if (error.message.includes('ETIMEDOUT')) {
            console.log('Tip: Periksa apakah provider internet/WiFi kamu memblokir port 18696.');
        }
    }
};

syncTables();