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
  align-items: flex-end;
  padding-bottom: 100px;
  z-index: 5001;
`;

const Body = styled.div`
  width: 600px;
  height: 150px; /* 높이를 원하는 대로 조정하세요 */
  padding: 10px;
  background-color: white;
  border-radius: 20px 20px 0 0; /* 상단에 둥근 모서리를 만들기 위해 반지름을 설정 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 5002;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  animation: slide-up 0.3s ease-out; /* 애니메이션을 적용 */
  
  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const CummunityBtn = styled.button`
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
margin-bottom: 15px;
margin-top:5px;


width:500px;

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

const CompanionBtn = styled.button`
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
padding: 0.6em 2em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-bottom: 10px;

width:500px;

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
  z-index: 5003;
  &:hover{  
    cursor: pointer;

`;


export default SearchModal;
