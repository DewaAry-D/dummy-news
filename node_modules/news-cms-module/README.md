# News CMS Module

Modul Content Management System (CMS) Berita yang siap pakai untuk aplikasi Express.js. Modul ini menangani manajemen database (Sequelize), logika bisnis, hingga tampilan antarmuka (EJS) secara otomatis.

## Fitur
- **Auto-Sync Database**: Membuat tabel `news`, `content_news`, dan `visitor_logs` secara otomatis.
- **Tracking Pengunjung**: Sistem pelacakan unik pengunjung per berita dalam 24 jam.
- **Trending News**: Menampilkan 10 berita paling populer berdasarkan jumlah pengunjung 24 jam terakhir.
- **CMS Admin**: Dashboard manajemen berita dengan prefix yang dapat diatur.
- **Static Assets**: CSS internal yang sudah terintegrasi.

## Instalasi

Jalankan perintah berikut pada terminal proyek Anda:

```bash
npm install news-cms-module ejs express-session mysql2
```

## Panduan Penggunaan (app.js)

```javascript
const express = require('express');
require('dotenv').config();
const newsModule = require('news-cms-module');

const app = express();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3036, // Sesuaikan dengan port db anda
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Set ke false jika tidak pakai file sertifikat .pem
        }
    },
    // Opsional: tambahkan ini untuk mencegah timeout di koneksi lambat
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

// Konfigurasi URL Dinamis
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const NEWS_PREFIX = '/berita'; // Anda bisa mengganti ini sesuka hati (misal: /news)

async function startServer() {
    // 1. Inisialisasi Middleware Global
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));

    try {
        // 2. Inisialisasi Package (Dijalankan secara ASYNC)
        const newsRouter = await newsModule(dbConfig, { 
            adminRoutePrefix: '/cms-admin',
            newsPrefix: NEWS_PREFIX,
            baseUrl: APP_URL + NEWS_PREFIX,
        });

        // 3. Pasang Router ke Prefix URL
        // Ini akan membuat rute: /berita/list, /berita/cms-admin, dll.
        app.use(NEWS_PREFIX, newsRouter);

        // 4. Jalankan Server
        app.listen(PORT, () => {
            console.log(`Server Berhasil Dijalankan!`);
            console.log(`Base URL   : ${APP_URL}`);
            console.log(`API Berita : ${APP_URL}${NEWS_PREFIX}/list`);
            console.log(`Admin CMS  : ${APP_URL}${NEWS_PREFIX}/cms-admin/dashboard`);
        });
    } catch (error) {
        console.error("Gagal menjalankan server:", error);
    }
}

startServer();
```
pastikan untuk menyesuaikan bagian authAdminMiddleware pada module  di bagian middlewares. Sesuaikan dengan preferensi tabel user masing-masing.


github news-cms-module: https://github.com/DewaAry-D/news-cms-module.git
github contoh implementasi: https://github.com/DewaAry-D/dummy-news.git