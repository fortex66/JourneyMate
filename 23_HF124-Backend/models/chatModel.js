require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
});


const Chat = sequelize.define('Chat', {
  // Example attributes are defined here
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  // Other model options go here
});

module.exports = Chat;
