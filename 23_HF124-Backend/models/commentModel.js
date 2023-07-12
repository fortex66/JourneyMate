require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
});


const tComment = sequelize.define('tcomment', {
  // Assuming postId and userId are the foreign keys from post and user table.
  tcommentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contents: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  contentDate: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  tpostID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }

  
}, {
  // 다른 옵션들 기입
  timestamps: false, // 기본 옵션으로 선택되는 설정을 취소하기 위해
  sequelize, 
  modelName: 'tcomments'
});

module.exports = tComment;
