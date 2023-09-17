//Community_Search.js
import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navigationbar from "../components/Navigationbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

axios.defaults.withCredentials = true;
const baseURL = "http://localhost:3000/";
const Community_Search = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  //const [title, setTitle] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(true); //Community에 searchTriggered값을 true로
  //날려서 검색 useeffect가 실행되게 하기 위함

  const [inputValue, setInputValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (selectedFilter === "title") setTitle(inputValue);
      if (selectedFilter === "location") setLocation(inputValue);
      if (selectedFilter === "tag") setTags([...tags, inputValue]);

      setInputValue("");
    }
  };

  const handleTagDelete = (index) => {
    setTags(tags.filter((_, idx) => idx !== index));
  };


  // 서버로 전송하는 부분
  const handleCompleteBtnClick = async () => {
    try {

      const response = await axios.get(`${baseURL}community/searchcount`, {
        params: {
          location: location === "" ? "empty" : location,
        },
      });
      console.log(response);
      if (response.status === 200) {
        return true; // Return true on success
      } else {
        console.error("Failed to update search count", response.status);
        return false; // Return false on failure
      }
    } catch (error) {
      console.error("An error occurred while updating search count", error);
      return false; // Return false on error
    }
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
      <Filter>
        <TitleSelect 
          onClick={() => handleFilterClick("title")} 
          selected={selectedFilter === "title"}
        >
          제목
        </TitleSelect>
        <LocationSelect 
          onClick={() => handleFilterClick("location")} 
          selected={selectedFilter === "location"}
        >
          위치
        </LocationSelect>
        <TagSelect 
          onClick={() => handleFilterClick("tag")} 
          selected={selectedFilter === "tag"}
        >
          태그
        </TagSelect>
        
      </Filter>
      <InputWrapper>
        <SearchIcon icon={faMagnifyingGlass} />
        <TotalInput 
          placeholder="검색 입력" 
          value={inputValue} 
          onChange={handleInputChange} 
          onKeyPress={handleInputKeyPress}
        />
      </InputWrapper>
      <MainContainer>
        <TitleContainer>
          <TitleName>
            제목
          </TitleName>
          <TitleContent>
            {title}
            {title && <DeleteButton onClick={() => setTitle("")}>x</DeleteButton>}
          </TitleContent>
        </TitleContainer>

        <LocationContainer>
          <LocationName>
            위치
          </LocationName>
          <LocationContent>
            {location}
            {location && <DeleteButton onClick={() => setLocation("")}>x</DeleteButton>}
          </LocationContent>
        </LocationContainer>

        <TagContainer>
          <TagName>
            태그
          </TagName>
          {tags.map((tag, index) => (
            <TagItem key={index}>
              {tag}
              <DeleteButton onClick={() => handleTagDelete(index)}>x</DeleteButton>
            </TagItem>
          ))}
        </TagContainer>
      </MainContainer>

      </Info>
      <Button>
        <button className="complete_btn"
          onClick={async () => {
            const isSuccess = await handleCompleteBtnClick();
            if (isSuccess) {
              navigate("/Community", { state: { posts, title, location: location, searchTriggered, tagList: tags,},});
            }
          }}
        >
          찾기
        </button>
      </Button>
      <Navigationbar />
    </div>
  );
};

export default Community_Search;
const TagButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-left: 5px;
  background-color: white;
  border-radius: 50%;
  color: tomato;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;

  button.complete_btn {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    appearance: none;
    background-color: transparent;
    border: 2px solid #f97800;
    border-radius: 0.6em;
    color: #f97800;
    cursor: pointer;
    font-size: 16px;
    font-family: "Nanum Gothic", sans-serif;
    line-height: 1;
    padding: 0.6em 1em;
    text-decoration: none;
    letter-spacing: 2px;
    font-weight: 700;

    &:hover,
    &:focus {
      color: #fff;
      outline: 0;
    }
    &:hover {
      box-shadow: 0 0 40px 40px #f97800 inset;
    }

    &:focus:not(:hover) {
      color: #f97800;
      box-shadow: none;
    }
  }
`;

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


`;

const Filter = styled.div`
  margin : 20px 0px 20px 20px;
`

const TitleSelect = styled.button`
  background-color: ${props => props.selected ? 'rgb(37, 37, 37)' : 'rgb(218 218 218)'};
  color:  ${props => props.selected ? 'rgb(248, 248, 248)' : 'rgb(37, 37, 37)'};

  height: 40px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  box-sizing: border-box;
  flex-wrap: nowrap;
  flex-shrink: 0;
  font-weight: 400;
  font-size: 14px;
  margin-right: 12px;
  line-height: 21px;
  transition: all 0.25s ease-out 0s;
  font-family: NotoSansKR, "Noto Sans CJK KR", sans-serif;
  margin-right:10px;
  cursor:pointer;


`;

const LocationSelect = styled.button`
background-color: ${props => props.selected ? 'rgb(37, 37, 37)' : 'rgb(218 218 218)'};
color:  ${props => props.selected ? 'rgb(248, 248, 248)' : 'rgb(37, 37, 37)'};

height: 40px;
padding: 10px;
border: none;
border-radius: 10px;
box-sizing: border-box;
flex-wrap: nowrap;
flex-shrink: 0;
font-weight: 400;
font-size: 14px;
margin-right: 12px;
line-height: 21px;
transition: all 0.25s ease-out 0s;
font-family: NotoSansKR, "Noto Sans CJK KR", sans-serif;
margin-right:10px;
cursor:pointer;


`;

const TagSelect = styled.button`
background-color: ${props => props.selected ? 'rgb(37, 37, 37)' : 'rgb(218 218 218)'};
color:  ${props => props.selected ? 'rgb(248, 248, 248)' : 'rgb(37, 37, 37)'};

height: 40px;
padding: 10px;
border: none;
border-radius: 10px;
box-sizing: border-box;
flex-wrap: nowrap;
flex-shrink: 0;
font-weight: 400;
font-size: 14px;
margin-right: 12px;
line-height: 21px;
transition: all 0.25s ease-out 0s;
font-family: NotoSansKR, "Noto Sans CJK KR", sans-serif;
margin-right:10px;
cursor:pointer;


`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;
`;

const TotalInput = styled.input`
  height: 30px;
  width: 300px;
  padding-left: 35px; 
  border-radius:10px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
`;



const MainContainer = styled.div`
  display:flex;
  margin : 50px 20px 50px 20px;

`

const TitleContainer = styled.div`
  background-color:rgb(218 218 218);
  display: flex;
  flex-direction: column;
  align-items: center;

`
const TitleName = styled.span`
  font-size:20px;
  font-weight:700;
`

const TitleContent = styled.div`
  display:flex;
`

const LocationContainer = styled.div`
  background-color:rgb(218 218 218);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const LocationName = styled.span`
font-size:20px;
font-weight:700;
`

const LocationContent = styled.div`
display:flex;
`

const TagContainer = styled.div`
background-color:rgb(218 218 218);
display: flex;
flex-direction: column;
align-items: center;
`;

const TagName = styled.span`
font-size:20px;
font-weight:700;
`

const TagItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0 5px;
  padding: 5px;
  border: 1px solid #000;
`;

const DeleteButton = styled.button`
  color:red;
  border:none;
  background-color:transparent;
  cursor:pointer;
`;

const Titleinput = styled.input`
  border: 0;
  outline: none;
  padding: 10px;
  font-family: "Nanum Gothic", sans-serif;
  cursor: text;
`

const Locationinput = styled.input`
  border: 0;
  outline: none;
  padding: 10px;
  font-family: "Nanum Gothic", sans-serif;
  cursor: text;
`

const TagInput = styled.input`
  border: 0;
  outline: none;
  padding: 10px;
  font-family: "Nanum Gothic", sans-serif;
  cursor: text;
`;



const Text = styled.span``;
