require("dotenv").config();
const users = require("../models/signupModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs"); // 비밀번호 해쉬로 변경을 위한 라이브러리
const nodemailer = require("nodemailer"); // 이메일 인증용 라이브러리

dotenv.config();

const loginUser = async (req, res) => {
  const { userID, password } = req.body;
  try {
    const user = await users.User.findOne({ where: { userID: userID } });

    if (!user) {
      console.log(`${userID}는 없는 아이디 입니다`);
      return res
        .status(200)
        .json({ result: false, message: "존재하지 않는 아이디입니다" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log("비밀번호오류");
      return res.status(200).json({ result: false, message: "비밀번호 오류" });
    }
    const secret = process.env.jwtSecretkey; // jwt용 시크릿 키(.env 파일에 환경변수 처리됨)
    const token = jwt.sign({ userID: user.userID }, secret, {
      expiresIn: "24h",
    });

    console.log(`${user.userID}님이 로그인했습니다.`);

    //로그인 시 토큰을 발행하고 쿠키에 담아서 유저에게 보내준다
    res
      .cookie("token", token, {
        httpOnly: true, //콘솔창에서 토큰을 수정하는거 방지하는 옵션
        secure: false, // HTTPS에 해당하면 true로 설정
        maxAge: 24 * 60 * 60 * 1000, // 24h과 동일한 의미
      })
      .status(200)
      .json({
        result: true,
        message: `${user.user}님이 로그인했습니다.`,
        userID: user.userID,
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: false, message: "Server error" });
  }
};

const findUser = async (req, res) => {
  console.log(req.body.email);
  try {
    const findEmail = await users.User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!findEmail) {
      res.status(202).json({ result: false, message: "없는 email입니다." });
    } else {
      // nodemailer 설정
      const transporter = nodemailer.createTransport({
        service: "naver",
        auth: {
          user: "hanium124@naver.com",
          pass: process.env.nodemailerPassword,
        },
      });

      // 인증번호 생성 및 저장
      const verificationCode = Math.floor(100000 + Math.random() * 900000);

      // 이메일 전송 설정
      const mailOptions = {
        from: "hanium124@naver.com",
        to: req.body.email,
        subject: "인증번호",
        text: `인증번호: ${verificationCode}`,
      };

      // 이메일 전송
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(400).send("이메일 전송 실패");
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).json({
            result: true,
            message: verificationCode.toString(),
            userID: findEmail.userID,
          });
        }
      });
    }
  } catch (err) {
    console.error(err);
    res
      .status(404)
      .json({ result: false, message: "서버에 문제가 생겼습니다." });
  }
};

const findPassword = async (req, res) => {
  try {
    const findUser = await users.User.findOne({
      where: { userID: req.body.userID, email: req.body.email },
    });

    if (!findUser) {
      res.status(202).json({ result: false, message: "잘못된 정보입니다." });
    } else {
      const transporter = nodemailer.createTransport({
        service: "naver",
        auth: {
          user: "hanium124@naver.com",
          pass: process.env.nodemailerPassword,
        },
      });

      // 인증번호 생성 및 저장
      const verificationCode = Math.floor(100000 + Math.random() * 900000);

      // 이메일 전송 설정
      const mailOptions = {
        from: "hanium124@naver.com",
        to: req.body.email,
        subject: "인증번호",
        text: `인증번호: ${verificationCode}`,
      };
      console.log(verificationCode);
      // 이메일 전송
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(400).send("이메일 전송 실패");
        } else {
          console.log("Email sent: " + info.response);
          res
            .status(200)
            .json({ result: true, message: verificationCode.toString() });
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(404).json({ result: false, message: "서버 에러" });
  }
};
const updatePassword = async (req, res) => {
  console.log(req.body.userID);
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  try {
    await users.User.update(
      {
        password: hashedPassword,
      },
      { where: { userID: req.body.userID } }
    );

    res
      .status(200)
      .json({ result: true, message: "비밀번호 변경에 성공하였습니다" });
  } catch (err) {
    res
      .status(500)
      .json({ resutl: false, message: "비밀번호 변경에 실패하였습니다." });
  }
};
module.exports = {
  loginUser,
  findUser,
  findPassword,
  updatePassword,
};
