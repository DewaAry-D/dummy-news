const express = require('express');
require('dotenv').config();
const newsModule = require('news-cms-module');
const mysql2 = require('mysql2');
const ejs = require('ejs');

const app = express();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3036,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const NEWS_PREFIX = '/berita';

// --- LOGIKA BARU UNTUK VERCEL ---

// Variable global untuk menyimpan status inisialisasi
let isInitialized = false;

// Fungsi untuk inisialisasi aplikasi (Middleware & Router)
const initApp = async () => {
    if (isInitialized) return; // Jika sudah init, skip

    // 1. Inisialisasi Middleware Global
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // Note: Di Vercel, 'public' folder ditangani otomatis, tapi ini tetap ok untuk local
    app.use(express.static('public')); 

    try {
        // 2. Inisialisasi Package (Async)
        const newsRouter = await newsModule(dbConfig, { 
            adminRoutePrefix: '/cms-admin',
            newsPrefix: NEWS_PREFIX,
            baseUrl: APP_URL + NEWS_PREFIX,
        });

        // 3. Pasang Router
        app.use(NEWS_PREFIX, newsRouter);
        
        // Rute Root (Opsional, agar tidak 404 saat buka domain utama)
        app.get('/', (req, res) => {
            const userLink = `${NEWS_PREFIX}/list`; // Link ke halaman list berita
            const adminLink = `${NEWS_PREFIX}/cms-admin/dashboard`; // Link ke admin

            const html = `
                <!DOCTYPE html>
                <html lang="id">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Server Status</title>
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f2f5; }
                        .card { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 400px; width: 100%; }
                        h1 { color: #333; margin-bottom: 1rem; font-size: 24px; }
                        p { color: #666; margin-bottom: 2rem; }
                        .btn { display: block; padding: 12px; margin: 10px 0; text-decoration: none; border-radius: 5px; font-weight: bold; transition: 0.3s; }
                        .btn-user { background-color: #0070f3; color: white; }
                        .btn-user:hover { background-color: #005bb5; }
                        .btn-admin { background-color: #333; color: white; }
                        .btn-admin:hover { background-color: #000; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>Server Berjalan</h1>
                        <p>Silakan pilih halaman yang ingin dituju:</p>
                        
                        <a href="${userLink}" class="btn btn-user">
                            📰 Halaman Berita (User)
                        </a>
                        
                        <a href="${adminLink}" class="btn btn-admin">
                            ⚙️ Dashboard Admin (CMS)
                        </a>
                    </div>
                </body>
                </html>
            `;
            
            res.send(html);
        });

        isInitialized = true;
        console.log("Aplikasi berhasil diinisialisasi.");
    } catch (error) {
        console.error("Gagal menginisialisasi module:", error);
        throw error;
    }
};

// 1. Jika dijalankan di Vercel (Serverless Environment)
// Kita export function async yang menunggu initApp selesai, baru lempar ke Express
module.exports = async (req, res) => {
    await initApp();
    return app(req, res);
};

// 2. Jika dijalankan di Local (node app.js)
// Cek apakah file ini dijalankan langsung oleh Node
if (require.main === module) {
    initApp().then(() => {
        app.listen(PORT, () => {
            console.log(`Server Local Berhasil Dijalankan!`);
            console.log(`Base URL   : ${APP_URL}`);
            console.log(`API Berita : ${APP_URL}${NEWS_PREFIX}/list`);
            console.log(`Admin CMS  : ${APP_URL}${NEWS_PREFIX}/cms-admin/dashboard`);
        });
    });
}