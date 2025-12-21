const express = require('express');
const app = express();
const newsModule = require('news-cms-module');

const dbConfig = {
    database: 'dummy_news',
    username: 'root',
    password: 'A1r1y05<>',
    host: 'localhost',
};


const PORT = 3000;

async function startServer() {
    // 1. Inisialisasi Middleware Global
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 2. Inisialisasi dan Pasang Package
    // Package harus dijalankan secara ASYNC karena ada proses db.syncTables()
    const newsRouter = await newsModule(dbConfig, { 
        // Opsional: Anda bisa menimpa prefix default atau menonaktifkan migrasi
        adminRoutePrefix: '/cms-admin' 
    });

    // 3. Pasang Router Package ke Prefix URL Host
    app.use('/berita', newsRouter); // Package dipasang di http://localhost:3000/berita

    // 4. Server Listen
    app.listen(PORT, () => {
        console.log(`Host App running on port ${PORT}`);
        console.log(`API Berita tersedia di: http://localhost:${PORT}/berita/list`);
        console.log(`API Admin tersedia di: http://localhost:${PORT}/berita/cms-admin/list`);
    });
}

startServer();
