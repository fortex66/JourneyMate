import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import Navigationbar from "../components/Navigationbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus,} from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";

const Community = () => {

  const [data, setData] = useState({ posts: { rows: [] } }); // 초기값 변경
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [write, setWrite] = useState(false);
  const observer = useRef();
  
  const lastPostElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);
  
  const handleSearchClick = () => {
    navigate("/Search");
  };
  
  const goDetail = (postId) => {
    navigate(`/Community_Detail/${postId}`);
  };

  const baseURL = "http://localhost:3000/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}community/?page=${page}`);
        setData(prevData => ({
          ...response.data,
          posts: {
            ...response.data.posts,
            rows: [...prevData.posts.rows, ...response.data.posts.rows]
          }
        }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [page]);

  // 아래 렌더링 부분에서 data가 아직 로딩되지 않았다면 null 반환
  if (!data) return null;

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
            <CommunityItem 
              ref={index === data.posts.rows.length - 1 ? lastPostElementRef : null} 
              key={index} 
              onClick={() => goDetail(post.tpostID)}
            >
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const CommunityItem = styled.div`
  cursor: pointer;
  break-inside: avoid-column;
  background-color: rgb(240, 240, 240);
  margin-bottom: 20px;
  padding: 20px;
  width: calc(45% - 20px);
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
`;

const Picture = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  img {
    width: 250px;
    height: 250px;
    object-fit: cover;
  }
`;

export default Community;
