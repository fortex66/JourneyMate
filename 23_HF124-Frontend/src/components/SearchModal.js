import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function SearchModal(props) {
  function closeModal() {
    props.closeModal();
  }

  const navigate = useNavigate();
  return (
    <div>
      <Frame onClick={closeModal}>
        <Body onClick={(e) => e.stopPropagation()}>
          <CummunityBtn onClick={() => navigate("/Community_Search")}>
            커뮤니티 게시글 찾기
          </CummunityBtn>
          <CompanionBtn onClick={() => navigate("/Companion_Search")}>
            동행인 게시글 찾기
          </CompanionBtn>
          <CloseBtn onClick={closeModal}>✖</CloseBtn>
          {props.children}
        </Body>
      </Frame>
    </div>
  );
}

const Frame = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Body = styled.div`
  position: absolute;
  width: 300px;
  height: 500px;
  padding: 40px;
  text-align: center;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
`;

const CummunityBtn = styled.button``;

const CompanionBtn = styled.button``;

const CloseBtn = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  color: rgba(0, 0, 0, 0.7);
  background-color: transparent;
  font-size: 20px;

  &:hover{  
    cursor: pointer;

`;

export default SearchModal;