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
    const secret = process.env.jwtSecretkey// jwt용 시크릿 키(.env 파일에 환경변수 처리됨)
    const token = jwt.sign({ userID: user.userID }, secret, { expiresIn: "24h" });

    console.log(`${user.userID}님이 로그인했습니다.`);
    
    //로그인 시 토큰을 발행하고 쿠키에 담아서 유저에게 보내준다
    res.cookie('token',token,{
      httpOnly:true, //콘솔창에서 토큰을 수정하는거 방지하는 옵션
      secure:false, // HTTPS에 해당하면 true로 설정
      maxAge:24*60*60*1000 // 24h과 동일한 의미
    }).status(200).json({ result: true, message: `${user.user}님이 로그인했습니다.` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: false, message: "Server error" });
  }
  
};

module.exports = {
  loginUser,
};
