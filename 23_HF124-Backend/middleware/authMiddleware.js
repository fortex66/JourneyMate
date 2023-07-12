require('dotenv').config();
const jwt = require("jsonwebtoken");

module.exports = authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization; // 헤더에 존재하는 토큰 가져오기
    if (!token) {
      throw new Error('Authentication failed!'); // 토큰이 없으면 에러
    }
    const decodedToken = jwt.verify(token, process.env.jwtSecretkey); // 키를 가지고 토큰 검증, 원래는 다른 파일에서 키를 관리해야하지만 현재는 하드 코딩으로 처리
    req.decode = { userID: decodedToken.userID }; // 토큰을 가지고 userID 값 저장
    // console.log(req.decode.userID);
    next(); // 다음 메서드로 이동
  } catch (err) {
    // res.send(403).json({message: "error"});
    return next(err);
  }
};
