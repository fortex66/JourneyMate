import styled from "styled-components";
import axios from "axios";
import { useState } from "react";
const DiscoverId = () => {
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [data, setData] = useState("");

  const sendVerificationCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/users/finduser",
        {
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

export default DiscoverId;
