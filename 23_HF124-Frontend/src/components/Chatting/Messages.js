import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import styled from 'styled-components';
import Message from './Message';

const Messages = ({ messages, name }) => (
  <MessagesContainer>
    {messages.map((message, i) => <div key={i}><Message message={message} name={name}/></div>)}
  </MessagesContainer>
);

const MessagesContainer = styled(ScrollToBottom)`
  padding: 5% 0;
  overflow: auto;
  flex: auto;
`;

export default Messages;
