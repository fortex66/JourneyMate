import React from "react";
import styled from "styled-components";
import Navigationbar from "../components/Navigationbar";
import Community_List from "../components/Community_List";

const Community = () => {
  return (
    <div>
      <CommunityBox>
        <h1>Community</h1>
      </CommunityBox>
      <Content>
        <Community_List />
      </Content>
      <Navigationbar />
    </div>
  );
};

const CommunityBox = styled.div`
  margin-right: 20px;
  margin-left: 20px;
`;

const Content = styled.div`
  margin-right: 20px;
  margin-left: 20px;
`;
export default Community;
