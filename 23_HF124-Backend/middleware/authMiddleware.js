//authMiddleware.js
require('dotenv').config();
const jwt = require("jsonwebtoken");

module.exports = authMiddleware = (req, res, next) => {
  try {
    const reqToken = req.cookies.token; // 헤더에 존재하는 토큰 가져오기
    
    if (!reqToken/*||!authHeader.startsWith('Bearer ')*/) {
      throw new Error('Authentication failed!'); // 토큰이 없으면 에러
    }
    const decodedToken = jwt.verify(reqToken, process.env.jwtSecretkey); // 토큰 검증
    req.decode = { userID: decodedToken.userID }; // 토큰에 있는 userID 값 저장
    next(); // 다음 메서드로 이동
  } catch (err) {
    res.send(403).json({message: "error"});
    return next(err);
  }
};
