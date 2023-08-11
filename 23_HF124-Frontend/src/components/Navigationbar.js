import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../pages/listForm.css";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faUserGroup,
  faHouse,
  faBars,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Navigationbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    setActiveTab(location.pathname.split("/")[1]);
  }, [location.pathname]); //location.pathname이 바뀔 때 마다 setActiveTab(location.pathname.split("/")[1]) 실행

  const handleTabClick = (tabName) => {
    navigate(`/${tabName}`);
  };
  return (
    <Navigation>
      <Bottomview>
        <BottomBox>
          <NavBox onClick={() => handleTabClick("Community")}>
            <FontAwesomeIcon
              icon={faGlobe}
              size="2x"
              color={activeTab === "Community" ? "#F97800" : "black"}
            />
            <Text active={activeTab === "Community"}>커뮤니티</Text>
          </NavBox>

          <NavBox onClick={() => handleTabClick("Companion")}>
            <FontAwesomeIcon
              icon={faUserGroup}
              size="2x"
              color={activeTab === "Companion" ? "#F97800" : "black"}
            />
            <Text active={activeTab === "Companion"}>동행인 구하기</Text>
          </NavBox>

          <NavBox onClick={() => handleTabClick("Home")}>
            <FontAwesomeIcon
              icon={faHouse}
              size="2x"
              color={activeTab === "Home" ? "#F97800" : "black"}
            />
            <Text active={activeTab === "Home"}>홈</Text>
          </NavBox>

          <NavBox onClick={() => handleTabClick("Chatting")}>
            <FontAwesomeIcon
              icon={faComments}
              size="2x"
              color={activeTab === "Chatting" ? "#F97800" : "black"}
            />
            <Text active={activeTab === "Chatting"}>채팅방</Text>
          </NavBox>

          <NavBox onClick={() => handleTabClick("Mypage")}>
            <FontAwesomeIcon
              icon={faBars}
              size="2x"
              color={activeTab === "Mypage" ? "#F97800" : "black"}
            />
            <Text active={activeTab === "Mypage"}>마이페이지</Text>
          </NavBox>
        </BottomBox>
      </Bottomview>
    </Navigation>
  );
};

const Navigation = styled.div`
  position: relative;
  min-height: 100vh;
  box-sizing: border-box;
  height: auto;
  overflow-y: auto;
  padding-bottom: 100px;
`;

const Bottomview = styled.div`
  cursor: pointer;
  width: 640px;
  position: fixed;
  bottom: 0;
  height: 90px;
  background-color: white;
`;

const BottomBox = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const NavBox = styled.div`
  width: 50%;
  height: 100%;
  border-top: 1px solid #dddddd;
  border-right: 1px solid #dddddd;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
`;

/* 
    수정 전 코드
    const Text = styled.span`
      color: ${(props) => (props.active ? "orange" : "black")};
    `;

    styled-components에서 Text 컴포넌트에 전달되는 active prop이 HTML 엘리먼트에 전달되면서 문제가 발생하는 것 같다. 
    styled-components를 사용할 때는 이러한 prop 필터링을 수행해야 한다.
    이를 수정하려면, styled-components의 shouldForwardProp 기능을 사용하여 active prop이 HTML 엘리먼트로 전달되지 않도록 할 수 있다. 
*/

const Text = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})`
  color: ${(props) => (props.active ? "#F97800" : "black")};
  margin-top: 5px;
  font-size: 12px;
`;

export default Navigationbar;
