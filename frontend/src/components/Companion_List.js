import React, { useContext } from "react";
import Companion_Item from "./Companion_Item";
import { CompanionStateContext } from "../App";

const Companion_List = () => {
  const companion_List = useContext(CompanionStateContext);
  return (
    <div className="Companion_List">
      <div>
        {companion_List.map((it) => (
          <Companion_Item key={it.id} {...it}></Companion_Item>
        ))}
      </div>
    </div>
  );
};

Companion_List.defaultProps = {
  companion_List: [],
};
export default Companion_List;
