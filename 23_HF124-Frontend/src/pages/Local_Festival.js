import React, { useEffect, useState } from "react";
import Navigationbar from "../components/Navigationbar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Local_Festival = () => {
  const navigate = useNavigate();
  const [data, setData] = useState("");

  const baseURL = "http://apis.data.go.kr/B551011/KorService1/";
  const OPEN_KEY =
    "gjCAjUo72Uf%2BjMwy1BdQo85%2B1vNiWiTVe4X987jUj42meneObLKNI%2F4pAYfK%2BysqF%2FObJvxdZp7Fe4uA6%2FPxKQ%3D%3D";

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          "https://apis.data.go.kr/B551011/KorService1/searchFestival1?numOfRows=20&MobileOS=ETC&MobileApp=Jorneymate&_type=json&eventStartDate=20230723&serviceKey=gjCAjUo72Uf%2BjMwy1BdQo85%2B1vNiWiTVe4X987jUj42meneObLKNI%2F4pAYfK%2BysqF%2FObJvxdZp7Fe4uA6%2FPxKQ%3D%3D"
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

  const getNewsByKeyword = async () => {
    let keyword = document.getElementById("search-input").value;
    const realkeyword = encodeURIComponent(keyword);
    try {
      const response = await fetch(
        `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?numOfRows=200&MobileOS=ETC&MobileApp=Journeymate&_type=json&arrange=R&keyword=${realkeyword}&contentTypeId=15&serviceKey=gjCAjUo72Uf%2BjMwy1BdQo85%2B1vNiWiTVe4X987jUj42meneObLKNI%2F4pAYfK%2BysqF%2FObJvxdZp7Fe4uA6%2FPxKQ%3D%3D`
      );
      const json = await response.json();
      console.log(json.response.body.items.item);
      setData(json.response.body.items.item);
    } catch (error) {}
  };

  return (
    <Container>
      <Header>
        <SearchInput id="search-input" type="text" placeholder="검색" />
        <button onClick={getNewsByKeyword}>검색</button>
      </Header>
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
                <Title>{info.title}</Title>
                <Img src={info.firstimage} alt={"사진이 없습니다."} />
                <Address>{address}</Address>
              </Box>
            );
          })}
      </div>

      <Navigationbar />
    </Container>
  );
};
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
  background-color: rgb(240, 240, 240);
  border-radius: 30px; // 둥근 모서리를 위한 코드 추가
  margin-right: 20px;
  margin-left: 20px;
`;
const Address = styled.div``;
const Title = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
`;

const Img = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  width: 500px;
  margin-left: 50px;
  padding-top: 5px;
  border-radius: 30px; // 둥근 모서리를 위한 코드 추가
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
export default Local_Festival;
