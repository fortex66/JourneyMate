const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://root:a1234567!@hanium.cgpi8jbee1gd.ap-northeast-2.rds.amazonaws.com:3306/hanium');

module.exports = sequelize;
