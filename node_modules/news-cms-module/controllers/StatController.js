class StatController {
    constructor(newsService, statService) {
        this.newsService = newsService;
        this.statService = statService;
    }

    async trackVisitMiddleware(req, res, next) {
        try {
            const slug = req.params.slug;
            const post = await this.newsService.getPostBySlug(slug);

            if (post) {
                if (!req.session.viewedPosts) {
                    req.session.viewedPosts = [];
                }

                if (!req.session.viewedPosts.includes(post.id)) {
                    const sessionId = req.sessionID || req.ip;
                    await this.statService.trackVisit(post.id, sessionId);
                    
                    req.session.viewedPosts.push(post.id);
                }
                
                req.postData = post;
            }

        } catch (error) {
            console.error("News tracking failed but request continued:", error);
        }
        next();
    }

    async getTrendingApi(req, res) {
        try {
            const posts = await this.statService.getTrendingPosts();
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve trending data.' });
        }
    }
}

module.exports = StatController;