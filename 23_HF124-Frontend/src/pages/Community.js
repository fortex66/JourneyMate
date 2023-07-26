import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navigationbar from "../components/Navigationbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus,} from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";


const Community = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [write, setWrite] = useState(false);

  const handleSearchClick = () => {
    navigate("/Search");
  };
  /* 상세페이지 이동 */
  const goDetail = (postId) => { // postId 인자 추가
    
    navigate(`/Community_Detail/${postId}`); // postId를 경로의 일부로 사용
  };

  const baseURL = "http://localhost:3000/";

  const fetchData = async () => {
    try {
      const response = await axios.get(baseURL + "community/");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 fetchData를 실행하라는 의미

  return (
  
    <Container>
      
      <Header>
        <SearchInput
          type="text"
          onClick={handleSearchClick}
          placeholder="검색"
        />
        <IconContainer onClick={() => setWrite(!write)}>
          {write && <Modal closeModal={() => setWrite(!write)}></Modal>}
          <FontAwesomeIcon icon={faSquarePlus} size="3x" color={"#f97800"} />
        </IconContainer>
      </Header>
      <Content>
        <CommunityList>
          {data && data.posts.rows.map((post, index) => (
            <CommunityItem key={index} onClick={() => goDetail(data.posts.rows[index].tpostID)}> {/* postId를 goDetail에 전달 */}
              <div>
                <Picture>
                  <div>
                    <img src={`${baseURL}${post.post_images[0].imageURL.replace(/\\/g, '/')}`}  />
                  </div>
                </Picture>
                <Title>
                  {post.title}
                  <Titlebar>
                    {post.userID}
                    <Heart>
                      <FontAwesomeIcon icon={faHeartSolid} color="red" />
                    {post.likeCount}
                    </Heart>
                  </Titlebar>
                </Title>
              </div>
            </CommunityItem>
          ))}
        </CommunityList>
      </Content>
      <Navigationbar />
    </Container>
    
  );
};


const Container = styled.div`
  position: relative;
  width: 100%;
`;

const Header = styled.div`
  display:flex;
  justify-content: space-evenly;
  align-items: center;
  width: 640px;
  position: fixed;
  top: 0;
  height: 90px;
  background-color: rgb(240, 240, 240);
  border-bottom:1px solid;
`;

const SearchInput = styled.input`
  width: 70%;
  height: 40px;
  border-radius: 15px;
  border: none;
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
`;

const Content = styled.div`
  margin-right: 20px;
  margin-left: 20px;
  margin-top: 110px;
`;

const CommunityList = styled.div`
  display: flex; /* Flexbox 사용 */
  flex-wrap: wrap; /* 창 크기에 따라 자동으로 다음 행으로 넘어가게 설정 */
  justify-content: space-between; /* 각 아이템 사이에 공간 배분 */
`;

const CommunityItem = styled.div`
  cursor: pointer;
  break-inside: avoid-column;
  background-color: rgb(240, 240, 240);
  margin-bottom: 20px;
  padding: 20px;
  width: calc(45% - 20px); /* 두 개의 컴포넌트가 한 행에 들어갈 수 있도록 너비 설정. 간격을 고려하여 -20px 함 */
`;

const Title = styled.div`
  font-size : 20px;
  font-weight : bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  align-items: center;
`;

const Titlebar = styled.div`
display : flex;
justify-content : space-between;
font-size:12px;
`;

const Heart = styled.div`
font-size : 15px;
`
const Picture = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  img {  // img 태그에 대한 스타일을 정의
    width: 250px;  // 너비를 250px로 설정
    height: 250px;  // 높이를 250px로 설정
    object-fit: cover;  // 이미지의 비율을 유지하면서, 요소에 꽉 차게 표시
  }
`;

export default Community;
