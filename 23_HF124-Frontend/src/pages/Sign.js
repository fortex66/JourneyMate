//Sign.js
import { useState, useRef } from "react";
import MyButton from "../components/MyButton";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Sign = () => {
  const userRef = useRef();
  const userIDRef = useRef();
  const passwordRef = useRef();
  const checkpasswordRef = useRef();
  const birthRef = useRef();
  const emailRef = useRef();

  const [inputs, setInputs] = useState({
    user: "",
    userID: "",
    password: "",
    checkpassword: "",
    birth: "",
    email: "",
    checkemail: "",
    gender: "man",
  });

  const [emailVerified, setEmailVerified] = useState(false);

  function onChange(e) {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  const { user, userID, password, checkpassword, birth, email } = inputs;

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!emailVerified) {
      alert("Please verify your email first.");
      return; 
    }
    if(password !== checkpassword){
      alert("비밀번호 재확인에 실패하였습니다.");
      return;
    }
    // previous checks...

    try {
      // POST request to /signup endpoint with form data
      const response = await fetch("http://localhost:3000/signup/part1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          userID: userID,
          password: password,
          birth: birth,
          email: email,
          gender: inputs.gender === "man" ? "남자" : "여자", //assuming "man" means Male and else Female.
        }),
        credentials: "include",
      });

      // Check if signup was successful
      if (response.status === 200) {
        console.log("인적사항 입력완료");
        if (window.confirm("다음 페이지로 이동하시겠습니까?"))
          navigate("/Area", { replace: true });
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Failed to signup", error);
    }
  };

  const sendVerificationCode = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/signup/email-verification",
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const verificationCode = await response.text();
        const userCode = prompt("인증코드를 입력하세요:");
        if (userCode === verificationCode) {
          alert("인증성공!");
          setEmailVerified(true);
        } else {
          alert("틀린 인증번호 입니다");
        }
      }
    } catch (error) {
      console.error("인증번호 발송에 실패했습니다:", error);
    }
  };

  return (
    <div>
      <section>
        <Header>
          <MyButton
            className="back_btn"
            text={"<"}
            onClick={() => navigate(-1)}
          />
          <h1 className="title">회원가입</h1>
        </Header>
      </section>
      <Info>
        <span>이름</span>
        <input
          name="user"
          placeholder="이름을 입력하세요"
          ref={userRef}
          value={user}
          onChange={onChange}
        />
        <span>아이디</span>
        <input
          name="userID"
          placeholder="아이디를 입력하세요"
          ref={userIDRef}
          value={userID}
          onChange={onChange}
        />
        <span>비밀번호</span>
        <input
          name="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          ref={passwordRef}
          value={password}
          onChange={onChange}
        />
        <span>비밀번호 재입력</span>
        <input
          name="checkpassword"
          type="password"
          placeholder="비밀번호확인"
          ref={checkpasswordRef}
          value={checkpassword}
          onChange={onChange}
        />
        <span>생일</span>
        <input
          type="date"
          name="birth"
          ref={birthRef}
          value={birth}
          onChange={onChange}
        />
        <label>
          <span>성별</span>
          <br /> <span>남성</span>
          <input
            type="radio"
            name="gender"
            checked={inputs.gender === "man"}
            value="man"
            onChange={onChange}
          />
          <span>여성</span>
          <input
            type="radio"
            name="gender"
            value="girl"
            onChange={onChange}
            checked={inputs.gender === "girl"}
          />
        </label>
        <span>이메일</span>
        <input
          type="email"
          name="email"
          placeholder="이메일을 입력하세요"
          ref={emailRef}
          value={email}
          onChange={onChange}
        />
        <button onClick={sendVerificationCode}>전송</button>
      </Info>
      <My>
        <MyButton
          className="complete_btn"
          text={"다음"}
          onClick={handleSubmit}
        />
      </My>
    </div>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 16px 15px;
  border-bottom: 1px solid #dadada;
  .title {
    text-align: center;
    flex-grow: 1;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const My = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default Sign;
