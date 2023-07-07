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
            <img src={photos[0]} alt="post" />
          </div>
        </Picture>
        <Title>
          <div>{title}</div>
        </Title>

        {/* <div className="photo">{photo}</div> */}
      </div>
    </CommunityItem>
  );
};

export default Community_Item;

const CommunityItem = styled.div`
  display: flex;
  background-color: rgb(240, 240, 240);
  margin-bottom: 10px;
  padding: 20px;
`;
const Title = styled.div`
  font-weight: bold;
`;
const Picture = styled.div`
  padding-bottom: 10px;
  margin-bottm: 10px;
`;
