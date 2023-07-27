import React, { useEffect, useState  } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser} from "@fortawesome/free-solid-svg-icons";
import ProfileDetail from "./ProfileDetail";



const Profile = () => {

  const navigate = useNavigate();

  return (
    <div>
      <h1>Profile</h1>
        <div>
          <FontAwesomeIcon icon={faUser} size="2x" color={"#f97800"} />
        </div>
        <div>내 정보</div>
        <div onClick={()=>{navigate("/ProfileDetail")}}>편집</div>
        <div></div>
        
    </div>
  );
};

export default Profile;