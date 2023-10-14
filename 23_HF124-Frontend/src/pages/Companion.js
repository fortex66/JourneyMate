import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import Navigationbar from "../components/Navigationbar";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {faWindowRestore, faCalendar,faLocationDot,faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Cmodal from "../components/Cmodal";


const baseURL = "http://localhost:3000/";
const imgURL = "https://journeymate.s3.ap-northeast-2.amazonaws.com/";
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
  const title = location.state ? location.state.title : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
        if (selectedLocation || tagList || title) {
          console.log(`서치 ${page}`);
          console.log(title)
          const response = await axios.get(`${baseURL}companion/search`, {
            params: {
              page,
              tags: tagList.join(","),
              location: selectedLocation ? selectedLocation.address_name : null,
              pgender: gender,
              age: age,
              title: title,
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
        <InputWrapper>
          <SearchIcon icon={faMagnifyingGlass} />
          <TotalInput 
            placeholder="검색" 
            onClick={handleSearchClick}
          />
        </InputWrapper>
        <IconContainer onClick={() => setWrite(!write)}>
          {write && <Cmodal closeModal={() => setWrite(!write)}></Cmodal>}
          <FontAwesomeIcon icon={faPen} size="2x" color={"#f97800"} />
        </IconContainer>
        <IconContainer>
          <FontAwesomeIcon onClick={() => navigate("/Community")} icon={faWindowRestore} size="2x" color={"#f97800"}/>
        </IconContainer>
      </Header>
      <Content>
        <Sort>
          <button onClick={() => {
              if (sort === "latest") return;
              setSort("latest");
              setPage(1);
              setData({ posts: { rows: [] } });
            }}
          >
            최신순
          </button>
          <button onClick={() => {
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
          {data && data.posts.rows.map((post, index) => (
              <CompanionItem ref={ index === data.posts.rows.length - 1 ? lastPostElementRef : null }
                key={index} onClick={() => goDetail(data.posts.rows[index].cpostID)}>
                <div>
                  <ProfileContainer>
                    <Profile>
                      <ProfileImage
                        onClick={(e) => {  e.stopPropagation();  goUserDetail(post.userID); }} >
                        {post.users.profileImage === null ? (
                          <img alt="chosen" style={{ width: "100%", borderRadius: "100%" }} />
                        ) : (
                          <img src={`${imgURL}${post.users.profileImage.replace( /\\/g, "/")}`} style={{ width: "100%", borderRadius: "100%" }} />
                        )}
                      </ProfileImage>
                      <ProfileData>
                        <Id>{post.userID}</Id>
                        <UserInfo>{post.users.birth}세 &nbsp;&nbsp;{post.users.gender}</UserInfo>
                      </ProfileData>
                    </Profile>
                   
                    <Personnel>{post.personnel}명 모집</Personnel>
                  </ProfileContainer>
                  <Picture>
                    <img src={`${imgURL}${ post.post_images[0] ? post.post_images[0].imageURL.replace(/\\/g, "/") : "" }`} />
                    <Location>
                      <FontAwesomeIcon icon={faLocationDot} color="#f97800" style={{ marginRight: "8px" }}/>
                      {post.location}
                    </Location>
                  </Picture>
                  <TripDate>
                    <FontAwesomeIcon icon={faCalendar} style={{ marginRight: "8px" }} />
                    {post.startDate}&nbsp;&nbsp;~&nbsp;&nbsp;{post.finishDate}
                  </TripDate>

                  <Title>
                    <Title1> {post.title}</Title1>
                    <Titlebar>
                        {post.content}
                    </Titlebar>
                  </Title>
                </div>
              </CompanionItem>
            ))}
        </Companion_List>
      </Content>

      <ScrollToTopButton onClick={scrollToTop} style={{ display: isVisible ? "block" : "none", right: buttonPosition }}>
        <FontAwesomeIcon icon={faChevronUp} size="3x" color="#f97800" />
      </ScrollToTopButton>
      <Navigationbar />
    </Container>
  );
};

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
  z-index: 1000;

  @media (max-width: 640px) {
    width: 100%;
    height: 70px; // 모바일 화면에서 높이 조정
    
  }

  @media (min-width: 601px) and (max-width: 1200px) {
    height: 80px; // 태블릿 화면에서 높이 조정
  }
`;
const InputWrapper = styled.div`
  position: relative;
  width: 70%; /* 여기서 width를 조정했습니다. */
  margin-left: 20px;
  margin-right: 20px;
`;

const TotalInput = styled.input`
  height: 40px; 
  width: 88%; 
  border-radius: 15px; 
  border: 1px solid gray; 
  padding: 0 30px; 
  &:focus {
    outline: none;
  }
  margin-top: 10px; 
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 30px;
  left: 10px;
  transform: translateY(-50%);
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-right: 10px;
  cursor: pointer;
  
  svg {
    font-size: 32px; // 기본 아이콘 크기 설정
  }

  @media (max-width: 480px) {
    margin-top: 10px;
    margin-left: 5px;
    margin-right: 5px;

    svg {
      font-size: 20px; // 모바일 화면에서 아이콘 크기 조정
    }
  }
  
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

    @media (max-width: 400px) {
      font-size: 11px;
      margin: 8px;
      padding: 0.5em 1.5em;
    }
  }

  @media (max-width: 440px) {
    margin: 5px 0px 5px 0px;
  }


`;

const ProfileContainer = styled.div`
  display: flex;
  width: 100%;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  width: 70%;
`
const ProfileImage = styled.div`
  background-color: rgb(254, 237, 229);
  width: 30px;
  height: 30px;
  border-radius: 80%;
  display: flex;

  margin-bottom: 10px;
  cursor: pointer;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileData = styled.div`
  display: flex;
  flex-direction: column;
  font-size:12px;
  margin-top: 1px;
  margin-left: 10px;
  margin-bottom: 10px;
  font-weight: 700;
`
const Id = styled.div`

`;

const UserInfo = styled.div`
  color: rgb(0, 206, 124);
`

const Personnel = styled.div`
 margin-left: 5px;
 font-size: 15px;
 width: 30%;
 color: rgb(0, 143, 246);
 font-weight: 700;
`

const Title1 = styled.div`
  overflow: hidden;
  margin-bottom: 10px;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
`;

const TripDate = styled.div`
  display : flex;
  margin-bottom: 10px;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
`


const ScrollToTopButton = styled.button`
  border-radius: 50%;
  border: none;
  background-color: #fff;
  position: fixed;
  bottom: 120px;
`;



const Container = styled.div`
  position: relative;
  width: 100%;
`;


const Content = styled.div`
  margin-right: 20px;
  margin-left: 20px;
  margin-top: 100px;

  @media (max-width: 440px) {
    margin-right: 20px;
    margin-left: 20px;
    margin-top: 70px;
    padding-top: 10px;
  }
`;
const Companion_List = styled.div`
  flex-wrap: wrap; 
  justify-content: space-between; 

  @media (max-width: 500px) {

  }

  @media (min-width: 501px) and (max-width: 1200px) {
    display: flex; 
  }
  
  @media (min-width: 1201px) {
    display: flex; 
  }
`;

const CompanionItem = styled.div`
  cursor: pointer;
  break-inside: avoid-column;
  background: rgb(255, 255, 255);
  border-radius: 14px;
  box-shadow: rgba(25, 25, 25, 0.2) 0px 6px 10px;
  margin-bottom: 20px;
  padding: 20px;
  &:hover img {
    transform: scale(1.05); /* 마우스 호버 시 이미지를 약간 확대 */
  }

  @media (max-width: 500px) {

  }

  @media (min-width: 501px) and (max-width: 1200px) {
    width: calc(
      45% - 20px
    ); 
  }
  
  @media (min-width: 1201px) {
    width: calc(
      45% - 20px
    ); 
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  overflow: hidden;
  
  white-space: nowrap;
  display: block;
  align-items: center;

`;

const Picture = styled.div`
  position: relative; /* 여기를 relative로 변경 */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;


  img {
    display: block;
    width: 100%; 
    height: 250px;
    border-radius: 14px;
    margin: 0 auto; 
    object-fit: cover; 
    transition: transform 0.3s;
    z-index: 0;

    @media (max-width: 600px) {
      width: 100%; 
      height: 250px; // 모바일 화면에서의 세로 크기
    }

    @media (min-width: 601px) and (max-width: 1200px) {
      width: 100%; 
      height: 250px; // 태블릿 화면에서의 세로 크기
    }
    
    @media (min-width: 1201px) {
      width: 100%; 
      height: 250px; // 데스크톱 화면에서의 세로 크기
    }
  }
`;

const Location = styled.div`
  position: absolute; /* Location을 absolute로 설정하여 Picture 내에서 자유롭게 위치를 조정할 수 있게 합니다. */
  top: 10px; /* top과 left 값을 조절하여 원하는 위치에 배치하세요. */
  left: 10px;
  background-color: rgba(0, 0, 0, 0.5); /* 배경색을 추가하여 텍스트가 더 잘 보이게 합니다. */
  color: white; /* 텍스트 색상을 변경하세요. */
  padding: 5px; /* 패딩을 추가하여 텍스트 주위에 공간을 만듭니다. */
  border-radius: 5px; /* 경계 반경을 추가하여 모서리를 둥글게 합니다. */
  font-size: 13px;
`;


const Titlebar = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`;



export default Companion;