import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sign = () => {
  const [Name, setName] = useState("");
  const [Id, setId] = useState("");
  const [Password, setPassword] = useState("");
  const [BirthDate, setBirthDate] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Gender, setGender] = useState("");
  const navigate = useNavigate();

  const onNameHandler = (e) => {
    setName(e.currentTarget.value);
  };

  const onIdHandler = (e) => {
    setId(e.currentTarget.value);
  };

  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };

  const onBirthDateHandler = (e) => {
    setBirthDate(e.currentTarget.value);
  };

  const onPhoneNumberHandler = (e) => {
    setPhoneNumber(e.currentTarget.value);
  };

  const onGenderHandler = (e) => {
    setGender(e.currentTarget.value);
  };

  const movearea = (e) => {
    navigate("/Area");
  };

  return (
    <div style={{}}>
      <div className="Signtitle">
        <h1>회원가입</h1>
      </div>
      <div className="Signitem">
        <label style={{ textAlign: "right" }}> 이름 </label>
        <input type="text" value={Name} onChange={onNameHandler} />
      </div>

      <div className="Signitem">
        <label style={{ textAlign: "right" }}> 아이디 </label>
        <input type="text" value={Id} onChange={onIdHandler} />
      </div>

      <div className="Signitem">
        <label style={{ textAlign: "right" }}> 비밀번호 </label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
      </div>

      <div className="Signitem">
        <label style={{ textAlign: "right" }}> 생년월일 </label>
        <input type="date" value={BirthDate} onChange={onBirthDateHandler} />
      </div>

      <div className="Signitem">
        <label style={{ textAlign: "right" }}> 전화번호 </label>
        <input type="tel" value={PhoneNumber} onChange={onPhoneNumberHandler} />
      </div>

      <div className="Signitem">
        <label style={{ textAlign: "right" }}> 성별 </label>
        <select value={Gender} onChange={onGenderHandler}>
          <option value="">선택해주세요</option>
          <option value="남자">남자</option>
          <option value="여자">여자</option>
        </select>
        <div className="Signitem">
          <button type="submit" onClick={movearea}>
            <label style={{ textAlign: "right" }}> 다음 </label>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sign;
