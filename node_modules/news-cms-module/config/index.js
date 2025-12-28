const path = require('path');

const defaultConfig = {
    // Pengaturan Router
    adminRoutePrefix: '/admin',       // Prefix default untuk route CRUD admin
    publicRoutePrefix: '/',           // Prefix default untuk route publik
    newsPrefix: '/berita',            // Prefix defaul umum contohnya /berita/{..}
    baseURL: '',                      // Prefix defaul untuk fetch API

    // Pengaturan Views
    viewEngine: 'ejs',                // Template engine default
    baseLayout: 'layout',             // Nama file layout utama (jika digunakan)

    // Pengaturan Assets (CSS/JS)
    assetsUrlPrefix: '/nc-assets',    // Prefix default untuk URL aset statis
    assetsPath: path.join(__dirname, '..', 'assets'), // Path fisik default ke folder assets

    // Pengaturan Pelacakan (Tracking)
    trendingTimeframeHours: 24,       // Jendela waktu default untuk menghitung trending (24 jam)
    maxTrendingPosts: 10,             // Jumlah maksimum berita trending yang dikembalikan
};

/**
 * Menggabungkan konfigurasi default package dengan konfigurasi kustom dari pengguna.
 * @param {object} userConfig - Konfigurasi yang disediakan oleh aplikasi yang menginstal package.
 * @returns {object} Objek konfigurasi akhir yang lengkap.
 */
module.exports = (userConfig = {}) => {
    return {
        ...defaultConfig,
        ...userConfig
    };
};
