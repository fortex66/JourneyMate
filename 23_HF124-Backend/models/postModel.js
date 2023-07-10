require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
});


// Post라는 이름의 모델을 정의합니다. 모델은 데이터베이스의 테이블을 나타냅니다.
// 각 필드의 이름과 속성을 정의하고 있으며, 이 경우에는 title과 content 두 필드가 있습니다.
const Post = sequelize.define('Post', {
  // title 필드를 정의합니다. 이 필드의 데이터 타입은 문자열이며, allowNull은 false로 설정되어 있어 이 필드는 반드시 값을 가져야 합니다.
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // content 필드를 정의합니다. 이 필드의 데이터 타입은 TEXT로, allowNull은 false로 설정되어 있어 이 필드는 반드시 값을 가져야 합니다.
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  // 다른 모델 설정 옵션들이 여기에 위치합니다.
});

// 이 모듈은 Post 모델을 export 합니다. 이를 통해 다른 파일에서 이 모델을 import 해서 사용할 수 있습니다.
module.exports = Post;
