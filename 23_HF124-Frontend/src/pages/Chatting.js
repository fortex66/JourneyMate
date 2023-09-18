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
const imgURL = "https://journeymate.s3.ap-northeast-2.amazonaws.com/";

function Chatting() {
  const [name, setName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [add, setAdd] = useState(false);
  const [newRoom, setNewRoom] = useState("");
  const [chattingdata, setChattingData] = useState("");
  const {socket, socketID}=useContext(SocketContext);// 채팅방 목록에서 소켓사용
  const navigate = useNavigate();

  // SocketContext를 통해 App.js에서 생성된 소켓 가져오기
  // const socket = useContext(SocketContext);
  useEffect(() => {
    const fetchChatRoom = async () => {
      const response = await axios.get(baseURL + "/chat");
      setChattingData(response.data);
    };
    fetchChatRoom();
  }, []);

  console.log(chattingdata);

  const goChattingRoom = (chatID) => {
    navigate(`/ChattingRoom/${chatID}`);
  };

  return (
    <Join>
      {/* <GlobalStyle /> */}
      <Main>
        <HeaderContainer>
          <JoinInnerContainer>
            <Heading>채팅방 목록</Heading>

            {/* {add && <Chatting_Modal newRoom={newRoom} setNewRoom={setNewRoom} closeModal={() => setAdd(false)} createRoom={createRoom}></Chatting_Modal>} */}
          </JoinInnerContainer>
        </HeaderContainer>

        <RoomList>
          {/* 아이템은 반복문으로 처리를해야한다. */}
          {chattingdata &&
            chattingdata.map((list, index) => (
              <RoomItem key={index} onClick={() => goChattingRoom(list.chatID)}>
                
                  <RoomImg>
                    <img src={`${imgURL}${list.group_chatting.companion_posts.post_images[0].imageURL.replace(/\\/g, "/")}`}
                      style={{ width: "100%", borderRadius: "100%" }} />
                  </RoomImg>
                  <RoomInfo>
                    <TitleContainer>
                      <Title>{list.group_chatting.companion_posts.title}</Title>
                      <Person>{list.group_chatting.userCount}</Person>
                    </TitleContainer>
                    <LastChatting>
                      {list.group_chatting.lastchat}
                    </LastChatting>
                </RoomInfo>
                

                
              </RoomItem>
            ))}
        </RoomList>
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
  margin: 20px 20px 0px 20px;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 10px;
`;

const Join = styled.div``;

const JoinInnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Heading = styled.h2`
  font-size: 25px;
  border-bottom: 2px solid white;
`;

const RoomList = styled.div`
  margin-left: 20px;
  margin-right: 20px;
`;

const RoomItem = styled.div`
  display:flex;
  border-bottom: 1px solid #dddddd;
  height: 70px;
  padding: 5px 5px 0px 5px;
  cursor: pointer; // 커서 모양 변경
  transition: background-color 0.3s; // 배경색 변경 애니메이션 효과
  &:hover {
    background-color: rgba(0, 0, 0, 0.05); // 약한 회색 배경색
  }
`;

const RoomInfo = styled.div`

`

const RoomImg = styled.div`
background-color: rgb(254, 237, 229);
width: 50px;
height: 50px;
border-radius: 80%;
display: flex;
align-items: center;

margin-bottom: 10px;
cursor: pointer;
overflow: hidden;
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
`

const TitleContainer = styled.div`
  display: flex;
  margin-left: 20px;
`;

const Title = styled.div`
  margin-right: 15px;
  font-size: 17px;
  font-weight: bold;
`;

const Person = styled.div`
  margin-right: 15px;
  color: #8f9098;
`;

const LastChatting = styled.div`
  margin-left: 20px;
`

export default Chatting;