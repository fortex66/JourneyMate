import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const baseURL = "http://localhost:3000/";

const Nearby = ({ marker }) => {
  const [data, setData] = useState({ posts: { rows: [] } });
  const [page, setPage] = useState(1);  // 페이지 상태 추가
  const radius = 10; // 10으로 설정하면 10km반경으로 조회, 그리고 지도에 표시되지 않는 일주일 이상된 게시글도 목록에 나옴
  const navigate = useNavigate();
  
  const observer = useRef();

  const goDetail = (postId) => {
    navigate(`/Community_Detail/${postId}`);
  };

  const lastPostElementRef = useCallback(node => { // 마지막 요소에 대한 참조 생성
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${baseURL}community/nearby`, {
          params: {
            x: marker.x,
            y: marker.y,
            radius: radius,
            page: page  // 페이지 번호를 요청에 추가
          }
        });
        console.log(response.data);
        setData((prevData) => ({
          ...prevData,
          posts: {
            ...prevData.posts,
            rows: [...prevData.posts.rows, ...response.data.posts.rows],
          },
        }));
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    fetchPosts();
  }, [marker, page]);  // 페이지 번호가 변경될 때마다 요청 실행

  return (
    <div>
      <CommunityList>
        {data && data.posts.rows.map((post, index) => (
          <CommunityItem
            key={index}
            onClick={() => goDetail(post.tpostID)}
            ref={index === data.posts.rows.length - 1 ? lastPostElementRef : null} // 마지막 요소에 대한 참조 붙이기
          >
            <div>
              <Picture>
                <div>
                  <img
                    src={`${baseURL}${post.post_images[0]
                        ? post.post_images[0].imageURL.replace(/\\/g, "/")
                        : ""
                      }`}
                  />
                </div>
              </Picture>
            </div>
          </CommunityItem>
        ))}
      </CommunityList>
    </div>
  );
};

export default Nearby;
const CommunityList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-height: 500px;  // 모달의 높이에 따라 조정
  overflow-y: auto;   // 스크롤 가능하게 설정
`;
const CommunityItem = styled.div`
  cursor: pointer;

`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  align-items: center;
`;

const Titlebar = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`;

const Heart = styled.div`
font-size: 15px;
display: flex;
justify-content: flex-end; // 아이콘을 우측으로 정렬
gap: 3px; // 아이콘 사이의 간격 조정

`;
const Comment = styled.div`
font-size : 15px;
`;


const Picture = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
`;

