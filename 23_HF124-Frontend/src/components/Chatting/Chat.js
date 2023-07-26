import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
import styled from "styled-components"
import InfoBar from "./InfoBar";
import Input from "./Input";
import Messages from "./Messages";
import TextContainer from "./TextContainer";

const ENDPOINT = 'http://localhost:3000'

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [users, setUsers] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])


  useEffect(() => {
    // 여기선 name과 room을 url에서 가져온다.
    // 이유는 setRoom과 setName이 적용되기 전에 socket.emit('join')이 실행되기 때문이다.
    // url에서 가져오는 방법이 아닌 다른 방법으로 name과 room을 가져오려면
    // 미리 정해진 방법으로 name과 room을 가져오는 것이 아닌
    // socket.emit('join')이 실행되기 전에 setRoom과 setName이 실행되도록 해야 한다.
    const { name, room } = queryString.parse(window.location.search)

    console.log(name, room)

    socket = io(ENDPOINT)
    //socket.emit('test', { test: 'This is a test message.' });
    setRoom(room)
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error) // 오류 메시지 출력
      }
    })
  }, [])

  useEffect(() => {
    socket.on('message', (message) => {
        console.log("New message from socket:", message); // New message from socket
        setMessages((messages) => {
            console.log("Updated messages state in Chat Component:", [...messages, message.text]); // Updated messages state
            return [...messages, message];
        });
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });
}, []);


  const sendMessage = (event) => {
    event.preventDefault()

    if (message) {
       console.log(message)
      socket.emit('sendMessage', message, () => setMessage(''))
    }
  }

  return (
    <OuterContainer>
      <Container>
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </Container>
      <TextContainer users={users} />
    </OuterContainer>
  )
}

const OuterContainer= styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
background-color: #1A1A1D;
`
const Container = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
background: #FFFFFF;
border-radius: 8px;
height: 60%;
width: 80%;
`
export default Chat