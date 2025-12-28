const NewsService = require('./NewsService');
const StatService = require('./StatService');

/**
 * Menginisialisasi semua service dan menyuntikkan model database.
 * @param {object} db - Objek yang berisi semua model Sequelize yang terkoneksi (News, ContentNews, VisitorLog).
 * @returns {object} Objek yang berisi semua service yang siap digunakan.
 */
module.exports = (db) => {
    return {
        news: new NewsService(db.News, db.ContentNews, db.VisitorLog),
        stat: new StatService(db.VisitorLog, db.News),
        db: db 
    };
};