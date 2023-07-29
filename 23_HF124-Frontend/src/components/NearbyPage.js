import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const baseURL = "http://localhost:3000/";

const Nearby = ({ marker }) => {
  const [data, setData] = useState({ posts: { rows: [] } });
  const radius = 8000;  // 원래 5로 설정 하면 5km 반경의 게시글만 불러와야되는데 안되서 그냥 8000넣어둠
  const navigate = useNavigate();
  const goDetail = (postId) => {
    navigate(`/Community_Detail/${postId}`);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${baseURL}community/nearby`, {
          params: {
            x: marker.x,
            y: marker.y,
            radius: radius
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
  }, [marker]);

  return (
    <div>
      <CommunityList>
        {data && data.posts.rows.map((post, index) => (
          <CommunityItem
            key={index}
            onClick={() => goDetail(post.tpostID)}
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

