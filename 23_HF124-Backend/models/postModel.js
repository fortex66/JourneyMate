
// Sequelize와 DataTypes를 import 합니다. 
// Sequelize는 ORM으로, Node.js에서 데이터베이스 작업을 수행하게 해주며,
// DataTypes는 Sequelize를 이용해 데이터베이스에서 사용되는 데이터 타입을 정의합니다.
const { Sequelize, DataTypes } = require('sequelize');

// 새로운 Sequelize 인스턴스를 생성합니다. 여기서 'database'는 데이터베이스 이름, 'username'은 사용자 이름,
// 'password'는 해당 사용자의 비밀번호를 나타냅니다. host는 데이터베이스가 있는 서버의 주소이며, dialect는 사용하는 데이터베이스 종류입니다.
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
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
