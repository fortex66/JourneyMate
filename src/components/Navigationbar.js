import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/listForm.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faUserGroup,
  faHouse,
  faBars,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

const Navigationbar = () => {
  const navigate = useNavigate();
  return (
    <div className="Navigationbar">
      <div className="bottomView">
        <div className="BMenuBar">
          <div
            className="BMenuBox"
            onClick={() => {
              navigate("/Community");
            }}
          >
            <FontAwesomeIcon icon={faGlobe} size="2x" color={"black"} />
          </div>

          <div
            className="BMenuBox"
            onClick={() => {
              navigate("/Companion");
            }}
          >
            <FontAwesomeIcon icon={faUserGroup} size="2x" color={"black"} />
          </div>

          <div
            className="BMenuBox"
            onClick={() => {
              navigate("/Home");
            }}
          >
            <FontAwesomeIcon icon={faHouse} size="2x" color={"black"} />
          </div>

          <div
            className="BMenuBox"
            onClick={() => {
              navigate("/Chat");
            }}
          >
            <FontAwesomeIcon icon={faComments} size="2x" color={"black"} />
          </div>

          <div
            className="BMenuBox"
            onClick={() => {
              navigate("/Mypage");
            }}
          >
            <FontAwesomeIcon icon={faBars} size="2x" color={"black"} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navigationbar;
