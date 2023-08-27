import Modal from "../components/Modal";
import Navigationbar from "../components/Navigationbar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./listForm.css";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faUserGroup,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const baseURL = "http://localhost:3000/";
const imgURL = "https://journeymate.s3.ap-northeast.amazonaws.com/";
function UserDetail() {
  const navigate = useNavigate();
  const [write, setWrite] = useState(false);
  const [selectedColor, setSelectedColor] = useState("faGlobe");
  const [CommunityData, setCommunityData] = useState(null);
  const [companionData, setCompanionData] = useState(null);
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null); // new state for storing user data
  const { userId } = useParams();

  const getUserProfile = async () => {
    try {
      // const userId = window.location.pathname.split("/").pop();
      console.log(userId);
      const resUser = await axios.get(baseURL + `users/profile/${userId}`, {
        userID: userId,
      });
      setUserData(resUser.data);
      setImage(resUser.data.profile.profileImage);
    } catch (error) {
      console.log(error);
    }
  };

  const getCommunity = async () => {
    try {
      //const userId = window.location.pathname.split("/").pop();
      const resCommunity = await axios.get(
        baseURL + `users/community/${userId}`,
        {
          userID: userId,
        }
      );
      setCommunityData(resCommunity.data);
      console.log(resCommunity);
    } catch (error) {
      console.log(error);
    }
  };

  const getCompanion = async () => {
    try {
      console.log("성공");
      //const userId = window.location.pathname.split("/").pop();
      const resCompanion = await axios.get(
        baseURL + `users/companion/${userId}`
      );
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

  /* 상세페이지 이동 */
  const goDetail = (postId) => {
    // postId 인자 추가
    navigate(`/Community_Detail/${postId}`); // postId를 경로의 일부로 사용
  };

  const goDetails = (postId) => {
    // postId 인자 추가
    navigate(`/Companion_Detail/${postId}`); // postId를 경로의 일부로 사용
  };
  return (
    <div className="Wrap">
      <div className="topView">
        <MyInfoBox>
          <div style={{ alignItems: "center" }}>
            <Circle>
              {image ? (
                <img
                  src={`${imgURL}${image && image.replace(/\\/g, "/")}`}
                  alt="chosen"
                  style={{ width: "100%", borderRadius: "100%" }}
                />
              ) : (
                <FontAwesomeIcon icon={faUser} size="2x" color={"#f97800"} />
              )}
            </Circle>
          </div>
          {userId}
        </MyInfoBox>
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
                      src={`${imgURL}${
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
                      src={`${imgURL}${post.post_images[0].imageURL.replace(
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

const Name = styled.div``;

const MyInfoBox = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #dddddd;
  height: 130px;
  margin-top: 20px;
  align-items: center;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
    top: 50%;
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
export default UserDetail;
