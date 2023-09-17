import React, { useState, useEffect } from "react";
import Navigationbar from "../components/Navigationbar";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScroll } from "@fortawesome/free-solid-svg-icons";
const baseURL = "http://localhost:3000/";
const imgURL = "https://journeymate.s3.ap-northeast-2.amazonaws.com/";
const Scrap = () => {
  const [scrapedPosts, setScrapedPosts] = useState([]); // "수정!!Koo"
  const navigate = useNavigate();

  const goDetail = (postId) => {
    navigate(`/Community_Detail/${postId}`);
  };

  useEffect(() => {
    const fetchScrapedPosts = async () => {
      try {
        const response = await axios.get(`${baseURL}mypage/scrap`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        setScrapedPosts(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchScrapedPosts();
  }, []);

  console.log(scrapedPosts);
  return (
    <div>
      <Top>
        {" "}
        <StyledButton onClick={() => navigate(-1)}>{"<"}</StyledButton>
      </Top>
      <Icon>
        <FontAwesomeIcon icon={faScroll} size="2x" color={"#f97800"} />
      </Icon>

      <br />
      <CommunityList>
        {scrapedPosts.map((post, index) => (
          <CommunityItem key={index} onClick={() => goDetail(post.tpostID)}>
            <div>
              <Content>
                {" "}
                <Picture>
                  <img
                    src={`${imgURL}${
                      post.post_images[0]
                        ? post.post_images[0].imageURL.replace(/\\/g, "/")
                        : ""
                    }`}
                  />
                </Picture>
              </Content>
            </div>
          </CommunityItem>
        ))}
      </CommunityList>
      <Navigationbar />
    </div>
  );
};

const Content = styled.div``;
const CommunityList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const CommunityItem = styled.div``;

const Picture = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 213.333px;
    height: 213.333px;
    object-fit: cover;
  }
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -35px;
`;

const Line = styled.div`
  border-bottom: 1px solid #f97800;
  margin-top: 26px;
`;
const StyledButton = styled.button`
box-sizing: border-box;
appearance: none;
background-color: transparent;
border: 2px solid #f97800;
border-radius: 0.6em;
color: #f97800;
cursor: pointer;
align-self: center;
font-size: 16px;
font-family: "Nanum Gothic", sans-serif;
line-height: 1;
padding: 0.6em 1.5em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;

margin-top:22px;

&:hover,
&:focus {
  color: #fff;
  outline: 0;
}
transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
&:hover {
  box-shadow: 0 0 40px 40px #f97800 inset;
}

&:focus:not(:hover) {
  color: #f97800;
  box-shadow: none;
}
}

`;
const Top = styled.div`
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  justify-content: space-between;
  button {
    margin-right: 5px;
  }
`;
export default Scrap;
