import React, { useState, useEffect, useContext } from "react"; // useContext 추가
import { useNavigate } from "react-router-dom";
import Chatting_Modal from "../components/Chatting/Chatting_Modal";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import Navigationbar from "../components/Navigationbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "../App"; // SocketContext 추가
import axios from "axios";
const baseURL = "http://localhost:3000";

function Chatting() {
  const [name, setName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [add, setAdd] = useState(false);
  const [newRoom, setNewRoom] = useState("");
  const navigate = useNavigate();

  // SocketContext를 통해 App.js에서 생성된 소켓 가져오기
  // const socket = useContext(SocketContext);
  useEffect(() => {
    const fetchChatRoom = async () => {
      const response = await axios.get(baseURL + "/chat");
      console.log(response);
    };

    fetchChatRoom();
  }, []);

  // useEffect(() => {
  //   socket.on("roomList", (rooms) => {
  //     setRooms(rooms.map(room => room.name));
  //   });

  //   socket.emit("getRooms");

  //   socket.emit("good");

  //   socket.on("roomCreated", (room) => {
  //     setRooms((prevRooms) => [room.name, ...prevRooms]);
  //   });

  // }, []); // socket이 변경될 때마다 useEffect 내부의 코드를 다시 실행

  // const handleRoomClick = (room) => {
  //   setName(room);
  // };

  // const createRoom = () => {
  //   if (newRoom) {
  //     socket.emit("createRoom", newRoom);
  //     setNewRoom("");
  //   }
  // };

  // socket.emit("good");
  return (
    <Join>
      {/* <GlobalStyle /> */}
      <Main>
        <HeaderContainer>
          <JoinInnerContainer>
            <Heading>채팅</Heading>
            <FontAwesomeIcon
              icon={faCommentMedical}
              size="2x"
              color={"#f97800"}
              onClick={() => setAdd(!add)}
            />
            {/* {add && <Chatting_Modal newRoom={newRoom} setNewRoom={setNewRoom} closeModal={() => setAdd(false)} createRoom={createRoom}></Chatting_Modal>} */}
          </JoinInnerContainer>
        </HeaderContainer>

        {/* <Content>
          {rooms.map((room, index) => (
            <ChatRoom
              key={index}
              onClick={() => {
                handleRoomClick(room);
                navigate(`/chat?name=${name}&room=${room}`);
              }}
            >
              {room}
            </ChatRoom>
          ))}
        </Content> */}
      </Main>
      <Navigationbar />
    </Join>
  );
}

const Main = styled.div`
  display: flex;
  flex-direction: column;
`;
const HeaderContainer = styled.div`
  margin: 20px;
  border-bottom: 1px solid #dddddd;
`;

const Content = styled.div`
  margin: 20px;
`;

const ChatRoom = styled.div`
  margin: 10px 0;
  padding-bottom: 20px;
  border: 1px solid #dddddd; //임시
  cursor: pointer;

  &:hover {
    background-color: rgb(223, 223, 223);
  }
`;

// const GlobalStyle = createGlobalStyle`
//   body {
//     overflow-y: hidden;
//   }
// `;

const Join = styled.div`
  font-family: "Roboto", sans-serif;
`;

const JoinInnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Heading = styled.h2`
  font-size: 20px;
  border-bottom: 2px solid white;
`;

const Button = styled.button`
  color: #fff !important;
  text-transform: uppercase;
  text-decoration: none;
  background: #2979ff;
  padding: 20px;
  border-radius: 5px;
  display: inline-block;
  border: none;
  margin-top: 20px;
  cursor: pointer;

  &:focus {
    outline: 0;
  }
`;

export default Chatting;
