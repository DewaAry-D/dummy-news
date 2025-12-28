// models/News.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const News = sequelize.define('News', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            unique: 'unique_slug_index'
        },
        authorName: {
            type: DataTypes.STRING(50), 
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        imagePath: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
            defaultValue: 'DRAFT',
            allowNull: false,
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
        tableName: 'news', 
        timestamps: true,
    });

    return News;
};