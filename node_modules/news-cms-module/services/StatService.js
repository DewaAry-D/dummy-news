const { Op, literal } = require('sequelize');

class StatService {
    constructor(VisitorLogModel, NewsModel) {
        this.VisitorLog = VisitorLogModel;
        this.News = NewsModel;
    }

    async trackVisit(newsId, sessionId) {
        const TWENTY_FOUR_HOURS_AGO = new Date(new Date() - 24 * 60 * 60 * 1000);

        const existingVisit = await this.VisitorLog.findOne({
            where: {
                newsId: newsId,
                sessionId: sessionId,
                visitedAt: {
                    [Op.gt]: TWENTY_FOUR_HOURS_AGO
                }
            }
        });

        if (!existingVisit) {
            return await this.VisitorLog.create({
                newsId,
                sessionId,
                visitedAt: new Date()
            });
        }
    }

    async getTrendingPosts(timeframeHours = 24, limit = 10) {
        const cutOffTime = new Date(new Date() - timeframeHours * 60 * 60 * 1000);

        const trendingLogs = await this.VisitorLog.findAll({
            attributes: [
                'newsId',
                [literal('COUNT(DISTINCT sessionId)'), 'uniqueVisits']
            ],
            where: {
                visitedAt: { [Op.gte]: cutOffTime } 
            },
            group: ['newsId'],
            order: [[literal('uniqueVisits'), 'DESC']],
            limit: limit
        });

        const newsIds = trendingLogs.map(log => log.newsId);
        

        return this.News.findAll({
            where: { id: newsIds, status: 'PUBLISHED' },
            order: [[literal(`FIELD(id, ${newsIds.join(',')})`)]], // MySQL specific ordering
        });
    }
}

module.exports = StatService;