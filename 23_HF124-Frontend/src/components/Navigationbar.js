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

const Navigationbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen((prevWrite) => !prevWrite);
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
                            color={
                                activeTab === "Local_Festival"
                                    ? "#F97800"
                                    : "black"
                            }
                        />
                        <Text active={activeTab === "Local_Festival"}>
                            지역축제
                        </Text>
                    </NavBox>

                    <NavBox onClick={() => handleTabClick("Community")}>
                        <FontAwesomeIcon
                            icon={faUserGroup}
                            size="2x"
                            color={
                                activeTab === "Community" ||
                                activeTab === "Companion"
                                    ? "#F97800"
                                    : "black"
                            }
                        />
                        <Text
                            active={
                                activeTab === "Community" ||
                                activeTab === "Companion"
                            }
                        >
                            커뮤니티·동행인
                        </Text>
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
                            color={
                                activeTab === "Chatting" ? "#F97800" : "black"
                            }
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

    @media (max-width: 600px) {
        padding-bottom: 80px;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        padding-bottom: 90px;
    }
`;

const Bottomview = styled.div`
    cursor: pointer;
    width: 100%; /* 모든 화면 크기에 대해 100%를 설정하여 가로 길이를 유동적으로 조정합니다. */
    max-width: 640px; /* 그러나 최대 너비를 640px로 제한하여 큰 화면에서도 적절한 크기를 유지합니다. */
    position: fixed;
    bottom: 0;
    height: 90px;
    background-color: white;

    @media (max-width: 600px) {
        height: 60px; /* 모바일 화면에 대해 높이를 조정합니다. */
        width: 100%;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        height: 70px; /* 태블릿 화면에 대해 높이를 조정합니다. */
    }
`;

const BottomBox = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

const NavBox = styled.div`
    flex: 1; /* flex-grow, flex-shrink, flex-basis 값을 한 번에 지정할 수 있는 속성을 사용하여 요소 간 공간 분배를 조정합니다. */
    height: 100%;
    border-top: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;

    &:last-child {
        border-right: none; /* 마지막 요소의 오른쪽 테두리를 제거합니다. */
    }

    svg {
        font-size: 32px; // 기본 아이콘 크기 설정
    }

    @media (max-width: 480px) {
        svg {
            font-size: 20px; // 모바일 화면에서 아이콘 크기 조정
        }
    }
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
    font-size: 13px;
    font-weight: 700;

    @media (max-width: 600px) {
        font-size: 10px; /* 모바일 화면에 대해 폰트 크기를 조정합니다. */
        font-weight: 700;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        font-size: 13px; /* 태블릿 화면에 대해 폰트 크기를 조정합니다. */
        font-weight: 700;
    }
`;

export default Navigationbar;
