import React from "react";
import { useContext } from "react";
import Community_Item from "./Community_Item";
import { CommunityStateContext } from "../App";
import styled from "styled-components";

const Community_List = () => {
  const community_list = useContext(CommunityStateContext);
  return (
    <div className="Community_List">
      <List>
        {community_list.map((it) => (
          <Community_Item key={it.id} {...it} />
        ))}
      </List>
    </div>
  );
};

Community_List.defaultProps = {
  community_list: [],
};

const List = styled.div`
  display: flex; /* Flexbox 사용 */
  flex-wrap: wrap; /* 창 크기에 따라 자동으로 다음 행으로 넘어가게 설정 */
  justify-content: space-between; /* 각 아이템 사이에 공간 배분 */
`;

export default Community_List;
