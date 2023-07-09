const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://root:a1234567!@hanium.cgpi8jbee1gd.ap-northeast-2.rds.amazonaws.com:3306/hanium'); // 추후 환경변수로 처리 예정

const User = sequelize.define('User', {
  userID: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: true,
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

module.exports = User;
