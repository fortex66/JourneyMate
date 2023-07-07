import React from "react";
import { useContext } from "react";
import Community_Item from "./Community_Item";
import { CommunityStateContext } from "../App";

const Community_List = () => {
  const community_list = useContext(CommunityStateContext);
  return (
    <div className="Community_List">
      <div>
        {community_list.map((it) => (
          <Community_Item key={it.id} {...it} />
        ))}
      </div>
    </div>
  );
};

Community_List.defaultProps = {
  community_list: [],
};

export default Community_List;
