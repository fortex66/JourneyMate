import React, { useState, useEffect, useContext, useRef } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser,faArrowLeft,faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { SocketContext } from "../App";
import ChattingMessage from "./ChattingMessage";
const baseURL = "http://localhost:3000";

const ChattingRoom = () => {
  const { chatID } = useParams(); // postId 추출
  const socket=useContext(SocketContext);
  const chattingmessages = useContext(ChattingMessage); // 이 코드를 추가합니다.

  const navigate = useNavigate();

  const [roomdata, setRoomdata] = useState("")
  const [messageData, setMessageData] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState(""); // 채팅 입력값 저장
  const [messages, setMessages] = useState([]); // 전송된 채팅 목록 저장

  const endOfMessagesRef = useRef(null);


  console.log(chattingmessages)



  // 채팅방 정보 가져오기
  useEffect(() => {
    const fetchChatRoom = async () => {
      const response = await axios.get(baseURL + `/chat/chatroomdata/${chatID}`);
      setRoomdata(response)
   
    };
    fetchChatRoom();
  }, []);

  // 채팅방 메시지
  useEffect(()=>{
    const fetchMessage=async()=>{
      const message=await axios.get(baseURL+`/chat/${chatID}`);
      setMessageData(message)
      console.log(message)
    };
    fetchMessage();
  },[])

  
  //console.log(`채팅메시지 ${messageData.data.chatMessage.rows[0].content}`)


  const sendMessage = (message) => {
    socket.emit('chat_message', {roomID: chatID, content: message});
  };

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      // Check if the target is the ModalBackground
      closeModal();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // 입력값 설정
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      setMessages([...messages, { text: inputValue, self: true }]); // 메시지 객체를 배열에 추가
      sendMessage(inputValue);
      console.log(inputValue);
      setInputValue(""); // 입력값 초기화
      scrollToBottom(); // 스크롤 이동 
    }
  };

  /* 채팅 엔터키로 입력하는 부분 */
  const onKeyDown = (e) => {
    if (e.target.value.length !== 0 && e.key === "Enter") {
      handleSendMessage();
    }
  };

  /* 스크롤을 밑으로 */
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  
  return (
    <RoomContainer>
      <TopContainer>
        <Header>
          <button className="back_btn" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} size="2x" />
          </button>
          <TitleContainer>
            <Title>{roomdata && roomdata.data.chatRoomData.companion_post.title}</Title>
            <FontAwesomeIcon icon={faUser} size="1x" color="#8F9098"/>
            <Person>{roomdata && roomdata.data.chatRoomData.user_chats.length}</Person>
          </TitleContainer>
          
          <button className="bars_btn" > 
            <FontAwesomeIcon icon={faBars} size="2x" onClick={openModal}/> 
          </button>
          {isModalOpen && (
            <ModalBackground onClick={handleOutsideClick}>
              <ModalBox onClick={(e) => e.stopPropagation()}>
                {roomdata && (
                  <ModalTitle>
                    참여중인 대화자 {roomdata.data.chatRoomData.user_chats.length}
                  </ModalTitle>
                )}
                <div>
                  {roomdata && roomdata.data.chatRoomData.user_chats.map((list, index) => (
                    <People key={index}>
                      <ModalPeople>{list.userID}</ModalPeople>
                    </People>
                    ))}
                </div>
              </ModalBox>
            </ModalBackground>
          )}
        </Header>
        
      </TopContainer>


      <MidContainer>
      {messages.map((message, index) => (
        <ChatContainer key={index} self={message.self}>
          <ChatMessage>{message.text}</ChatMessage>

        </ChatContainer>
      ))}
      <div ref={endOfMessagesRef} />
      </MidContainer>


      <BottomContainer>
        <InputContainer>
          <ChatInput type="text" placeholder="메시지 입력" value={inputValue} onChange={handleInputChange} onKeyDown={onKeyDown} />
          <SendButton onClick={handleSendMessage}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </SendButton>
        </InputContainer>
      </BottomContainer>
    </RoomContainer>
  );
};

const RoomContainer = styled.div`
  
`

const TopContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  height: auto;
  overflow-y: auto;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  width: 640px;
  height: 70px;
  z-index: 100; // Optional: ensure the header is always on top
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dadada;
  background-color: white;

  button.back_btn {
    border: none;
    color: #f97800;
    cursor: pointer;
    background-color: white;

    margin: 20px;
  
  }


  button.bars_btn{
    border: none;
    color: #f97800;
    cursor: pointer;
    background-color: white;

    margin: 20px;

  }


`;

const TitleContainer = styled.div`
  display:flex;
  align-items:center;
  justify-content: center;
`

const Title = styled.h2`
  margin-right:15px;
`
const Person = styled.div`
  margin-left: 5px;
  color: #8F9098;

`


const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center; // 센터 정렬
  align-items: center; // 센터 정렬
  padding: 20px; // 여백 추가
`;

const ModalBox = styled.div`
  width: 400px;
  height: 500px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.div`
 margin: 5px 0px 10px 5px;
`

const People = styled.div`
display:flex;
flex-direction:column;

`

const ModalPeople = styled.div`
margin:5px 0px 10px 5px;
`


const ModalButton = styled.div`
box-sizing: border-box;
appearance: none;
background-color: transparent;
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
`;


const MidContainer = styled.div`
margin-top: 75px; 
margin-bottom: 85px;
`


const ChatMessage = styled.div`
  display: inline-block;
  background-color: #FFE17B;
  border-radius: 10px;
  padding: 10px;
  margin: 5px;
  align-self: flex-end;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.self ? "auto" : "100%")}; 
  align-self: ${(props) => (props.self ? "flex-end" : "flex-start")}; // 변경
`;

const BottomContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 640px;
  height: 80px;
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: white;
  border-top: 1px solid #dadada;
  box-sizing: border-box;
`;

const InputContainer = styled.div`
  display: flex;
  width: 90%;
  background-color: #f1f3f5;
  border-radius: 0.6rem;
  padding: 0.5rem;
`;

const ChatInput = styled.input`
  flex-grow: 1;
  border: none;
  background-color: transparent;
  outline: none;
`;

const SendButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #f97800;
`;




export default ChattingRoom;