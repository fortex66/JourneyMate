import React from "react";
import { Link } from "react-router-dom";

const Navigationbar = () => {
  return (
    <div className="Navigationbar">
      <Link to={"/Community"}>Community</Link>
      <br />
      <Link to={"/Search"}>Search</Link>
      <br />
      <Link to={"/Home"}>HOME</Link>
      <br />
      <Link to={"/Companion"}>Companion</Link>
      <br />
      <Link to={"/Mypage"}>Mypage</Link>
      <br />
    </div>
  );
};
export default Navigationbar;
