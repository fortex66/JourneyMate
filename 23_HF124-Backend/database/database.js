const mysql = require('mysql');  // mysql 모듈 로드
const dotenv = require('dotenv');
dotenv.config();

const connectDB = function() {
  const connection = mysql.createConnection({
    host: 'hanium.cgpi8jbee1gd.ap-northeast-2.rds.amazonaws.com',
    port: '3306',
    user: 'root',
    password: process.env.dbPassword,
    database: 'hanium'
  });
  
  connection.connect(function(err) {
    if (err) {
      console.error('DB 연결 에러:', err.stack);
      return;
    }
    console.log('DB에 연결되었습니다. 연결 ID는 ' + connection.threadId + '입니다.');
  });
  
  return connection;
}

module.exports = connectDB;
