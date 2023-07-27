import React, { useEffect, useState  } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const baseURL = "http://localhost:3000/";

const ProfileDetail = () => {

    const [userData, setUserData] = useState(null);

    const getCommunity = async () => {
        try {
          const resUser = await axios.get(baseURL + `mypage/profile`);
          console.log(resUser)
          setUserData(resUser.data);
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
          getCommunity();
      }, []); // 이 부분은 selectedColor가 변경될 때마다 실행됩니다.



  return (
    <div>
      

        <h1>프로필 세부 페이지</h1>
        
        <div>이름 : 구티</div>
        <div>지역 : </div>
        <div>이메일 : </div>
        <div>관심사 : </div>
      <p>개인정보페이지입니다.</p>

      <p>개인정보페이지입니다.</p>
    </div>
  );
};

export default ProfileDetail;