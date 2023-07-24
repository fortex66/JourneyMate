// signupController.js
require('dotenv').config(); //환경변수 처리함수입니다.
const nodemailer = require('nodemailer'); // 이메일 인증용 라이브러리
const dotenv = require('dotenv');
const axios = require('axios'); // HTTP 통신을 위한 라이브러리
const bcrypt = require('bcrypt'); // 비밀번호 해쉬로 변경을 위한 라이브러리

dotenv.config();

const { User, UserTagging } = require('../models/signupModel');



exports.processPart1 = async (req, res) => {
    try {
      // 입력 받은 정보 가져오기
      const { user, userID, password, /*confirmPassword(비밀번호 재확인),*/ birth, /*certificationStatus(이메일 주소 확인),*/ email, gender } = req.body;
  
      if (!(user && userID && password && birth && email && gender)) {
        return res.status(400).send('모든 필드를 채워주세요.');
      }
      // //아이디 중복 검사
      const existingUser = await User.findOne({
        where: {
          userID: userID,
        },
      });
      console.log('아이디 중복검사 진행중');

      if (existingUser) {
        console.log('아이디 중복됨');
        return res.status(400).send(`아이디 '${userID}'는 이미 사용 중입니다`);
      }
      //회원 정보 저장
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = await User.create({
        user: user,
        userID: userID,
        password: hashedPassword,
        birth: birth,
        email: email,
        gender: gender,
        region: "",
      });
      
      req.session.user= newUser;
      console.log('세션 정보');
      console.log(req.session.user)
      console.log('회원가입 성공');
      return res.status(200).send({ message: '회원가입1 성공', userID: userID });
      
    } catch (error) {
      console.error(error);
      res.status(400).send('회원가입1 과정에서 문제가 발생했습니다.');
    }
  };
  

  exports.processPart2 = async (req, res) => {
    try {
      console.log('세션정보 = '+ req.session.user);
  
      // 입력 받은 주소 가져오기
      const { address } = req.body;
  
      // 세션에서 사용자 ID 가져오기
      const userId = req.session.user.userID;
      console.log('세션 userID 정보 = '+ userId);
  
      // DB에서 해당 사용자 찾기
      const user = await User.findOne({ where: { userID: userId } });
  
      if (!user) {
        // 사용자를 찾지 못한 경우
        return res.status(400).send('사용자를 찾지 못했습니다.');
      }
  
      // DB에 주소 업데이트
      user.region = address;
      await user.save();
  
      // 세션에 주소 업데이트
      req.session.user.region = address;
  
      return res.status(200).send({ message: '회원가입2 성공', region: address });
    } catch (error) {
      console.error('회원가입2 과정에서 문제가 발생했습니다.', error);
      res.status(400).send('회원가입2 과정에서 문제가 발생했습니다.');
    }
  };

  exports.searchAddress = async (req, res) => {
    try {
      const query = req.query.query;
  
      const headers = {
        Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
      };
  
      const response = await axios.get(
        `https://dapi.kakao.com/v2/local/search/address.json`,
        { params: { query }, headers }
      );
  
      res.json(response.data.documents.map((document) => document.address_name));
    } catch (error) {
      console.error(error);
      res.status(500).send('주소 검색에서 문제가 발생했습니다.');
    }
  };
  
  
  

  exports.processPart3 = async (req, res) => {
    try {
      // 세션에서 userID 가져오기
      const userId = req.session.user.userID;

      // 입력 받은 태그 리스트 가져오기
      const { tags } = req.body;
      
      // 태그 데이터 검증 (태그의 최소 개수)
      if (tags.length < 2) {
        return res.status(400).send('최소 2개 이상의 태그를 입력해주세요.');
      }
  
      // 각 태그를 데이터베이스에 저장
      const savedTags = [];
      for (const tagName of tags) {
        const savedTag = await UserTagging.create({
          userID: userId,
          tagName: tagName,
        });
  
        savedTags.push(savedTag);
      } 
  
      // 성공 메시지와 저장된 태그 반환
      return res.status(200).send({
        message: '회원가입3 성공',
        tags: savedTags.map((item) => item.tagName),
      });
    } catch (error) {
      console.error(error);
      res.status(400).send('회원가입3 과정에서 문제가 발생했습니다.');
    }
};


  

exports.sendEmail = async (req, res) => {
  // nodemailer 설정
  const transporter = nodemailer.createTransport({
    service: 'naver',
    auth: {
      user: 'hanium124@naver.com',
      pass: process.env.nodemailerPassword,
    },
  });

  // 인증번호 생성 및 저장
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  // 이메일 전송 설정
  const mailOptions = {
    from: 'hanium124@naver.com',
    to: req.body.email,
    subject: '인증번호',
    text: `인증번호: ${verificationCode}`,
  };

  // 이메일 전송
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(400).send('이메일 전송 실패');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send(verificationCode.toString());
    }
  });
};

module.exports = exports;