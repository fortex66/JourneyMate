import React from 'react';
import ReactEmoji from 'react-emoji';
import styled from 'styled-components';

const Message = ({ message, name }) => {
  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();

  if(message?.user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <MessageContainer $justifyEnd>
          <SentText $pr10>{trimmedName}</SentText>
          <MessageBox $backgroundBlue>
            <MessageText $colorWhite>{ReactEmoji.emojify(message?.text)}</MessageText>
          </MessageBox>
        </MessageContainer>
        )
        : (
          <MessageContainer $justifyStart>
            <MessageBox $backgroundLight>
              <MessageText $colorDark>{ReactEmoji.emojify(message?.text)}</MessageText>
            </MessageBox>
            <SentText $pl10>{message?.user}</SentText>
          </MessageContainer>
        )
  );
}

const MessageBox = styled.div`
  background: ${props => props.$backgroundBlue ? '#2979FF' : '#F3F3F3'};
  border-radius: 20px;
  padding: 5px 20px;
  color: white;
  display: inline-block;
  max-width: 80%;
`;

const MessageText = styled.p`
  width: 100%;
  letter-spacing: 0;
  float: left;
  font-size: 1.1em;
  word-wrap: break-word;
  color: ${props => props.$colorWhite ? 'white' : '#353535'};
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${props => props.$justifyEnd ? 'flex-end' : 'flex-start'};
  padding: 0 5%;
  margin-top: 3px;
`;

const SentText = styled.p`
  display: flex;
  align-items: center;
  font-family: Helvetica;
  color: #828282;
  letter-spacing: 0.3px;
  padding-left: ${props => props.$pl10 ? '10px' : '0'};
  padding-right: ${props => props.$pr10 ? '10px' : '0'};
`;

export default Message;
