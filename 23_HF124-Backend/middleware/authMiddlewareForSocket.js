require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
module.exports = authMiddlewareForSocket = (socket, next) => {
    try {
        // 쿠키 파싱
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");

        // JWT 토큰 추출
        const reqToken = cookies.token;

        if (!reqToken) {
            throw new Error("Authentication failed!");
        }

        const decodedToken = jwt.verify(reqToken, process.env.jwtSecretkey);
        socket.decoded = { userID: decodedToken.userID };

        next();
    } catch (err) {
        console.error(err);
        next(new Error("Authentication failed!"));
    }
};
