import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function Chatting_Modal({ closeModal, createRoom, newRoom, setNewRoom }) {

  const handleCreateRoom = () => {
    createRoom();
    setNewRoom("");
    closeModal();
  };

  return (
    <div>
      <Frame onClick={closeModal}>
        <Body onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            placeholder="방 이름을 입력해주세요"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
          />
          <button onClick={handleCreateRoom}>방 만들기</button>
          <CloseBtn onClick={closeModal}>✖</CloseBtn>
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

export default Chatting_Modal;
