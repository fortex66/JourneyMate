const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
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
