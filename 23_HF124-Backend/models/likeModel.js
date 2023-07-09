// Sequelize 모듈에서 Sequelize 클래스와 DataTypes 객체를 import합니다.
const { Sequelize, DataTypes, Model } = require('sequelize');

// 새로운 Sequelize 인스턴스를 생성합니다.
// 이 인스턴스는 데이터베이스에 대한 연결을 설정하고 관리합니다.
// 여기서는 MySQL 데이터베이스에 연결하고 있습니다.
const sequelize = new Sequelize('mysql://root:a1234567!@hanium.cgpi8jbee1gd.ap-northeast-2.rds.amazonaws.com:3306/hanium');

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
