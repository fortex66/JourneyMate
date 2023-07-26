import Navigationbar from "../components/Navigationbar";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import SearchModal from "../components/SearchModal";
import React, { useState } from "react";

const Search = () => {
  const [write, setWrite] = useState(false);

  const handleModalOpen = () => {
    setWrite(true);
  };

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
      <Navigationbar />
    </div>
  );
};

export default Search;

const IconContainer = styled.div``;

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