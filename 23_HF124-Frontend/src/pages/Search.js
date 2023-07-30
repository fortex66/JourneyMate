import Navigationbar from "../components/Navigationbar";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import SearchModal from "../components/SearchModal";
import React, { useState, useEffect } from "react";
import axios from 'axios'; // Assuming you are using axios for HTTP requests

const baseURL = "http://localhost:3000/";

const Search = () => {
  const [write, setWrite] = useState(false);
  const [topSearches, setTopSearches] = useState([]);

  const handleModalOpen = () => {
    setWrite(true);
  };

  useEffect(() => {
    getTopSearches();
  }, []);

  useEffect(() => {
    console.log("useEffect에서 출력된 데이터 정보 :",topSearches);
  }, [topSearches]);

  const getTopSearches = async () => {
    try {
      const response = await axios.get(`${baseURL}community/topkeyword`);
      console.log("getTopSearches에서 출력된 데이터 정보 :",response.data);
      if (Array.isArray(response.data)) {
        setTopSearches(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }
  

  return (
    <div>
      <Header>
        <IconContainer onClick={() => setWrite(!write)}>
          {write && (
            <SearchModal closeModal={() => setWrite(!write)}></SearchModal>
          )}
          <SearchIcon icon={faMagnifyingGlass} size="2x" color={"#f97800"} />
        </IconContainer>
        <SearchInput
          type="text"
          onClick={handleModalOpen}
          placeholder="검색어를 입력하세요"
        />
      </Header>
      <TopSearches>
        {topSearches && topSearches.map((search, index) => (
          <SearchItem key={index}>
            <span>{index+1}. {search.location}</span> 
            <span>{search.count} 검색</span>
          </SearchItem>
        ))}
      </TopSearches>
      <Navigationbar />

    </div>
  );
};



export default Search;


const IconContainer = styled.div``;
const SearchItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 1rem;
  color: #333;

  span:first-child {
    font-weight: bold;
  }
`;
const Header = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  margin-top: 20px;
  height: 70px;
  padding: 0px 16px;
  margin-left: 20px;
  margin-right: 20px;
  border-radius: 8px;
  background-color: rgb(242, 244, 245);
  transition: width 0.25s ease 0s;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 15px;
  border: none;
  padding: 0 10px;
  &:focus {
    outline: none;
  }
  cursor: pointer;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

const TopSearches = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f2f2f2;
  
  p {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    margin: 10px 0;
    font-size: 1rem;
    color: #333;
  }
`;