import React from "react";

import Navigationbar from "../components/Navigationbar";
import Community_List from "../components/Community_List";

const Community = () => {
  return (
    <div>
      <h1>Community</h1>

      <Community_List />

      <Navigationbar />
    </div>
  );
};

export default Community;
