import styled from "styled-components";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const DiscoverId = () => {
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [data, setData] = useState("");
  const navigate = useNavigate();
  console.log(id, email);
  const sendVerificationCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/users/findpassword",
        {
          userID: id,
          email: email,
        }
      );
      if (response.status === 200) {
        console.log(response);
        setData(response.data);

        const verificationCode = response.data.message;
        const userCode = prompt("인증코드를 입력하세요:");
        if (userCode === verificationCode) {
          alert("인증성공!");
          setEmailVerified(true);
          navigate("/PasswordChange", { state: { userID: id } });
        } else {
          alert("틀린 인증번호 입니다");
        }
      }
      if (response.status === 202) {
        console.log(response);
        alert(response.data.message);
      }
    } catch (error) {
      console.error("인증번호 발송에 실패했습니다:", error);
    }
  };
  console.log(data);
  return (
    <div>
      <Top>
        {" "}
        <StyledButton onClick={() => navigate(-1)}>{"<"}</StyledButton>
      </Top>
      <EmailBar>
        <Email>아이디</Email>
        <EmailData
          value={id}
          onChange={(e) => setId(e.target.value)}
        ></EmailData>
      </EmailBar>
      <EmailBar>
        <Email>이메일</Email>
        <EmailData
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></EmailData>
        <EmailButton onClick={sendVerificationCode}>전송</EmailButton>
      </EmailBar>
      {data.userID === null ? <div></div> : <ID>{data.userID}</ID>}
    </div>
  );
};
const ID = styled.div``;
const IDData = styled.input``;
const EmailBar = styled.div`
  display: flex;
  margin-top: 25px;
`;
const Email = styled.div`
  font-weight: bold;
`;
const EmailData = styled.input`
  margin-left: 36px;
`;
const EmailButton = styled.button`
  margin-left: 20px;
  border: none;
  border-radius: 5px;
  background-color: #f97800;
  color: #fff;
  cursor: pointer;
`;
const StyledButton = styled.button`
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
padding: 0.6em 1.5em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-bottom: 10px;
margin-top:10px;

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

`;
const Top = styled.div`
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dadada;
  button {
    margin-right: 5px;
  }
`;
export default DiscoverId;
