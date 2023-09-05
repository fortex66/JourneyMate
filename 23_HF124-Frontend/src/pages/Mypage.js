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
const imgURL = "https://journeymate.s3.ap-northeast-2.amazonaws.com/";
function MyPage() {
  const navigate = useNavigate();
  const [write, setWrite] = useState(false);
  const [selectedColor, setSelectedColor] = useState("faGlobe");
  const [CommunityData, setCommunityData] = useState(null);
  const [companionData, setCompanionData] = useState(null);
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null); // new state for storing user data
  const [scrapedPosts, setScrapedPosts] = useState([]);
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
  console.log(CommunityData);
  const getCompanion = async () => {
    try {
      const resCompanion = await axios.get(baseURL + `mypage/companion`);
      console.log(resCompanion.data);
      setCompanionData(resCompanion.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(companionData);

  useEffect(() => {
    // 페이지가 로드될 때 실행할 코드
    window.scrollTo(0, 0);
    getUserProfile();
    getCommunity();
    getCompanion();
  }, []); // 빈 배열은 이 useEffect가 컴포넌트가 마운트될 때만 실행되게 함
  useEffect(() => {
    const fetchScrapedPosts = async () => {
      try {
        const response = await axios.get(`${baseURL}mypage/scrap`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        setScrapedPosts(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchScrapedPosts();
  }, []);

  console.log(scrapedPosts.length);
  return (
    <div className="Wrap">
      <Title>
        {" "}
        <p>마이페이지</p>
      </Title>
      <div className="topView">
        <div className="ContentsBox">
          <Upwrap>
            {" "}
            <MyInfoBox>
              <div style={{ alignItems: "center" }}>
                <Circle1
                  onClick={() => {
                    navigate("/Profile");
                  }}
                >
                  {image ? (
                    <img
                      src={`${imgURL}${image && image.replace(/\\/g, "/")}`}
                      alt="chosen"
                      style={{ width: "100%", borderRadius: "100%" }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faUser}
                      size="2x"
                      color={"#f97800"}
                    />
                  )}
                </Circle1>
                <ID>{CommunityData && CommunityData.posts.rows[0].userID}</ID>
              </div>
            </MyInfoBox>
            <Count>
              {" "}
              <CommunityW>
                <CT> 커뮤니티</CT>
                <CC>{CommunityData && CommunityData.posts.count}</CC>
              </CommunityW>
              <CompanionW>
                <CPT> 동행인</CPT>

                <CPC>{companionData && companionData.posts.count}</CPC>
              </CompanionW>
              <ScrapW
                onClick={() => {
                  navigate("/Scrap");
                }}
              >
                <ST> 스크랩</ST>

                <SC> {scrapedPosts.length}</SC>
              </ScrapW>
            </Count>
          </Upwrap>
        </div>
      </div>
      <MyList selectedColor={selectedColor}>
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
const Upwrap = styled.div`
  display: flex;
`;
const Count = styled.div`
  display: flex;
  margin-left: 200px;
  margin-top: 80px;
  justify-content: space-between;
`;
const CommunityW = styled.div`
  margin-left: -100px;
  margin-right: 90px; /* 오른쪽 마진 추가 */
`;
const CT = styled.text`
  font-size: 20px;
  font-weight: bold;
`;
const CC = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
`;

const CompanionW = styled.div`
  margin-right: 90px; /* 오른쪽 마진 추가 */
`;
const CPT = styled.text`
  font-size: 20px;
  font-weight: bold;
`;
const CPC = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
`;

const ScrapW = styled.div``;
const ST = styled.text`
  font-size: 20px;
  font-weight: bold;
`;
const SC = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
`;
const ID = styled.text`
  font-weight: bold;
`;

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
  //justify-content: start;
  //border-bottom: 1px solid #dddddd;
  height: 120px;
  margin-top: 10px;
  align-items: center;
  text-align: center;
  margin-left: 50px;
  margin-top: 50px;
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

const Circle1 = styled.div`
  background-color: rgb(254, 237, 229);
  width: 90px;
  height: 90px;
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
  &::before {
    // 선택요소의 시작부분
    content: "";
    position: absolute;
    bottom: 0; // 아래쪽에 위치
    height: 2px; // 두께는 2px
    background-color: orange; // 주황색 배경
    width: 50%; // 화면의 중간만큼의 넓이
    transition: left 0.3s ease; // 왼쪽으로 이동하는 애니메이션
    left: ${(props) =>
      props.selectedColor === "faGlobe"
        ? "0%"
        : "50%"}; // selectedColor에 따라 위치 변경
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
