import React, { useEffect, useState } from "react";
import Navigationbar from "../components/Navigationbar";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Companion = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  /* 상세페이지 이동 */
  const goDetail = (postId) => { // postId 인자 추가

    navigate(`/Companion_Detail/${postId}`); // postId를 경로의 일부로 사용
  };

  const baseURL = "http://localhost:3000/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseURL + "companion/");
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 fetchData를 실행하라는 의미

  return (
    <div>
      <CompanionBox>
        <h1>Companion</h1>
      </CompanionBox>
      <Content>
        <Companion_List>
          {data && data.posts.rows.map((post, index) => (
            <CompanionItem key={index} onClick={() => goDetail(data.posts.rows[index].cpostID)}> {/* postId를 goDetail에 전달 */}
              <div>
                <Picture>
                  <div>
                    <img src={post.post_images && post.post_images[0] ? `${baseURL}${post.post_images[0].imageURL.replace(/\\/g, '/')}` : "default_image_url"} />
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
