import React from 'react';
import styled from "styled-components"
import onlineIcon from '../../icon/onlineIcon.png';
import closeIcon from '../../icon/closeIcon.png';

const InfoBar = ({ room }) => (
  <InfoBarContainer>
    <LeftInnerContainer>
      <OnlineIcon src={onlineIcon} alt="online icon" />
      <h3>{room}</h3>
    </LeftInnerContainer>
    <RightInnerContainer>
      <a href="/Chatting"><img src={closeIcon} alt="close icon" /></a>
    </RightInnerContainer>
  </InfoBarContainer>
);

const InfoBarContainer = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
background: #2979FF;
border-radius: 4px 4px 0 0;
height: 60px;
width: 100%;
`
const LeftInnerContainer = styled.div`
flex: 0.5;
display: flex;
align-items: center;
margin-left: 5%;
color: white;
`
const RightInnerContainer = styled.div`
display: flex;
flex: 0.5;
justify-content: flex-end;
margin-right: 5%;
`

const OnlineIcon = styled.img`
margin-right: 5%;
`


export default InfoBar;