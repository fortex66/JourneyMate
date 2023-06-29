import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      // 로그인 로직 작성 부분입니다.
      console.log(`ID: ${username}`);
      console.log(`Password: ${password}`);
      navigate("/Home"); // 로그인이 성공하면 Home 페이지로 이동
    }
  };

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
            <div>
              <input
                type="text"
                value={username}
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
