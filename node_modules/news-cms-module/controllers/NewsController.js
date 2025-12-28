const fs = require('fs');
const News = require('../models/News');
const { Op, fn, col, where } = require('sequelize');
const path = require('path');

class NewsController {
    constructor(newsService, statService, config) {
        this.newsService = newsService;
        this.statService = statService;
        this.config = config;
    }

    async listPublic(req, res) {
        const {
            page = 1,
            limit = 6,
            title = '',
            category = ''
        } = req.query;

        const currentPage = parseInt(page, 10);
        const perPage = parseInt(limit, 10);

        const offset = (currentPage - 1) * perPage;

        try {
            const { rows: posts, count: totalItems } = await this.newsService.getAllPosts({
                offset,
                limit: perPage,
                title,
                category,
                status: "PUBLISHED"
            });

            const totalPages = Math.ceil(totalItems / perPage);

            const categories = await this.newsService.getUniqueCategories();
            const trending = await this.newsService.getTrendingNews();

            //render
            res.render(path.join(__dirname, "../views/home.ejs"), {
                posts,
                categories,
                trending,
                query: { title, category },
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage,
                    perPage,
                    hasNextPage: currentPage < totalPages,
                    hasPrevPage: currentPage > 1,
                },
            });

        } catch (error) {
            //console.error('Error loading news list:', error);
            res.status(500).json({
                success: false,
                error: 'Error loading news list.',
                message: error.message
            });
        }
    }

    async getDetail(req, res) {
        try {
            const news = await this.newsService.getPostBySlug(req.params.slug);
            if (!news) {
                return res.status(404).json({
                    success: false,
                    error: 'news tidak ditemukan'
                });
            }

            const categories = await this.newsService.getUniqueCategories();
            const recommendation = await this.newsService.getRecommendationNews(news.category);
            const trending = await this.newsService.getTrendingNews();

            res.render(path.join(__dirname, "../views/detail.ejs"), {
                news,
                categories,
                recommendation,
                trending,
                query: {}
            });
        } catch (error) {
            console.error('Error loading news detail:', error);
            res.status(500).json({
                success: false,
                error: 'gagal melihat news',
                message: error.message
            });
        }
    }

    async getDetailForAdmin(req, res) {
        try {
            const news = await this.newsService.getPostBySlugForAdmin(req.params.slug);
            if (!news) {
                return res.status(404).json({
                    success: false,
                    error: 'news tidak ditemukan'
                });
            }

            res.render(path.join(__dirname, "../views/admin/detailadmin.ejs"), {
                news
            });
        } catch (error) {
            console.error('Error loading news detail for admin:', error);
            res.status(500).json({
                success: false,
                error: 'gagal melihat news',
                message: error.message
            });
        }
    }

    async getEditForAdmin(req, res) {
        try {
            const posts = await this.newsService.getPostBySlugForAdmin(req.params.slug);
            if (!posts) {
                return res.status(404).json({
                    succses: false,
                    error: 'news tidak ditemukan'
                });
            }
            
            res.render(path.join(__dirname, '../views/admin/update_news.ejs'), { 
                data: posts
            });
        } catch (error) {
            res.status(500).json({
                succses: false,
                error: 'gagal melihat news'
            });
        }
    }
    
    // Route Admin (CRUD)
    async adminList(req, res) {
        const {
            page = 1,
            limit = 10,
            title = '',
            category = '',
            status = ''
        } = req.query;

        const currentPage = parseInt(page, 10);
        const perPage = parseInt(limit, 10);

        const offset = (currentPage - 1) * perPage;

        try {
            const { rows: posts, count: totalItems } = await this.newsService.getAllPosts({
                offset,
                limit: perPage,
                title,
                category,
                status: status.toUpperCase()
            });

            const totalPages = Math.ceil(totalItems / perPage);
            const categories = await this.newsService.getUniqueCategories();

            // Render view instead of sending JSON
            res.render(path.join(__dirname, "../views/admin/list.ejs"), {
                posts,
                categories,
                query: { title, category, status },
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage,
                    perPage,
                    hasNextPage: currentPage < totalPages,
                    hasPrevPage: currentPage > 1
                }
            });

        } catch (error) {
            console.error('Error loading admin news list:', error);
            res.status(500).json({
                success: false,
                error: 'Error loading news list.',
                message: error.message
            });
        }
    }

    async createPost(req, res) {
        try {

            const { title, authorName, status, contentBlocks } = req.body;
            const category = req.body.category.toLowerCase();
            const files = req.files;
            const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            const newNews = await this.newsService.createPost(
                { title, slug, category, authorName, status: status || 'DRAFT' },
                contentBlocks,
                files
            );

            res.status(201).json({
                success: true,
                data: newNews
            })

            // Redirect ke halaman daftar admin atau detail admin
            // res.redirect(this.config.adminRoutePrefix + '/'); 
        } catch (error) {
            console.error(error);

            if (req.files) {
                const allFiles = [
                    ...(req.files['thumbnailImage'] || []),
                    ...(req.files['contentImages'] || [])
                ];

                allFiles.forEach(file => {
                    fs.unlink(file.path, (err) => {
                        if (err) console.error(`Gagal menghapus file: ${file.path}`, err);
                        else console.log(`Berhasil menghapus sampah file: ${file.path}`);
                    });
                });
            }

            res.status(500).json({
                succses: false,
                error: 'gagal membuat news'
            });
        }
    }

    async updatePost(req, res) {
        const { id } = req.params;
        try {
            const { title, authorName, status, contentBlocks } = req.body;
            const category = req.body.category.toLowerCase();
            const files = req.files;
            const slug = title ? title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : undefined;

            const result = await this.newsService.updatePost(
                id,
                { title, slug, category, authorName, status },
                contentBlocks,
                files
            );

            if (result.filesToDelete && result.filesToDelete.length > 0) {
                result.filesToDelete.forEach(filePath => {
                    fs.unlink(filePath, (err) => {
                        if (err) console.error(`Gagal hapus file lama: ${filePath}`, err);
                    });
                });
            }

            res.status(200).json({
                success: true,
                message: 'Berhasil update berita',
                data: result.newsItem
            });

        } catch (error) {
            console.error(error);

            if (req.files) {
                const uploadedFiles = [
                    ...(req.files['thumbnailImage'] || []),
                    ...(req.files['contentImages'] || [])
                ];
                uploadedFiles.forEach(file => {
                    fs.unlink(file.path, (err) => {
                        if (err) console.error(`Cleanup error file gagal: ${file.path}`, err);
                    });
                });
            }

            res.status(500).json({
                success: false,
                error: error.message || 'Gagal update news'
            });
        }
    }

    async updateStatusNews(req, res) {
        const { id } = req.params;
        try {
            const { status } = req.body;

            const result = await this.newsService.updateStatusNews(
                id,
                status
            );

            res.status(200).json({
                success: true,
                message: 'Berhasil update status berita',
                data: result
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                error: error.message || 'Gagal update news'
            });
        }
    }

    //ini blum selesai
    async deletePost(req, res) {
        try {
            const { id } = req.params;

            const result = await this.newsService.deletePost(id);

            if (result === 0) { // Sequelize destroy mengembalikan 0 jika tidak ada baris yang terpengaruh
                return res.status(404).json({ success: false, message: 'News post not found for deletion.' });
            }

            res.status(200).json({
                success: true,
                message: `Post with ID ${id} deleted successfully.`
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to delete post.', error: error.message });
        }
    }

    async dashboardAdmin(req, res) {
        try {
            const currentYear = new Date().getFullYear();

            const data = await this.newsService.dashboardAdmin(currentYear);

            // res.status(200).json({
            //     success: true,
            //     data
            // });

            res.render(path.join(__dirname, '../views/admin/dashboard.ejs'), {
                data: data
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to load data.', error: error.message });
        }
    }

}

module.exports = NewsController;