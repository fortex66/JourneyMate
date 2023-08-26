import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function Pmodal(props) {
  function closeModal() {
    props.closeModal();
  }

  const navigate = useNavigate();

  return (
    <Frame onClick={closeModal}>
      <Body onClick={(e) => e.stopPropagation()}>
        <CummunityBtn onClick={() => navigate("/Community")}>
          커뮤니티 게시글
        </CummunityBtn>
        <CompanionBtn onClick={() => navigate("/Companion")}>
          동행인 게시글
        </CompanionBtn>
        <CloseBtn onClick={closeModal}>✖</CloseBtn>
        {props.children}
      </Body>
    </Frame>
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
  padding-top: 290px; // This will move the content 50 pixels down from the top
`;

const Body = styled.div`
  display: flex; // 플렉스박스로 설정
  flex-direction: column; // 세로 방향으로 배치
  align-items: center; // 가로 방향으로 중앙 정렬
  justify-content: center; // 세로 방향으로 중앙 정렬
  width: 600px;
  padding: 5px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 9999;
`;

const CummunityBtn = styled.button`box-sizing: border-box;
width:97%;
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
margin-bottom: 10px;
margin-top:5px;


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
button.back_btn {
padding: 0.6em 1em;
}
`;

const CompanionBtn = styled.button`box-sizing: border-box;
width:97%;
margin: 10px auto; // 버튼을 중앙에 위치시키기 위한 마진 설정
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
padding: 0.6em 2em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-bottom: 10px;


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
button.back_btn {
padding: 0.6em 1em;
}
`;

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

export default Pmodal;
