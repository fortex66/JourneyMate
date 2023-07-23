import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chatting_Modal from "../components/Chatting/Chatting_Modal";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import Navigationbar from "../components/Navigationbar";
import io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";


const ENDPOINT = "http://localhost:3000";
let socket;

function Chatting() {
  // React의 useState 훅을 이용해 state를 초기화합니다.
  const [name, setName] = useState(""); // 사용자의 이름을 저장하는 상태
  const [rooms, setRooms] = useState([]); // 채팅방 목록을 저장하는 상태
  const [add, setAdd] = useState(false); // 채팅방 만들기 모달창 띄우기
  const [newRoom, setNewRoom] = useState("");
  const navigate = useNavigate(); // React Router의 useNavigate 훅을 사용합니다.

  // React의 useEffect 훅을 이용해 컴포넌트가 렌더링되면 실행되는 코드를 작성합니다.
  useEffect(() => {
    // 서버로의 소켓 연결을 초기화합니다.
    socket = io(ENDPOINT);

    // 서버에서 "roomList" 이벤트를 받으면 해당 이벤트에 연결된 데이터(rooms)를 setRooms를 통해 상태를 업데이트합니다.
    socket.on("roomList", (rooms) => {
      setRooms(rooms.map(room => room.name));
    });

    // 서버에 "getRooms" 이벤트를 보내, 서버에 저장된 방 목록을 받아옵니다.
    socket.emit("getRooms");

    // 서버에서 "roomCreated" 이벤트를 받으면 이에 연결된 데이터(room)를 기존의 방 목록에 추가합니다.
    socket.on("roomCreated", (room) => {
      setRooms((prevRooms) => [room.name, ...prevRooms]);
    });

    // 컴포넌트가 unmount 될 때 소켓 연결을 끊습니다.
    return () => {
      socket.disconnect();
    };
  }, [ENDPOINT]); // ENDPOINT가 변경될 때만 이 useEffect 내부의 코드를 다시 실행합니다.

  // 사용자가 채팅방을 클릭하면 해당 방의 이름을 사용자의 이름으로 설정하는 함수입니다.
  const handleRoomClick = (room) => {
    setName(room);
  };

    // 새 채팅방을 생성하는 함수입니다.
    const createRoom = () => {
      if (newRoom) {
        // newRoom이 빈 문자열이 아닌 경우에만 실행
        socket.emit("createRoom", newRoom); // 서버에 "createRoom" 이벤트를 보내고, 데이터로 새 방의 이름을 전달
        setNewRoom(""); // newRoom 상태를 초기화
      }
    };


  return (
    <Join>
      {/* <GlobalStyle /> */}
      <Main>
        <HeaderContainer>
          <JoinInnerContainer>
            <Heading>채팅</Heading>
            <FontAwesomeIcon icon={faCommentMedical} size="2x" color={"#f97800"} onClick={() => setAdd(!add)} />
            {add && <Chatting_Modal newRoom={newRoom} setNewRoom={setNewRoom} closeModal={() => setAdd(false)} createRoom={createRoom}></Chatting_Modal>}

          </JoinInnerContainer>
        </HeaderContainer>

        <Content>
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
        </Content>
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
