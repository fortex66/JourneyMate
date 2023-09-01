import React, { useEffect, useState } from "react";
import Navigationbar from "../components/Navigationbar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Local_Festival = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어 상태 추가
  const [showModal, setShowModal] = useState(false); // 모달 보이기 상태
  const [selectedRegion, setSelectedRegion] = useState(""); // 선택된 지역 상태
  const areaCodes = {
    서울: 1,
    인천: 2,
    대전: 3,
    대구: 4,
    광주: 5,
    부산: 6,
    울산: 7,
    세종특별자치시: 8,
    경기도: 31,
    강원특별자치도: 32,
    충청북도: 33,
    경상북도: 34,
    경상남도: 35,
    전라북도: 37,
    전라남도: 38,
    제주도: 39,
  };

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

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          "https://apis.data.go.kr/B551011/KorService1/searchFestival1?numOfRows=2000&MobileOS=ETC&MobileApp=Journeymate&_type=json&arrange=R&eventStartDate=19000101&serviceKey=gjCAjUo72Uf%2BjMwy1BdQo85%2B1vNiWiTVe4X987jUj42meneObLKNI%2F4pAYfK%2BysqF%2FObJvxdZp7Fe4uA6%2FPxKQ%3D%3D"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json.response.body.items.item);
        setData(json.response.body.items.item);
      } catch (error) {
        console.error("Fetching API failed:", error);
      }
    })();
  }, [baseURL]);
  console.log(data);

  const getByKeyword = async () => {
    const realkeyword = encodeURIComponent(searchKeyword);
    const areaCodeParam = selectedRegion ? `&areaCode=${selectedRegion}` : "";
    try {
      const response = await fetch(
        `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?numOfRows=1000&MobileOS=ETC&MobileApp=Journeymate&_type=json&arrange=R&keyword=${realkeyword}&contentTypeId=15&areaCode=${areaCodeParam}&serviceKey=gjCAjUo72Uf%2BjMwy1BdQo85%2B1vNiWiTVe4X987jUj42meneObLKNI%2F4pAYfK%2BysqF%2FObJvxdZp7Fe4uA6%2FPxKQ%3D%3D`
      );
      const json = await response.json();
      console.log(json.response.body.items.item);
      setData(json.response.body.items.item);
    } catch (error) {}
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      getByKeyword();
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
  return (
    <Container>
      <Header>
        <SearchInput1
          type="text"
          placeholder="지역"
          value={getRegionNameByCode(selectedRegion)} // 선택된 지역을 표시
          readOnly // 입력창은 읽기 전용
        />
        <Button onClick={() => setShowModal(true)}>지역</Button>
        <SearchInput
          id="search-input"
          type="text"
          placeholder="검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={getByKeyword}>검색</Button>
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
              <Button1 onClick={() => handleRegionClick("세종특별자치시")}>
                세종특별자치시
              </Button1>
              <Button1 onClick={() => handleRegionClick("경기도")}>
                경기도
              </Button1>
              <Button1 onClick={() => handleRegionClick("강원특별자치도")}>
                강원특별자치도
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
      <Sort>
        <button>최신순</button>
        <button>인기순</button>
        <button>댓글순</button>
      </Sort>

      <div>
        {data &&
          data.map((info, index) => {
            // 주소를 스페이스로 나눈 다음 처음 세 부분만 가져옵니다.
            const address = info.addr1.split(" ").slice(0, 2).join(" ");
            return (
              <Box key={index}>
                <Back>
                  {" "}
                  <Img
                    onClick={() => goDetail(info)}
                    src={info.firstimage}
                    alt={"사진이 없습니다."}
                  />
                  <Title>{info.title}</Title>
                  <Address>{address}</Address>
                </Back>
              </Box>
            );
          })}
      </div>

      <Navigationbar />
    </Container>
  );
};

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
margin-left:5px;
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
  display: flex;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  //background-color: #ffca9b;
  //border-radius: 30px; // 둥근 모서리를 위한 코드 추가
  margin-top: -20px;
  margin-bottom: 30px;
`;

const Img = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  width: 500px;
  cursor: pointer;
  margin-right: 50px;

  border-radius: 10px; // 둥근 모서리를 위한 코드 추가
`;
const Back = styled.div`
  border: 2px solid #dadada;
  //background-color: rgb(254, 237, 229);
  border-radius: 10px; // 둥근 모서리를 위한 코드 추가
  width: 500px;
  margin-left: 50px;
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
margin-top: 10px;
margin-left:5px;

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
const Sort = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 100px 50px 20px 50px;
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
const Box = styled.div`
  margin-top: 20px;
  border-radius: 30px; // 둥근 모서리를 위한 코드 추가
  margin-right: 20px;
  margin-left: 20px;
`;
const Address = styled.div`
  display: flex;
  justify-content: center;
  margin-top: -12px;
  font-weight: bold;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const Header = styled.div`
  justify-content: space-evenly;
  align-items: center;
  width: 640px;
  position: fixed;
  top: 0;
  height: 90px;
  background-color: #fff;
  border-bottom: 1px solid;
  z-index: 1; // Bring the header to the front
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
  pointer-events: auto;
`;
const SearchInput1 = styled.input`
  width: 60%;
  height: 40px;
  border-radius: 15px;
  border: 1px solid #dadde0;
  padding: 0 10px;
  &:focus {
    outline: none;
  }
  margin-top: 10px;
  pointer-events: auto;
`;
export default Local_Festival;
