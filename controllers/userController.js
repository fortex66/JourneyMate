require('dotenv').config();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // 비밀번호 해쉬로 변경을 위한 라이브러리

dotenv.config();

const loginUser = async (req, res) => {
  const { userID, password } = req.body;

  try {
    const user = await User.findOne({ where: { userID } });

    if (!user) {
      console.log(`${userID}는 없는 아이디 입니다`);
      return res.status(200).json({ result: false, message: "존재하지 않는 아이디입니다" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log('비밀번호오류');
      return res.status(200).json({ result: false, message: "비밀번호 오류" });
    }
    const secret = process.env.jwtSecretkey// jwt용 시크릿 키
    const token = jwt.sign({ userID: user.userID }, secret, { expiresIn: "24h" });

    console.log(`${user.userID}님이 로그인했습니다.`);
    console.log(`${token}`);

    res.status(200).json({result: true, message: `${user.user}님이 로그인했습니다.` ,token : token});
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: false, message: "Server error" });
  }
  
};

module.exports = {
  loginUser,
};
