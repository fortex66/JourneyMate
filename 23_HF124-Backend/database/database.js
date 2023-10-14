const mysql = require("mysql"); // mysql 모듈 로드
const dotenv = require("dotenv"); //환경변수 처리
dotenv.config();

const connectDB = function () {
    const connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });

    connection.connect(function (err) {
        if (err) {
            console.error("DB 연결 에러:", err.stack);
            return;
        }
    });

    return connection;
};

module.exports = connectDB;
