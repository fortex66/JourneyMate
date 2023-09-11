import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, faVideo, faFile } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
function FileModal({sendFile}) {
    // 이미지 파일을 선택했을 때의 핸들러
    
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
          sendFile(file, event.target.accept);
        }
      };
    return (
        <Frame>
          <Body>
            <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileSelect}
                id="image-input"
            />
            <input
                type="file"
                accept="video/*"
                style={{ display: "none" }}
                onChange={handleFileSelect}
                id="video-input"
            />
            <input
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={handleFileSelect}
                id="document-input"
            />
      
            <IconContainer>
              <Icon 
                icon={faImages} 
                onClick={() => document.getElementById("image-input").click()} 
              />
              <Icon 
                icon={faVideo} 
                onClick={() => document.getElementById("video-input").click()} 
              />
              <Icon 
                icon={faFile} 
                onClick={() => document.getElementById("document-input").click()} 
              />
            </IconContainer>
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
  z-index: 1000;
  align-items: flex-start; // 위쪽 정렬
  padding-top: 200px; // This will move the content 50 pixels down from the top
`;

const Body = styled.div`
  width: 200px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;
const IconContainer = styled.div`
display: flex;
justify-content: space-around;
padding: 10px 0;
`;

const Icon = styled(FontAwesomeIcon)`
font-size: 2em;
cursor: pointer;
`;
  export default FileModal;
  