import React, { useState,useContext } from "react";
import axios from 'axios'; // 추가
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {SocketContext} from "../App";

function Login() {
  const [userID, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const socket = useContext(SocketContext)
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const handleSubmit = async (e) => { // async 추가
    e.preventDefault();
    if (userID && password) {
      try {
        const response = await axios.post("http://localhost:3000/users/login", {
          userID: userID,
          password: password,
        });
        console.log(response.data)
        if (response.data.result) {
          // 토큰을 로컬 스토리지에 저장
          localStorage.setItem("jwtToken", response.data.userID);

          // axios 기본 헤더에 토큰 설정
          axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.userID}`;

          // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
          console.log(response.data.message);
          navigate("/Home"); // 로그인이 성공하면 Home 페이지로 이동
          window.location.reload();
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  axios.defaults.withCredentials = true;

  const movesign = (e) => {
    navigate("/Sign");
  };

  return (
    <Box>
      <Content>
        <div>
          <div className="Journeymate">
            <h2>Journeymate</h2>
          </div>
          <Form onSubmit={handleSubmit}>
            <div className="IDS">
              <input
                type="text"
                value={userID}
                onChange={handleUsernameChange}
                placeholder="아이디를 입력해주세요"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="비밀번호를 입력해주세요"
                required
              />
            </div>
            <div className="login">
              <button type="submit">로그인</button>
            </div>
            <div>
              <button type="submit" onClick={movesign}>
                회원가입
              </button>{" "}
              <button type="submit">ID/PW 찾기</button>
            </div>
          </Form>
        </div>
      </Content>
    </Box>
  );
}

const Box = styled.div``;

const Content = styled.div`
  padding: 40px 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  em {
    font-size: 20px;
    font-weight: bold;
    line-height: 1.4;
  }

  p {
    font-size: 12px;
    margin-top: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 30px;

  input {
    border: 1px solid #bbb;
    height: 50px;
    border-radius: 5px;
    padding: 0 10px;

    &::placeholder {
      color: #ccc;
    }
  }

  input + input {
    margin-top: 10px;
  }
`;

export default Login;