import React from 'react';
import styled from "styled-components"



const Input = ({ setMessage, sendMessage, message }) => (
  <Form onSubmit={e => e.preventDefault()}>
    <InputMessage
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyDown={event => event.key === 'Enter' ? sendMessage(event) : null}
    />
    <SendButton onClick={e => sendMessage(e)}>Send</SendButton>
  </Form>
)

const Form = styled.form`
display: flex;
border-top: 2px solid #D3D3D3;
`

const InputMessage = styled.input`
border: none;
border-radius: 0;
padding: 5%;
width: 80%;
font-size: 1.2em;

&:focus {
  outline: none;
}
`

const SendButton = styled.button`
color: #fff !important;
text-transform: uppercase;
text-decoration: none;
background: #2979FF;
padding: 20px;
display: inline-block;
border: none;
`



export default Input;
