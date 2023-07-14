require('dotenv').config();

const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
});


// 'Like' 모델을 정의합니다. 모델은 데이터베이스의 테이블과 1:1로 대응하는 개념입니다..
class LikeModel extends Model {}

LikeModel.init({
  // 'userId' 필드를 정의합니다. 이 필드의 데이터 타입은 문자열이며, NULL 값을 허용하지 않습니다.
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // 'postId' 필드를 정의합니다. 이 필드의 데이터 타입은 문자열이며, NULL 값을 허용하지 않습니다.
  tpostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, // 필수로 기본키를 설정해야만 코드가 정상적으로 동작해서 지정했습니다
  },
}, {
  timestamps: false, // 기본 옵션으로 선택되는 설정을 취소하기 위해
  sequelize, 
  modelName: 'postlikes'
  
});

module.exports = LikeModel;
