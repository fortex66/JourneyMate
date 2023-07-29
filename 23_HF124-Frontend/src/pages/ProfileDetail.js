import React, { useEffect, useState, useRef  } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


import axios from "axios";

const baseURL = "http://localhost:3000/";

const ProfileDetail = () => {

  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [tagItem, setTagItem] = useState(""); // 태그 입력값
  const [tagList, setTagList] = useState([]); // 태그 리스트
  const [locationList, setLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [emailVerified, setEmailVerified] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [initialEmail, setInitialEmail] = useState(""); // 초기 이메일 값 저장

  const locationRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();

  //
  useEffect(() => {
    if (userData && userData.profile[0]) {
      setName(userData.profile[0].user);
      setEmail(userData.profile[0].email);
      setInitialEmail(userData.profile[0].email); // 초기 이메일 값 설정
    }
  }, [userData]);

  const onKeyDown = (e) => {
    if (e.target.value.length !== 0 && e.key === "Enter") {
      submitTagItem();
    }
  };

  
  //위치를 입력 받을때 kakaoapi를 활용하기 위함
  const searchLocation = async () => {
    const query = locationRef.current.value;
  
    if (!query.trim()) { // 입력값이 비어있는 경우 API 호출을 막습니다.
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

  
  // 선택한 위치를 사용하기 위함
  const handleLocationSelect = (location) => {
    locationRef.current.value = location.place_name;
    setSelectedLocation({x: location.x, y: location.y, address_name:location.address_name });
    setLocationList([]);
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
    const filteredTagList = tagList.filter((tagItem) => tagItem !== deleteTagItem);
    setTagList(filteredTagList);
  };

  //서버로 부터 유저 정보 가져오기
  const getUser = async () => {
      try {
        const resUser = await axios.get(baseURL + `mypage/profile`);
        console.log(resUser)
        setUserData(resUser.data);
        let tagNames = resUser.data.userTag.map((tag)=>(tag.tagName));
        setTagList(tagNames);
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      getUser();
    }, []); 

    const handleSubmit = async () => {
      if ((email !== initialEmail) && !emailVerified) { // 이메일이 변경되었고, 인증되지 않았다면
        alert("이메일 인증을 먼저 해주세요");
        return; 
      }
     
    try {
      // POST request to /signup endpoint with form data
      const response = await axios.put(baseURL + "mypage/profileChange",{
          user: name,
          email: email,
          address: selectedLocation.address_name,
          tags: tagList
        });
        console.log(selectedLocation.address_name);

      // Check if signup was successful
      if (response.status === 200) {
        console.log("인적사항 입력완료");
        if (window.confirm("다음 페이지로 이동하시겠습니까?"))
          navigate(-1, { replace: true });
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Failed to signup", error);
    }
  };

  const sendVerificationCode = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/signup/email-verification",
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const verificationCode = await response.text();
        const userCode = prompt("인증코드를 입력하세요:");
        if (userCode === verificationCode) {
          alert("인증성공!");
          setEmailVerified(true);
        } else {
          alert("틀린 인증번호 입니다");
        }
      }
    } catch (error) {
      console.error("인증번호 발송에 실패했습니다:", error);
    }
  };

  return (
    <Container>
      <Navigation>
        <Header>
          <button className="back_btn" onClick={() => navigate(-1)}>
            {"<"}
          </button>
          <button className="complete_btn" onClick={handleSubmit}>
            확인
          </button>
        </Header>
      </Navigation>
      <InfoContainer>
        <TitleBar>
          <Title>내 정보</Title>
        </TitleBar>
        <Info>
          <NameBar>
            <Name>이름</Name>
            <NameData value={name} onChange={(e) => setName(e.target.value)}></NameData>
          </NameBar>
          <EmailBar>
            <Email>이메일</Email>
            <EmailData value={email} onChange={(e) => setEmail(e.target.value)}></EmailData>
            <EmailButton onClick={sendVerificationCode}>전송</EmailButton>
          </EmailBar>
          <RegionBar>
            <Region>지역</Region>
            <RegionData name="location" placeholder={userData && userData.profile[0].region} ref={locationRef}
              onChange={searchLocation} />
          </RegionBar>
          {locationList.map((location, i) => (
            <RegionList>
              <li key={i} onClick={() => handleLocationSelect(location)}>
                {location.place_name}
              </li>
            </RegionList>
          ))}
          <TagBar>
            <Tag>관심사</Tag>
            <TagDataBar>
              {tagList.map((tagItem, index) => {
                return (
                  <TagItem key={index}>
                    <Text>{tagItem}</Text>
                    <TagButton onClick={deleteTagItem}>X</TagButton>
                  </TagItem>
                );
              })}
              <TagInput type="text" placeholder="태그를 입력해주세요!" onChange={(e) => setTagItem(e.target.value)}
                value={tagItem} onKeyDown={onKeyDown} />
            </TagDataBar>
          </TagBar>
        </Info>
      </InfoContainer>
    </Container>
  );
};


const Container = styled.div`

`
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

const InfoContainer = styled.div`
margin-top: 110px;
margin-left: 50px;
`;

const TitleBar = styled.div`
display: flex;
align-items: center
`
const Title = styled.div`
font-size : 30px;
font-weight: bold
`

const Info = styled.div`
margin-top : 20px;
margin-left : 10px;
`
const NameBar = styled.div`
display : flex;
`
const Name = styled.div`
font-weight: bold
`
const NameData = styled.input`
margin-left: 50px;
`


const EmailBar = styled.div`
display : flex;
margin-top : 15px;
`
const Email = styled.div`
font-weight: bold
`
const EmailData = styled.input`
margin-left: 36px;
`
const EmailButton = styled.button`

`


const RegionBar = styled.div`
display : flex;
margin-top : 15px;

`
const Region = styled.div`
font-weight: bold
`
const RegionData = styled.input`
margin-left: 50px;

`
const RegionList = styled.div`
  display : flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 75px;
`

const TagBar = styled.div`
  display : flex;
  margin-top : 15px;
`
const Tag = styled.div`
  font-weight: bold
`
const TagDataBar = styled.div`
  margin-left: 35px;
  display: flex;
  flex-wrap: wrap; // 태그가 많아지면 줄바꿈이 일어나게 함
  max-width: 600px; // 이 값을 조정하여 최대 너비를 설정
  overflow: auto; // 너비를 초과할 경우 스크롤이 생기도록 함
`

const TagItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px;
  padding: 5px;
  background-color: #f97800;
  border-radius: 5px;
  color: white;
  font-size: 13px;
`;

const Text = styled.span``;

const TagButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-left: 5px;
  background-color: white;
  border-radius: 50%;
  color: #f97800;
`;

const TagInput = styled.input`
  display: flex;
  min-width: 200px;
  align-items: center;
  height: 20px;
  border: 1px solid #f97800;
  border-radius: 5px;
  outline: none;
  cursor: text;
  margin: 5px;
  padding: 5px;
  overflow: scroll;
`;

export default ProfileDetail;