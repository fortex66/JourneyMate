require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
});



const User = sequelize.define('User', {
  userID: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
    allowNull:true,
  },
}, {
  // Other model options go here
  tableName: 'users',
  timestamps: false, // 기본 옵션으로 선택되는 설정을 취소하기 위해
  sequelize
});

const UserTagging = sequelize.define('usertaggings', {
  tagID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userID: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'userID'
    }
  },
  tagName: {
    type: DataTypes.STRING
  }
}, {
  timestamps: false, // 기본 옵션으로 선택되는 설정을 취소하기 위해
  sequelize
});

module.exports = { User, UserTagging };
