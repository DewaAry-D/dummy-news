const express = require('express');
const multer  = require('multer');
const path = require('path');
const upload = require('../middlewares/multerMiddleware');
const {CreateNewsValidationRules, UpdateNewsValidationRules} = require('../validations/newsValidations');
const {validate} = require('../validations/mainValidation');
const {parseContentBlocks} = require('../middlewares/parseForm');
const { isAdmin } = require('../middlewares/authAdminMiddleware');

const NewsController = require('../controllers/NewsController');
const StatController = require('../controllers/StatController');

/**
 * Setup semua route untuk package.
 * @param {express.Router} router - Router Express yang sudah ada.
 * @param {object} services - Semua services yang telah diinisialisasi.
 * @param {object} config - Konfigurasi package lengkap.
 */
module.exports = (router, services, config) => {
    // Inisialisasi Controllers dengan services dan config yang dibutuhkan
    const newsController = new NewsController(services.news, services.stat, config);
    const statController = new StatController(services.news, services.stat);
    const beritaUpload = upload.fields([
        { name: 'thumbnailImage', maxCount: 1 },
        { name: 'contentImages', maxCount: 10 }
    ]);

    // 1. Ekspos Aset Statis (CSS)
    // Misalnya, package diakses di /berita-kami, maka aset diakses di /berita-kami/nc-assets
    // router.use(config.assetsUrlPrefix, express.static(config.assetsPath));

    // 2. Route Publik (Front-end)
    // Route ini menggunakan prefix yang ditentukan oleh pengguna (default: '/')
    // router.get(config.publicRoutePrefix, newsController.listPublic.bind(newsController));

    router.get(config.publicRoutePrefix + 'list', newsController.listPublic.bind(newsController));
    
    router.get(`${config.publicRoutePrefix}post/:slug`, 
            statController.trackVisitMiddleware.bind(statController), 
            newsController.getDetail.bind(newsController));
    
    const adminRouter = express.Router();
    adminRouter.use(isAdmin);
    
    // adminRouter.get('/create', (req, res) => {
    //     res.render(path.join(__dirname, '../views/admin/create_news.ejs'));
    // });

    router.get('/cms-admin/create', (req, res) => {
        const appBaseUrl = config.baseUrl; 
        const newsPrefix = config.newsPrefix;
        const adminPrefix = config.adminRoutePrefix;

        const fullApiUrl = `${appBaseUrl}${adminPrefix}/create`;
        const nextUrl = `${newsPrefix}${adminPrefix}/list`

        res.render(path.join(__dirname, "../views/admin/create_news.ejs"), {
            title: 'Buat Berita Baru',

            apiBaseUrl: fullApiUrl,
            nextUrl
        });
    });
    adminRouter.post('/create', beritaUpload, parseContentBlocks, CreateNewsValidationRules, validate, newsController.createPost.bind(newsController));

    adminRouter.get('/update/:slug', newsController.getEditForAdmin.bind(newsController));
    adminRouter.patch('/update/:id', newsController.updateStatusNews.bind(newsController)); 
    adminRouter.put('/update/:id', beritaUpload, parseContentBlocks, UpdateNewsValidationRules, validate, newsController.updatePost.bind(newsController)); 
    
    adminRouter.get('/dashboard', newsController.dashboardAdmin.bind(newsController)); 
    adminRouter.get('/list', newsController.adminList.bind(newsController)); 
    adminRouter.get('/:slug', newsController.getDetailForAdmin.bind(newsController)); 

    adminRouter.delete('/delete/:id', newsController.deletePost.bind(newsController)); 
    router.use(config.adminRoutePrefix, adminRouter);
    router.get('/api/trending', statController.getTrendingApi.bind(statController));
};