// 0905 Local_Festival 백업
import React, { useEffect, useState, useRef, useCallback } from "react";
import Navigationbar from "../components/Navigationbar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
const Local_Festival = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어 상태 추가
  const [showModal, setShowModal] = useState(false); // 모달 보이기 상태
  const [selectedRegion, setSelectedRegion] = useState(""); // 선택된 지역 상태
  //최대날짜 지정용 변수
  const [maxDate, setMaxDate] = useState("");
  const [pageNo, setPageNo] = useState(1); // 페이지 번호 상태 추가
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const observer = useRef(); // IntersectionObserver를 위한 ref
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false); // 검색 버튼이 눌렸는지 확인하는 상태
  const [isPageLoaded, setIsPageLoaded] = useState(true); // 페이지 로딩 확인용 상태
  const areaCodes = {
    서울: 1,
    인천: 2,
    대전: 3,
    대구: 4,
    광주: 5,
    부산: 6,
    울산: 7,
    세종시: 8,
    경기도: 31,
    강원도: 32,
    충청북도: 33,
    경상북도: 34,
    경상남도: 35,
    전라북도: 37,
    전라남도: 38,
    제주도: 39,
  };

  const lastPostElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPageNo((prevPageNo) => prevPageNo + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading]
  ); // 마지막에 isLoading을 dependency로 추가

  const handleRegionClick = (region) => {
    setSelectedRegion(region === "상관없음" ? null : areaCodes[region]);
    setShowModal(false);
  };

  const getRegionNameByCode = (code) => {
    //값(value)을 받아서 해당하는 키(key)를 찾는 함수.
    return Object.keys(areaCodes).find((key) => areaCodes[key] === code) || "";
  };

  const baseURL = "http://apis.data.go.kr/B551011/KorService1/";
  const OPEN_KEY =
    "gjCAjUo72Uf%2BjMwy1BdQo85%2B1vNiWiTVe4X987jUj42meneObLKNI%2F4pAYfK%2BysqF%2FObJvxdZp7Fe4uA6%2FPxKQ%3D%3D";

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const realkeyword = encodeURIComponent(searchKeyword);
      let url = "";
      if (selectedRegion && searchKeyword) {
        url = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?numOfRows=10&pageNo=${pageNo}&MobileOS=ETC&MobileApp=Journeymate&_type=json&arrange=R&keyword=${realkeyword}&areaCode=${selectedRegion}&contentTypeId=15&serviceKey=${OPEN_KEY}`;
      } else if (selectedRegion) {
        url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?numOfRows=10&pageNo=${pageNo}&MobileOS=ETC&MobileApp=Journeymate&_type=json&arrange=R&contentTypeId=15&areaCode=${selectedRegion}&serviceKey=${OPEN_KEY}`;
      } else if (searchKeyword) {
        url = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?numOfRows=10&pageNo=${pageNo}&MobileOS=ETC&MobileApp=Journeymate&_type=json&arrange=R&keyword=${realkeyword}&contentTypeId=15&serviceKey=${OPEN_KEY}`;
      } else {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const maxDate = `${year}${month}${day}`;
        url = `https://apis.data.go.kr/B551011/KorService1/searchFestival1?numOfRows=10&pageNo=${pageNo}&MobileOS=ETC&MobileApp=Journeymate&_type=json&arrange=R&eventStartDate=${maxDate}&serviceKey=${OPEN_KEY}`;
      }
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const json = await response.json();
      const newItems = json.response?.body?.items?.item || [];
      if (pageNo === 1) {
        setData(newItems);
      } else {
        setData((prevData) => [...prevData, ...newItems]);
      }
    } catch (error) {
      console.error("Fetching API failed:", error);
    }
    setIsLoading(false);
  };
  console.log(data);
  useEffect(() => {
    if (isSearchButtonClicked || isPageLoaded || pageNo > 1) {
      fetchData();
    }
    if (isSearchButtonClicked) {
      setIsSearchButtonClicked(false); // 다시 false로 설정
    }
    if (isPageLoaded) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const maxDate = `${year}${month}${day}`;
      setMaxDate(maxDate);
      setIsPageLoaded(false); // 다시 false로 설정
    }
  }, [isSearchButtonClicked, isPageLoaded, pageNo]);

  const getByKeyword = () => {
    setPageNo(1); // 페이지 번호를 1로 리셋
    setIsSearchButtonClicked(true); // 검색 버튼이 눌렸음을 설정
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setPageNo(1); // 페이지 번호를 1로 리셋
      fetchData(); // 검색 실행
    }
  };
  const goDetail = (info) => {
    navigate("/Festival_detail", {
      state: { festivalData: info },
    });
  };
  const handleModalClose = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };
  function formatDate(dateString) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    return `${year}.${month}.${day}`;
  }
  return (
    <Container>
      <Header>
        <Local>
          <Button onClick={() => setShowModal(true)}>
            {getRegionNameByCode(selectedRegion) || "지역 선택"}
          </Button>
        </Local>
        <Keyword>
          <SearchHeader>
            {" "}
            <SearchInput
              id="search-input"
              type="text"
              placeholder="검색어를 입력해주세요"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              onClick={getByKeyword}
              color={"#f97800"}
            />
          </SearchHeader>
        </Keyword>
      </Header>

      {showModal && (
        <Modal onClick={handleModalClose}>
          <ModalContent className="modal">
            <div className="modal">
              <Button1 onClick={() => handleRegionClick("서울")}>서울</Button1>
              <Button1 onClick={() => handleRegionClick("인천")}>인천</Button1>
              <Button1 onClick={() => handleRegionClick("대전")}>대전</Button1>
              <Button1 onClick={() => handleRegionClick("대구")}>대구</Button1>
              <Button1 onClick={() => handleRegionClick("광주")}>광주</Button1>
              <Button1 onClick={() => handleRegionClick("부산")}>부산</Button1>
              <Button1 onClick={() => handleRegionClick("울산")}>울산</Button1>
              <Button1 onClick={() => handleRegionClick("세종시")}>
                세종시
              </Button1>
              <Button1 onClick={() => handleRegionClick("경기도")}>
                경기도
              </Button1>
              <Button1 onClick={() => handleRegionClick("강원도")}>
                강원도
              </Button1>
              <Button1 onClick={() => handleRegionClick("충청북도")}>
                충청북도
              </Button1>
              <Button onClick={() => handleRegionClick("경상북도")}>
                경상북도
              </Button>
              <Button1 onClick={() => handleRegionClick("경상남도")}>
                경상남도
              </Button1>
              <Button1 onClick={() => handleRegionClick("전라북도")}>
                전라북도
              </Button1>
              <Button1 onClick={() => handleRegionClick("전라남도")}>
                전라남도
              </Button1>
              <Button1 onClick={() => handleRegionClick("제주도")}>
                제주도
              </Button1>
              <Button1 onClick={() => handleRegionClick("상관없음")}>
                상관없음
              </Button1>
            </div>
          </ModalContent>
        </Modal>
      )}
      <div>
        <Content>
          {data &&
            data.map((info, index) => {
              const address = info.addr1.split(" ").slice(0, 2).join(" ");
              if (data.length === index + 1) {
                return (
                  <Box ref={lastPostElementRef} key={index}>
                    <Img
                      onClick={() => goDetail(info)}
                      src={info.firstimage}
                      alt={"사진이 없습니다."}
                    />
                    <Info>
                      <Title>{info.title}</Title>
                      <Address>
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          color={"#f97800"}
                        />{" "}
                        {address}
                      </Address>
                      <FontAwesomeIcon icon={faLocationDot} />
                      <EventDate>
                        {info.eventstartdate
                          ? formatDate(info.eventstartdate)
                          : ""}
                      </EventDate>
                    </Info>
                  </Box>
                );
              } else {
                return (
                  <Box key={index}>
                    <Back>
                      {" "}
                      <Img
                        onClick={() => goDetail(info)}
                        src={info.firstimage}
                        alt={"사진이 없습니다."}
                      />
                      <Info>
                        {" "}
                        <Title>{info.title}</Title>
                        <Address>
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            color={"#f97800"}
                          />{" "}
                          {address}
                        </Address>
                        <EventDate>
                          {info.eventstartdate
                            ? formatDate(info.eventstartdate)
                            : ""}
                        </EventDate>
                      </Info>
                    </Back>
                  </Box>
                );
              }
            })}
        </Content>
      </div>

      <Navigationbar />
    </Container>
  );
};
const Address = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;
const EventDate = styled.div`
  margin-bottom: 8px;
`;

const Local = styled.div`
  display: flex; // 오타 수정
  justify-content: center;
  align-items: center; // 추가
`;

const Keyword = styled.div`
  display: flex; // 오타 수정
  justify-content: center;
  align-items: center; // 추가
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap; // 각 지역의 버튼이 뜰 때 한 줄에 3개씩 뜨도록 설정
  justify-content: center; // 가운데 정렬
  gap: 10px; // 버튼 간의 간격
`;
const Button1 = styled.button`
appearance: none;
background-color: transparent;
border: 2px solid #f97800;
border-radius: 0.6em;
color: #f97800;
cursor: pointer;
align-self: center;
font-size: 16px;
font-family: "Nanum Gothic", sans-serif;
line-height: 1;
padding: 0.8em 1em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-top: 10px;
margin-left:-20px;
width:5px;
&:hover,
&:focus {
  color: #fff;
  outline: 0;
}
transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
&:hover {
  box-shadow: 0 0 40px 40px #f97800 inset;
}


}
`;
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  .modal {
    display: flex;
    flex-wrap: wrap; // Wrap items
    justify-content: space-around; // Distribute items
    background-color: white; // Set the background to white
    padding: 20px; // Add some padding
    border-radius: 10px; // Optional, if you want to round corners
  }

  .modal > button {
    flex-basis: calc(
      33.333% - 10px
    ); // Take up 1/3 of container width, accounting for 10px gap
    margin: 5px; // Add margin for visual separation
  }
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;
`;

const Img = styled.img`
  width: 200px;
  height: 300px;
  object-fit: cover;
  cursor: pointer;
  margin-left: 30px;
  margin-bottom: 10px;
  border-radius: 10px;
`;
const Back = styled.div`
  display: flex;
  width: 450px;
  margin-left: 30px;
  margin-bottom: 20px;
`;

// const Content = styled.div`
//   display: flex; // flex를 사용
//   flex-wrap: wrap; // 너비를 초과하면 다음 줄로 넘김
//   margin-top: 150px; //이거 늘리면 내려감
//   margin-left: 25px;
//   //justify-content: space-between; // 자식 요소들 사이에 공간을 균일하게 배분
// `;

// const Box = styled.div`
//   margin-top: 20px;
//   //border-radius: 20px;
// `;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 130px;
  margin-left: 25px;
`;

const Box = styled.div`
  margin-top: 20px;
  width: 100%;
`;
const Button = styled.button`

appearance: none;
background-color: transparent;
border: 2px solid #f97800;
border-radius: 0.6em;
color: #f97800;
cursor: pointer;
align-self: center;
font-size: 16px;
font-family: "Nanum Gothic", sans-serif;
line-height: 1;
padding: 0.8em 1em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-top: 20px;
margin-left:10px;
margin-right:10px;

&:hover,
&:focus {
  color: #fff;
  outline: 0;
}
transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
&:hover {
  box-shadow: 0 0 40px 40px #f97800 inset;
}

&:focus:not(:hover) {
  color: #f97800;
  box-shadow: none;
}
}
`;

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const SearchHeader = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  margin-top: 20px;
  height: 70px;
  padding: 0px 16px;
  width: 450px;
  border-radius: 8px;
  background-color: rgb(242, 244, 245);
  transition: width 0.25s ease 0s;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 640px;
  position: fixed;
  top: 0;
  height: 80px;

  background-color: #fff;
  border-bottom: 1px solid;
  padding-bottom: 30px; // 또는 원하는 크기로 설정
  z-index: 1; // Bring the header to the front
`;
const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 15px;
  border: none;
  padding: 0 10px;
  margin-right: 5px;
  &:focus {
    outline: none;
  }
  cursor: pointer;
`;
const SearchInput1 = styled.input`
  //width: 20%;
  height: 40px;
  border-radius: 15px;
  border: 1px solid #dadde0;
  //padding: 0 10px;
  &:focus {
    outline: none;
  }
  margin-top: 10px;
  pointer-events: auto;
  margin-left: 18px;
  width: 100px;
`;
export default Local_Festival;
