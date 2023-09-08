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
import Pmodal from "../components/Pmodal";

const Navigationbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen((prevWrite) => !prevWrite);
    console.log("Toggling modal:", !isModalOpen); // 이 로그를 추가합니다.
  };
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
          <NavBox onClick={() => handleTabClick("Local_Festival")}>
            <FontAwesomeIcon
              icon={faGlobe}
              size="2x"
              color={activeTab === "Local_Festival" ? "#F97800" : "black"}
            />
            <Text active={activeTab === "Local_Festival"}>지역축제</Text>
          </NavBox>

          <NavBox onClick={() => handleTabClick("Community")}>
            <FontAwesomeIcon
              icon={faUserGroup}
              size="2x"
              color={activeTab === "Community" ? "#F97800" : "black"}
            />
            <Text active={activeTab === "Community"}>커뮤니티·동행인</Text>
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

  @media (min-width: 640px) {
    padding-bottom: 60px;
  }
`;

const Bottomview = styled.div`
  cursor: pointer;
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 60px;
  background-color: white;

  @media (min-width: 640px) {
    width: 640px;
    height: 90px;
  }
`;

const BottomBox = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const NavBox = styled.div`
  flex: 1;
  height: 100%;
  border-top: 1px solid #dddddd;
  border-right: 1px solid #dddddd;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;

  &:last-child {
    border-right: none;
  }
`;

const Text = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})`
  color: ${(props) => (props.active ? "#F97800" : "black")};
  margin-top: 5px;
  font-size: 12px;

  @media (min-width: 640px) {
    font-size: 14px;
  }
`;



export default Navigationbar;
