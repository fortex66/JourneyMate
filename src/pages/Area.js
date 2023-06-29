import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Area = () => {
  const [area, setArea] = useState("");
  const navigate = useNavigate();

  const onAreaHandler = (e) => {
    setArea(e.currentTarget.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/Tag"); // 이동할 경로를 설정해주세요
  };

  return (
    <div>
      <div className="Areaname">
        <h1>지역설정</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ textAlign: "right" }}> 지역 </label>
          <input type="text" value={area} onChange={onAreaHandler} />
        </div>
        <div className="Area">
          <button type="submit">확인</button>
        </div>
      </form>
    </div>
  );
};

export default Area;
