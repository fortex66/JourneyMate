import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Community_Item = ({ id, title, photos }) => {
  const navigate = useNavigate();

  /* 상세페이지 이동 */
  const goDetail = () => {
    navigate(`/Community_Detail/${id}`);
  };

  return (
    <CommunityItem onClick={goDetail}>
      <div>
        <Picture>
          <div>
            <img src={photos[0]} width="250" height="250" alt="post" />
          </div>
        </Picture>
        <Title>
          <div>{title}</div>
        </Title>
      </div>
    </CommunityItem>
  );
};

export default Community_Item;

const CommunityItem = styled.div`
  cursor: pointer;
  break-inside: avoid-column;
  background-color: rgb(240, 240, 240);
  margin-bottom: 20px;
  padding: 20px;
  width: calc(
    45% - 20px
  ); /* 두 개의 컴포넌트가 한 행에 들어갈 수 있도록 너비 설정. 간격을 고려하여 -20px 함 */
`;
const Title = styled.div`
  display: block;
  width: 100%;
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
`;
