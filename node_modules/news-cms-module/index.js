const express = require('express');
const session = require('express-session');
const path = require('path');
const initModels = require('./models'); 
const initServices = require('./services'); 
const setupRoutes = require('./routes');
const mergeConfig = require('./config');

module.exports = async (dbConfig, userOptions = {}) => {
    
    if (!dbConfig || !dbConfig.database) {
        throw new Error('News module requires database configuration (dbConfig).');
    }
    
    const finalConfig = mergeConfig({
        ...userOptions,
        db: dbConfig 
    });

    const db = initModels(finalConfig.db); 
    
    if (finalConfig.autoMigrate !== false) {
        try {
            console.log('News module: Synchronizing database tables...');
            await db.syncTables({ alter: true }); 
            console.log('News module: Synchronization complete.');
        } catch (error) {
            console.error('ERROR: News module failed to synchronize database tables.', error);
            throw error; 
        }
    }

    const services = initServices(db);
    const router = express.Router();

    // 2. DAFTARKAN FOLDER PUBLIC MILIK MODUL
    router.use(express.static(path.join(__dirname, 'public')));

    router.use(express.json());
    router.use(express.urlencoded({ extended: true }));
    router.use(session({
        secret: userOptions.sessionSecret || 'news_module_default_secret',
        resave: false,
        saveUninitialized: true,
        cookie: { 
            maxAge: 24 * 60 * 60 * 1000,
            secure: false 
        }
    }));

    setupRoutes(router, services, finalConfig);

    return router;
};