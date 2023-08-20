import React, { useState, useContext } from "react";
import axios from "axios"; // 추가
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SocketContext } from "../App";

function Login() {
  const [userID, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  //모달관리
  function closeModal() {
    setIsModalOpen(false);
  }
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      // Check if the target is the ModalBackground
      closeModal();
    }
  };
  function openModal() {
    setIsModalOpen(true);
  }

  const handleSubmit = async (e) => {
    // async 추가
    e.preventDefault();
    if (userID && password) {
      try {
        const response = await axios.post("http://localhost:3000/users/login", {
          userID: userID,
          password: password,
        });
        console.log(response.data);
        if (response.data.result) {
          // 토큰을 로컬 스토리지에 저장
          localStorage.setItem("jwtToken", response.data.userID);

          // axios 기본 헤더에 토큰 설정
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.userID}`;

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

  const moveID = () => {
    navigate("/findId");
  };

  const movePW = () => {
    navigate("/findPw");
  };
  return (
    <Content>
      <div>
        <Title>JOURNEYMATE</Title>
        <Form onSubmit={handleSubmit}>
          <Wrap>
            <Input
              type="text"
              value={userID}
              onChange={handleUsernameChange}
              placeholder="아이디를 입력해주세요"
              required
            />

            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력해주세요"
              required
            />

            <Button type="submit">로그인</Button>
          </Wrap>

          <div>
            <LinkStyled to="/Sign">회원가입</LinkStyled> {"|"}
            <>
              <LinkStyled onClick={openModal}>ID/PW 찾기</LinkStyled>{" "}
              {isModalOpen && (
                <ModalBackground onClick={handleOutsideClick}>
                  <ModalBox>
                    <ModalButton
                      onClick={() => {
                        navigate("/DiscoverId");
                      }}
                    >
                      ID찾기
                    </ModalButton>
                    <ModalButton
                      onClick={() => {
                        navigate("/DiscoverPw");
                      }}
                    >
                      PW찾기
                    </ModalButton>
                  </ModalBox>
                </ModalBackground>
              )}
            </>
          </div>
        </Form>
      </div>
    </Content>
  );
}
const LinkStyled = styled(Link)`
  color: #f97800; // 색상 설정
  margin: 0 10px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
const Wrap = styled.div`
  border-radius: 0.6em;
  padding: 10px;
`;
const Input = styled.input`
  width: 70%;
`;

const Title = styled.div`
  color: #f97800;
  font-size: 30px;
  font-weight: bold; //글짜 굵게
`;

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

const Button = styled.button`
  box-sizing: border-box;
  background-color: #f97800; // 버튼의 기본 배경색을 변경
  color: #fff; // 글자색을 흰색으로 변경
  border: 2px solid #f97800;
  border-radius: 0.6em;
  cursor: pointer;
  align-self: center;
  font-size: 16px;
  font-family: "Nanum Gothic", sans-serif;
  line-height: 1;
  padding: 0.5em 0.5em;
  text-decoration: none;
  letter-spacing: 2px;
  font-weight: 700;
  width: 75%; // Input의 너비와 동일하게 설정
  margin: 10px auto; // 중앙 정렬을 위한 설정
  margin-top: 20px;

  &:hover,
  &:focus {
    color: #fff;
    outline: 0;
    box-shadow: 0 0 40px 40px #f97800 inset;
  }

  &:focus:not(:hover) {
    color: #fff;
    box-shadow: none;
  }
`;

const ModalButton = styled.div`box-sizing: border-box;
appearance: none;
background-color: transparent;
border: 2px solid #f97800;
border-radius: 0.6em;
color: #f97800;
cursor: pointer;
align-self: center;
font-size: 16px;
font-family: "Nanum Gothic", sans-serif;
line-height: 1;
padding: 0.6em 2em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-bottom: 10px;

&:hover,
&:focus {
  color: #fff;
  outline: 0;
}
transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
&:hover {
  box-shadow: 0 0 40px 40px #f97800 inset;
}

&:focus:not(:hover) {
  color: #f97800;
  box-shadow: none;
}
}
button.back_btn {
padding: 0.6em 1em;
}
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  align-items: flex-start; // 위쪽 정렬
  padding-top: 120px; // This will move the content 50 pixels down from the top
`;

const ModalBox = styled.div`
  width: 200px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;
export default Login;
