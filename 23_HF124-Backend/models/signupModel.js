const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://root:a1234567!@hanium.cgpi8jbee1gd.ap-northeast-2.rds.amazonaws.com:3306/hanium'); // 나중에 환경변수로 처리할 예정

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
    allowNull: true,
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
