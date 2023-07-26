import Navigationbar from "../components/Navigationbar";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useState, useRef } from "react";

axios.defaults.withCredentials = true;

const Community_Search = () => {
  const navigate = useNavigate();
  const locationRef = useRef();
  const [locationList, setLocationList] = useState([]);
  const [tagItem, setTagItem] = useState(""); // 태그 입력값
  const [tagList, setTagList] = useState([]); // 태그 리스트
  const [selectedLocation, setSelectedLocation] = useState({});

  const searchLocation = async () => {
    const query = locationRef.current.value;

    if (!query.trim()) {
      // 입력값이 비어있는 경우 API 호출을 막습니다.
      setLocationList([]); // 위치 목록을 초기화하면서 자동완성 리스트를 비웁니다.
      return; // 빈 문자열인 경우 함수를 여기서 종료합니다.
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/community/posts/search-keyword?query=${locationRef.current.value}`
      );
      if (response.status === 200) {
        // response.data가 배열인지 확인하고, 배열이 아니면 빈 배열로 설정
        setLocationList(Array.isArray(response.data) ? response.data : []);
      } else {
        console.error("주소 검색 실패", response.status);
      }
    } catch (error) {
      console.error("주소를 검색하는 도중 에러가 발생했습니다", error);
    }
  };

  // 태그 입력 처리
  const onKeyPress = (e) => {
    if (e.target.value.length !== 0 && e.key === "Enter") {
      submitTagItem();
    }
  };

  // 태그 추가 처리
  const submitTagItem = () => {
    let updatedTagList = [...tagList];
    updatedTagList.push(tagItem);
    setTagList(updatedTagList);
    setTagItem("");
  };

  // 태그 삭제 처리
  const deleteTagItem = (e) => {
    const deleteTagItem = e.target.parentElement.firstChild.innerText;
    const filteredTagList = tagList.filter(
      (tagItem) => tagItem !== deleteTagItem
    );
    setTagList(filteredTagList);
  };

  // 선택한 위치를 사용하기 위함
  const handleLocationSelect = (location) => {
    locationRef.current.value = location.place_name;
    setSelectedLocation({
      x: location.x,
      y: location.y,
      address_name: location.address_name,
    });
    setLocationList([]);
  };

  return (
    <div>
      <Navigation>
        <Header>
          <div className="left">
            <button className="back_btn" onClick={() => navigate(-1)}>
              {"<"}
            </button>
          </div>
          <Title>맞춤찾기</Title>
          <div className="right"></div>
        </Header>
      </Navigation>

      <Info>
        <input
          name="location"
          placeholder="위치 입력"
          ref={locationRef}
          onChange={searchLocation}
        />
        {locationList.map((location, i) => (
          <li key={i} onClick={() => handleLocationSelect(location)}>
            {location.place_name}
          </li>
        ))}
        {tagList.map((tagItem, index) => {
          return (
            <TagItem key={index}>
              <Text>{tagItem}</Text>
              <tagButton onClick={deleteTagItem}>X</tagButton>
            </TagItem>
          );
        })}
        <TagInput
          type="text"
          placeholder="태그를 입력해주세요!"
          onChange={(e) => setTagItem(e.target.value)}
          value={tagItem}
          onKeyPress={onKeyPress}
        />
      </Info>

      <Navigationbar />
    </div>
  );
};

export default Community_Search;

const Title = styled.div`
  color: #f97800;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Navigation = styled.div`
  position: relative;
  box-sizing: border-box;
  height: auto;
  overflow-y: auto;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  width: 640px;
  height: 70px;
  z-index: 100; // Optional: ensure the header is always on top
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dadada;
  background-color: white;

  .left,
  .right {
    width: 100px; // 이 값을 조절해서 버튼과 타이틀 사이의 간격을 변경할 수 있습니다.
  }

  button {
    box-sizing: border-box;
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
    margin: 20px;
    padding: 0.6em 2em;
    text-decoration: none;
    letter-spacing: 2px;
    font-weight: 700;

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
  button.back_btn {
    padding: 0.6em 1em;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 80px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgb(234, 235, 239);

  input {
    border: 0;
    outline: none;
    padding: 10px;
    font-family: "Nanum Gothic", sans-serif;
  }
`;

const TagInput = styled.input`
  display: inline-flex;
  min-width: 200px;
  background: transparent;
  border: none;
  outline: none;
  cursor: text;
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px;
  padding: 5px;
  background-color: tomato;
  border-radius: 5px;
  color: white;
  font-size: 13px;
`;

const Text = styled.span``;