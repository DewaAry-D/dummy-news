const { Sequelize } = require('sequelize');
const NewsModel = require('./News');
const ContentNewsModel = require('./ContentNews');
const VisitorLogModel = require('./VisitorLog');

module.exports = (config) => {
    const sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        port: config.port, 
        dialect: config.dialect || 'mysql',
        dialectOptions: config.dialectOptions,
        pool: config.pool,
        logging: config.logging !== undefined ? config.logging : false,
    });

    const db = {};

    db.News = NewsModel(sequelize);
    db.ContentNews = ContentNewsModel(sequelize);
    db.VisitorLog = VisitorLogModel(sequelize);

    
    db.News.hasMany(db.ContentNews, {
        foreignKey: 'newsId',
        as: 'contentBlocks', 
        onDelete: 'CASCADE' 
    });
    db.ContentNews.belongsTo(db.News, {
        foreignKey: 'newsId',
        as: 'newsItem'
    });

    db.News.hasMany(db.VisitorLog, {
        foreignKey: 'newsId',
        as: 'visits',
        onDelete: 'CASCADE' 
    });
    db.VisitorLog.belongsTo(db.News, {
        foreignKey: 'newsId',
        as: 'newsItem'
    });


    /**
     * Metode untuk mensinkronisasi model dengan tabel database.
     * @param {object} options - Opsi sinkronisasi Sequelize (e.g., { alter: true } atau { force: true }).
     */
    db.syncTables = async (options = { alter: true }) => {
        // Kami menggunakan { alter: true } secara default, yang akan membuat tabel jika belum ada
        // dan mencoba mengubah kolom yang ada agar sesuai dengan definisi model, tanpa menghapus data.
        await sequelize.sync(options);
    };


    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
};