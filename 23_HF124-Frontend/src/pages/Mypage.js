import Modal from "../components/Modal";
import Navigationbar from "../components/Navigationbar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./listForm.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faUserGroup,
  faPen,
  faUser,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";

const baseURL = "http://localhost:3000/";

function MyPage() {
  const navigate = useNavigate();
  const [write, setWrite] = useState(false);
  const [selectedColor, setSelectedColor] = useState("faGlobe");
  const [CommunityData, setCommunityData] = useState(null);
  const [companionData, setCompanionData] = useState(null);
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null); // new state for storing user data

  const getUserProfile = async () => {
    try {
      const resUser = await axios.get(baseURL + `mypage/profile`);
      setUserData(resUser.data);
      setImage(resUser.data.profile[0].profileImage);
    } catch (error) {
      console.log(error);
    }
  };

  /* 상세페이지 이동 */
  const goDetail = (postId) => {
    // postId 인자 추가

    navigate(`/Community_Detail/${postId}`); // postId를 경로의 일부로 사용
  };

  const goDetails = (postId) => {
    // postId 인자 추가

    navigate(`/Companion_Detail/${postId}`); // postId를 경로의 일부로 사용
  };

  const getCommunity = async () => {
    try {
      const resCommunity = await axios.get(baseURL + `mypage/community`);
      setCommunityData(resCommunity.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCompanion = async () => {
    try {
      const resCompanion = await axios.get(baseURL + `mypage/companion`);
      console.log(resCompanion.data);
      setCompanionData(resCompanion.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getUserProfile(); // calling the function to get user profile
    if (selectedColor === "faGlobe") {
      getCommunity();
    } else if (selectedColor === "faUserGroup") {
      getCompanion();
    }
  }, [selectedColor]);
  return (
    <div className="Wrap">
      <Title>
        {" "}
        <p>마이페이지</p>
      </Title>
      <div className="topView">
        <div className="ContentsBox">
          <MyInfoBox>
            <div style={{ alignItems: "center" }}>
              <Circle
                onClick={() => {
                  navigate("/Profile");
                }}
              >
                {image ? (
                  <img
                    src={`${baseURL}${image && image.replace(/\\/g, "/")}`}
                    alt="chosen"
                    style={{ width: "100%", borderRadius: "100%" }}
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} size="2x" color={"#f97800"} />
                )}
              </Circle>
              내정보
            </div>
          </MyInfoBox>
          <MyMenuMiddle>
            <div>
              <Circle onClick={() => setWrite(!write)}>
                {write && <Modal closeModal={() => setWrite(!write)}></Modal>}
                <FontAwesomeIcon icon={faPen} size="2x" color={"#f97800"} />
              </Circle>
              글쓰기
            </div>
            <div>
              <Circle
                onClick={() => {
                  navigate("/Scrap");
                }}
              >
                <FontAwesomeIcon icon={faScroll} size="2x" color={"#f97800"} />
              </Circle>
              스크랩
            </div>
          </MyMenuMiddle>
        </div>
      </div>
      <MyList>
        <div>
          <FontAwesomeIcon
            icon={faGlobe}
            size="2x"
            color={selectedColor === "faGlobe" ? "#f97800" : "black"}
            onClick={() => {
              setSelectedColor("faGlobe");
            }}
          />
        </div>

        <div>
          <FontAwesomeIcon
            icon={faUserGroup}
            size="2x"
            color={selectedColor === "faUserGroup" ? "#f97800" : "black"}
            onClick={() => {
              setSelectedColor("faUserGroup");
            }}
          />
        </div>
      </MyList>
      <Content>
        <CommunityList>
          {/* faGlobe 선택됐을 때 (CommunityData) */}
          {selectedColor === "faGlobe" &&
            CommunityData &&
            CommunityData.posts.rows.map((post, index) => (
              <CommunityItem
                key={index}
                onClick={() =>
                  goDetail(CommunityData.posts.rows[index].tpostID)
                }
              >
                <div>
                  <Picture>
                    <img
                      src={`${baseURL}${
                        post.post_images[0]
                          ? post.post_images[0].imageURL.replace(/\\/g, "/")
                          : ""
                      }`}
                    />
                  </Picture>
                </div>
              </CommunityItem>
            ))}

          {/* faUserGroup 선택됐을 때 (companionData) */}
          {selectedColor === "faUserGroup" &&
            companionData &&
            companionData.posts.rows.map((post, index) => (
              <CompanionItem
                key={index}
                onClick={() =>
                  goDetails(companionData.posts.rows[index].cpostID)
                }
              >
                <div>
                  <Picture>
                    <img
                      src={`${baseURL}${post.post_images[0].imageURL.replace(
                        /\\/g,
                        "/"
                      )}`}
                    />
                  </Picture>
                </div>
              </CompanionItem>
            ))}
        </CommunityList>
      </Content>

      <Navigationbar />
    </div>
  );
}
const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid #f97800;
  display: flex; // Use flexbox for alignment
  justify-content: center; // Horizontally center the content
  align-items: center; // Vertically center the content
  height: 60px; // Set a height for the container
`;

const MyInfoBox = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #dddddd;
  height: 130px;
  margin-top: 20px;
  align-items: center;
  text-align: center;
`;
const MyMenuMiddle = styled.div`
  height: 120px;
  border-bottom: 1px solid #dddddd;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 25px auto;
  text-align: center;
`;
const Circle = styled.div`
  background-color: rgb(254, 237, 229);
  width: 70px;
  height: 70px;
  border-radius: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  cursor: pointer;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const MyList = styled.div`
  height: 70px;
  border-bottom: 1px solid #dddddd;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding-bottom: 15px;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 55%;
    left: 50%;
    width: 1px;
    height: 70%; // 원하는 높이(%)로 조절
    background-color: #dddddd;
    transform: translate(-50%, -50%);
  }
`;
const Content = styled.div``;

const CommunityList = styled.div`
  display: flex; /* Flexbox 사용 */
  flex-wrap: wrap; /* 창 크기에 따라 자동으로 다음 행으로 넘어가게 설정 */
`;

const CommunityItem = styled.div``;

const CompanionItem = styled.div``;
const Picture = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    // img 태그에 대한 스타일을 정의
    width: 213.333px; // 너비를 250px로 설정
    height: 213.333px; // 높이를 250px로 설정
    object-fit: cover; // 이미지의 비율을 유지하면서, 요소에 꽉 차게 표시
  }
`;
export default MyPage;
