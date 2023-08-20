import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import Navigationbar from "../components/Navigationbar";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { faComment as faCommentSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Cmodal from "../components/Cmodal";

const baseURL = "http://localhost:3000/";

const Companion = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ posts: { rows: [] } }); // 초기값 변경
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const [write, setWrite] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState("20px");
  const observer = useRef();

  const location = useLocation();
  const searchTriggered = location.state?.searchTriggered || false;
  const tagList = location.state ? location.state.tagList : [];
  const selectedLocation = location.state ? location.state.location : "";
  const gender = location.state ? location.state.gender : null;
  const age = location.state ? location.state.age : null;
  const startDate = location.state ? location.state.startDate : null;
  const endDate = location.state ? location.state.endDate : null;

  useEffect(() => {
    const updateButtonPosition = () => {
      const windowWidth = window.innerWidth;
      const breakpoint = 600;
      if (windowWidth > breakpoint) {
        setButtonPosition(`${(windowWidth - breakpoint) / 2}px`);
      } else {
        setButtonPosition("0px");
      }
    };

    // Set initial position
    updateButtonPosition();

    // Update position on window resize
    window.addEventListener("resize", updateButtonPosition);

    // Clean up
    return () => {
      window.removeEventListener("resize", updateButtonPosition);
    };
  }, []);

  const lastPostElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  const handleSearchClick = () => {
    navigate("/Search");
  };

  const goDetail = (postId) => {
    navigate(`/Companion_Detail/${postId}`);
  };
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  const goUserDetail = (userId) => {
    navigate(`/UserDetail/${userId}`);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // optional
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    if (searchTriggered) return; // 검색이 실행되면 아무 것도 하지 않습니다.
    console.log(`그냥 동행인 시작전 ${page}, ${searchTriggered} `);
    const fetchMoreData = async () => {
      try {
        console.log(`그냥 동행인 ${page}`);
        const response = await axios.get(
          `${baseURL}companion/?page=${page}&sort=${sort}`
        );
        console.log(response.data);
        setData((prevData) => ({
          ...prevData,
          posts: {
            ...prevData.posts,
            rows: [...prevData.posts.rows, ...response.data.posts.rows],
          },
        }));
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    if (page > 1 || !searchTriggered) {
      // 페이지가 1보다 크거나, 검색이 실행되지 않은 경우에 추가 결과를 불러옵니다.
      fetchMoreData();
    }
  }, [page, searchTriggered, sort]); // 의존성 배열에 page를 추가합니다.

  useEffect(() => {
    if (!searchTriggered) return;
    const fetchData = async () => {
      console.log(`서치 시작전 페이지 :  ${page},${searchTriggered}`);
      try {
        if (selectedLocation || tagList) {
          console.log(`서치 ${page}`);
          const response = await axios.get(`${baseURL}companion/search`, {
            params: {
              page,
              tags: tagList.join(","),
              location: selectedLocation ? selectedLocation.address_name : null,
              pgender: gender,
              age: age,
              startDate: startDate
                ? startDate.toISOString().split("T")[0]
                : null,
              finishDate: endDate ? endDate.toISOString().split("T")[0] : null,
              sort,
            },
          });
          if (page > 1) {
            // 페이지가 1보다 크면 기존 데이터에 추가
            setData((prevData) => ({
              ...prevData,
              posts: {
                ...prevData.posts,
                rows: [...prevData.posts.rows, ...response.data.posts.rows],
              },
            }));
          } else {
            // 페이지가 1이면 새로운 데이터로 설정
            setData(response.data);
            console.log(`서치 동행인 결과 ${response.data.posts.rows}`);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [
    selectedLocation,
    tagList,
    searchTriggered,
    page,
    gender,
    age,
    startDate,
    endDate,
    sort,
  ]);

  if (!data || !data.posts || !data.posts.rows) return null;

  return (
    <Container>
      <Header>
        <SearchInput
          type="text"
          onClick={handleSearchClick}
          placeholder="검색"
        />
        <IconContainer onClick={() => setWrite(!write)}>
          {write && <Cmodal closeModal={() => setWrite(!write)}></Cmodal>}
          <FontAwesomeIcon icon={faSquarePlus} size="3x" color={"#f97800"} />
        </IconContainer>
      </Header>
      <Content>
        <Sort>
          <button
            onClick={() => {
              if (sort === "latest") return;
              setSort("latest");
              setPage(1);
              setData({ posts: { rows: [] } });
            }}
          >
            최신순
          </button>
          <button
            onClick={() => {
              if (sort === "dueDate") return;
              setSort("dueDate");
              setPage(1);
              setData({ posts: { rows: [] } });
            }}
          >
            마감순
          </button>
        </Sort>
        <Companion_List>
          {data &&
            data.posts.rows.map((post, index) => (
              <CompanionItem
                ref={
                  index === data.posts.rows.length - 1
                    ? lastPostElementRef
                    : null
                }
                key={index}
                onClick={() => goDetail(data.posts.rows[index].cpostID)}
              >
                <div>
                  <Picture>
                    <div>
                      <img
                        src={`${baseURL}${
                          post.post_images[0]
                            ? post.post_images[0].imageURL.replace(/\\/g, "/")
                            : ""
                        }`}
                      />
                    </div>
                  </Picture>
                  <Title>
                    <Title1> {post.title}</Title1>
                    <Titlebar>
                      <DetailInfo>
                        <ProfileImage
                          onClick={(e) => {
                            e.stopPropagation(); // 부모로의 클릭 이벤트 전파를 중단합니다.
                            goUserDetail(post.userID);
                          }}
                        >
                          {" "}
                          {post.users.profileImage === null ? (
                            <img
                              alt="chosen"
                              style={{ width: "100%", borderRadius: "100%" }}
                            />
                          ) : (
                            <img
                              src={`${baseURL}${post.users.profileImage.replace(
                                /\\/g,
                                "/"
                              )}`}
                              style={{ width: "100%", borderRadius: "100%" }}
                            />
                          )}{" "}
                        </ProfileImage>
                        <Id>{post.userID}</Id>
                      </DetailInfo>
                      <Heart>
                        <FontAwesomeIcon icon={faCommentSolid} color="F97800" />
                      </Heart>
                    </Titlebar>
                  </Title>
                </div>
              </CompanionItem>
            ))}
        </Companion_List>
      </Content>

      <ScrollToTopButton
        onClick={scrollToTop}
        style={{ display: isVisible ? "block" : "none", right: buttonPosition }}
      >
        <FontAwesomeIcon icon={faChevronUp} size="3x" color="#f97800" />
      </ScrollToTopButton>

      <Navigationbar />
    </Container>
  );
};
const ProfileImage = styled.div`
  background-color: rgb(254, 237, 229);
  width: 30px;
  height: 30px;
  border-radius: 80%;
  display: flex;
  align-items: center;

  margin-bottom: 10px;
  cursor: pointer;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const Id = styled.div`
  margin-top: 1px;
  font-size: 15px;
  margin-left: 10px;
`;
const DetailInfo = styled.div`
  display: flex;
`;
const Title1 = styled.div`
  margin-bottom: 10px;
`;
const ScrollToTopButton = styled.button`
  border-radius: 50%;
  border: none;
  background-color: #fff;
  position: fixed;
  bottom: 120px;
`;
const Sort = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0px 50px 20px 50px;
  button {
    box-sizing: border-box;
    appearance: none;
    background-color: #f97800;
    border: 1px solid #f97800;
    border-radius: 0.6em;
    color: #fff;
    cursor: pointer;
    align-self: center;
    font-size: 12px;
    font-family: "Nanum Gothic", sans-serif;
    line-height: 1;
    margin: 10px;
    padding: 0.6em 2em;
    text-decoration: none;
    letter-spacing: 2px;
    font-weight: bold;
  }
`;

const SearchInput = styled.input`
  width: 70%;
  height: 40px;
  border-radius: 15px;
  border: 1px solid #dadde0;
  padding: 0 10px;
  &:focus {
    outline: none;
  }
  margin-top: 10px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-right: 10px;
  cursor: pointer;
`;
const Container = styled.div`
  position: relative;
  width: 100%;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 640px;
  position: fixed;
  top: 0;
  height: 90px;
  background-color: #fff;
  border-bottom: 1px solid;
`;

const CompanionBox = styled.div`
  margin-right: 20px;
  margin-left: 20px;
`;

const Content = styled.div`
  margin-right: 20px;
  margin-left: 20px;
  margin-top: 100px;
`;
const Companion_List = styled.div`
  display: flex; /* Flexbox 사용 */
  flex-wrap: wrap; /* 창 크기에 따라 자동으로 다음 행으로 넘어가게 설정 */
  justify-content: space-between; /* 각 아이템 사이에 공간 배분 */
`;

const CompanionItem = styled.div`
  cursor: pointer;
  break-inside: avoid-column;
  background-color: rgb(240, 240, 240);
  margin-bottom: 20px;
  padding: 20px;
  width: calc(
    45% - 20px
  ); /* 두 개의 컴포넌트가 한 행에 들어갈 수 있도록 너비 설정. 간격을 고려하여 -20px 함 */
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  align-items: center;
`;

const Picture = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  img {
    // img 태그에 대한 스타일을 정의
    width: 250px; // 너비를 250px로 설정
    height: 250px; // 높이를 250px로 설정
    object-fit: cover; // 이미지의 비율을 유지하면서, 요소에 꽉 차게 표시
  }
`;
const Titlebar = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`;

const Heart = styled.div`
  font-size: 15px;
`;

export default Companion;
