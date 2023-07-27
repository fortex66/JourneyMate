import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import Navigationbar from "../components/Navigationbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseURL = "http://localhost:3000/";

const Companion = () => {
  const [data, setData] = useState({ posts: { rows: [] } }); // 초기값 변경
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
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

  const goDetail = (postId) => {
    navigate(`/Companion_Detail/${postId}`);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}companion/?page=${page}`);
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

  if (!data) return null;

  return (
    <div>
      <CompanionBox>
        <h1>Companion</h1>
      </CompanionBox>
      <Content>
        <Companion_List>
          {data && data.posts.rows.map((post, index) => (
            <CompanionItem 
              ref={index === data.posts.rows.length - 1 ? lastPostElementRef : null} 
              key={index} 
              onClick={() => goDetail(data.posts.rows[index].cpostID)}
            >
              <div>
                <Picture>
                  <div>
                    <img src={`${baseURL}${post.post_images[0] ? post.post_images[0].imageURL.replace(/\\/g, '/') : ''}`} />
                  </div>
                </Picture>
                <Title>{post.title}</Title>
              </div>
            </CompanionItem>
          ))}
        </Companion_List>
      </Content>
      <Navigationbar />
    </div>
  );
};
const CompanionBox = styled.div`
  margin-right: 20px;
  margin-left: 20px;
`;

const Content = styled.div`
  margin-right: 20px;
  margin-left: 20px;
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
  width: calc(45% - 20px); /* 두 개의 컴포넌트가 한 행에 들어갈 수 있도록 너비 설정. 간격을 고려하여 -20px 함 */
`;

const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

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

export default Companion;
