//Sign.js(회원가입 1단계:인적사항)
import { useState, useEffect, useRef } from "react";
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
  //아이디 중복검사용 변수
  const [userIDAvailable, setUserIDAvailable] = useState(null);
  //비밀번호 재입력 검사용 상태 변수
  const [passwordMatch, setPasswordMatch] = useState(true);
  //이메일 검증용 변수
  const [emailVerified, setEmailVerified] = useState(false);
  //비밀번호 유효성 검사용 변수
  const [passwordValid, setPasswordValid] = useState(true);
  // 이메일 인증번호 입력 필드 표시 여부
  const [showVerificationField, setShowVerificationField] = useState(false);
  // 인증번호 저장용 변수
  const [verificationCode, setVerificationCode] = useState(''); 
  //생일 선택시 최대날짜 방지용 변수
  const [maxDate, setMaxDate] = useState("");



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


  function onChange(e) {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
    if (name === "password" || name === "checkpassword") { //비밀번호 재입력 문자 오류시 상태 변화 함수
      setPasswordMatch(inputs.password === inputs.checkpassword);
    }
  }


  const { user, userID, password, checkpassword, birth, email } = inputs;
  useEffect(() => {
    setPasswordMatch(password === checkpassword);
  }, [password, checkpassword]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 1을 더해주고, 두 자리 숫자로 만듭니다.
    const day = String(today.getDate()).padStart(2, '0');
    setMaxDate(`${year}-${month}-${day}`);
  }, []); // 빈 의존성 배열을 사용하여 컴포넌트가 마운트될 때만 실행합니다.


  useEffect(() => {
    // 비밀번호 길이 확인
    const lengthValid = password.length >= 8 && password.length <= 16;
  
    // 특수문자, 숫자, 영문자 확인
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
    const hasAlpha = /[a-zA-Z]/.test(password);
  
    const varietyValid = [hasDigit, hasSpecialChar, hasAlpha].filter(Boolean).length >= 2;
  
    // 최종 유효성 검사 결과
    setPasswordValid(lengthValid && varietyValid);
  }, [password]);

  const navigate = useNavigate();

  const checkUserIDAvailability = async () => {
    try {
      const response = await fetch("http://localhost:3000/signup/check-userID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID }),
      });
      
      if (response.status === 200) {
        const data = await response.json();
        alert("사용 가능한 아이디입니다.");
        setUserIDAvailable(true);
      } else if (response.status === 400) {
        const data = await response.text();
        alert(data);
        setUserIDAvailable(false);
      } else {
        console.error("알 수 없는 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("아이디 중복 검사 실패:", error);
    }
  };

  const handleSubmit = async () => {
    if (!user || !userID || !password || !checkpassword || !birth || !email) {
      alert("모든 필드를 작성해 주세요.");
      return;
    }
    if (userIDAvailable === null) {
      alert("아이디 중복 검사를 진행해 주세요.");
      return;
    }
  
    if (!userIDAvailable) {
      alert("이미 사용 중인 아이디입니다.");
      return;
    }
    if (!passwordValid) {
      alert("비밀번호 조건에 맞지 않습니다.");
      return;
    }
    if (password !== checkpassword) {
      alert("비밀번호 재확인에 실패하였습니다.");
      return;
    }
  
    if (!emailVerified) {
      alert("이메일 인증을 진행해 주세요.");
      return;
    }

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

  const [serverVerificationCode, setServerVerificationCode] = useState(''); // 서버에서 받은 인증번호를 저장할 상태 변수

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
      setServerVerificationCode(verificationCode); // 서버에서 받은 인증번호 저장
      setShowVerificationField(true); // 이메일 전송 성공시 인증번호 입력 필드 표시
    }
  } catch (error) {
    console.error("인증번호 발송에 실패했습니다:", error);
  }
};

// 사용자가 입력한 인증번호와 서버에서 받은 인증번호를 비교하는 함수
const verifyCode = () => {
  if (verificationCode === serverVerificationCode) {
    setEmailVerified(true);
    alert("인증성공!");
  } else {
    alert("틀린 인증번호 입니다");
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
        <button onClick={checkUserIDAvailability}>중복 검사</button>
        <span>비밀번호</span>
        <input
          name="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          ref={passwordRef}
          value={password}
          onChange={onChange}
        />
        {!passwordValid && <div style={{ color: 'red' }}>비밀번호는 8~16자리이며, 특수문자, 숫자, 영문자 중 2종류 이상을 조합해야 합니다.</div>}
        <span>비밀번호 재입력</span>
        <input
          name="checkpassword"
          type="password"
          placeholder="비밀번호확인"
          ref={checkpasswordRef}
          value={checkpassword}
          onChange={onChange}
        />
        {!passwordMatch && <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>}
        <span>생일</span>
        <input
          type="date"
          name="birth"
          max={maxDate} // max 속성
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
        {showVerificationField && (
      <>
        <span>인증번호</span>
        <input
          type="text"
          placeholder="인증번호를 입력하세요"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button onClick={verifyCode}>인증 확인</button>
      </>
    )}
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
