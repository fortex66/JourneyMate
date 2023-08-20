import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const baseURL = "http://localhost:3000/";

const PasswordChange = () => {
  const navigate = useNavigate();
  const detaildata = useLocation();

  const chagnepwRef = useRef();
  const checkpwRef = useRef();

  const handleSubmit = async () => {
    if (chagnepwRef.current.value !== checkpwRef.current.value) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log(detaildata);

    if (detaildata.state === null) {
      try {
        console.log("마이페이지");
        const response = await axios.put(baseURL + "mypage/passwordChange", {
          password: checkpwRef.current.value,
        });

        if (response.status === 200) {
          navigate(-1, { replace: true });
        } else {
          console.error("변경 실패");
        }
      } catch (error) {
        console.log(error);
      }
    }else{
      if (detaildata) {
        const response = await axios.put(baseURL + "users/updatepassword", {
          password: checkpwRef.current.value,
          userID: detaildata.state.userID,
        });
        console.log("보내기");
        if (response.status === 200) {
          alert("성공");
          navigate("/Login", { replace: true });
        } else {
          console.error("변경 실패");
        }
      }
    }
    
  };
  return (
    <Container>
      <Navigation>
        <Header>
          <button className="back_btn" onClick={() => navigate(-1)}>
            {" "}
            {"<"}{" "}
          </button>
          <button className="complete_btn" onClick={handleSubmit}>
            {" "}
            확인{" "}
          </button>
        </Header>
      </Navigation>

      <Content>
        <Title>비밀번호 변경</Title>
        <ChangeContainer>
          <Change>변경할 비밀번호</Change>
          <form>
            <input
              type="text"
              autoComplete="username"
              style={{ display: "none" }}
            />{" "}
            {/* Optionally hidden */}
            <ChangePW
              type="password"
              autoComplete="new-password"
              ref={chagnepwRef}
            />
          </form>
        </ChangeContainer>
        <CheckContainer>
          <Check>비밀번호 확인</Check>
          <form>
            <input
              type="text"
              autoComplete="username"
              style={{ display: "none" }}
            />{" "}
            {/* Optionally hidden */}
            <CheckPW
              type="password"
              autoComplete="new-password"
              ref={checkpwRef}
            />
          </form>
        </CheckContainer>
      </Content>
    </Container>
  );
};

const Container = styled.div``;

const Navigation = styled.div`
  position: relative;
  box-sizing: border-box;
  height: auto;
  overflow-y: auto;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  width: 640px;
  height: 70px;
  z-index: 100; // Optional: ensure the header is always on top
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dadada;
  background-color: white;

  button {
    box-sizing: border-box;
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
    margin: 20px;
    padding: 0.6em 2em;
    text-decoration: none;
    letter-spacing: 2px;
    font-weight: 700;

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

const Content = styled.div`
  margin-top: 130px;
  margin-left: 50px;
`;

const Title = styled.div`
  font-size: 25px;
  font-weight: bold;
`;

const ChangeContainer = styled.div`
  display: flex;
  margin-top: 60px;
  margin-left: 10px;
`;
const Change = styled.div``;

const ChangePW = styled.input`
  margin-left: 20px;
`;

const CheckContainer = styled.div`
  display: flex;
  margin-top: 20px;
  margin-left: 10px;
`;
const Check = styled.div``;
const CheckPW = styled.input`
  margin-left: 34px;
`;
export default PasswordChange;
