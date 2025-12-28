// models/ContentNews.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ContentNews = sequelize.define('ContentNews', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        newsId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        blockType: {
            type: DataTypes.ENUM(
                'PARAGRAPH', 
                'IMAGE', 
                'VIDEO', 
                'SUBHEADING'
            ),
            allowNull: false,
        },
        contentValue: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        caption: {
            type: DataTypes.STRING(255), 
            allowNull: true,
        }
    }, {
        tableName: 'content_news',
        timestamps: false,
        indexes: [
            { fields: ['newsId', 'order'] } 
        ]
    });

    return ContentNews;
};