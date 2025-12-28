// models/VisitorLog.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const VisitorLog = sequelize.define('VisitorLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        newsId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sessionId: {
            type: DataTypes.STRING(100), 
            allowNull: false,
        },
        visitedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        }
    }, {
        tableName: 'visitor_logs', 
        timestamps: false, 
        indexes: [
            { fields: ['visitedAt'] },
            { unique: true, fields: ['newsId', 'sessionId'] } 
        ]
    });

    return VisitorLog;
};