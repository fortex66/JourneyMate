import React, { useState, useEffect } from "react";
import Navigationbar from "../components/Navigationbar";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScroll } from "@fortawesome/free-solid-svg-icons";
const baseURL = "http://localhost:3000/";

const Scrap = () => {
  const [scrapedPosts, setScrapedPosts] = useState([]);
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

  return (
    <div>
      <Icon>
        <FontAwesomeIcon icon={faScroll} size="2x" color={"#f97800"} />
      </Icon>

      <Line></Line>
      <br />
      <CommunityList>
        {scrapedPosts.map((post, index) => (
          <CommunityItem key={index} onClick={() => goDetail(post.tpostID)}>
            <div>
              <Picture>
                <img
                  src={`${baseURL}${
                    post.post_images[0]
                      ? post.post_images[0].imageURL.replace(/\\/g, "/")
                      : ""
                  }`}
                />
              </Picture>
            </div>
          </CommunityItem>
        ))}
      </CommunityList>
      <Navigationbar />
    </div>
  );
};

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
  margin-top: 20px;
`;

const Line = styled.div`
  border-bottom: 1px solid #f97800;
`;
export default Scrap;
