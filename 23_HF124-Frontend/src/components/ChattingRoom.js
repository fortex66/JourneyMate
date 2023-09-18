import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faArrowLeft,
  faPaperPlane,
  faChevronDown,
  faSquarePlus,
  faFile,
  faImages,
  faVideo,
  faFilePdf,
  faFileWord
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { SocketContext } from "../App";
import ChattingMessage from "./ChattingMessage";


const baseURL = "http://localhost:3000/";
const imgURL = "https://journeymate.s3.ap-northeast-2.amazonaws.com/";
const ChattingRoom = () => {
  let lastDate=""
  const MAX_SIZE = 30 * 1024 * 1024; // 30MB

  const { chatID } = useParams(); // postId 추출
  const {socket, socketId} = useContext(SocketContext);
  const chattingmessages = useContext(ChattingMessage); // 이 코드를 추가합니다.
  // const [socketID, setSocketID]=useState(socket);
  const messagesEndRef = useRef(null);
  const observer = useRef();
  const scrollRef = useRef(null);
  const previousScrollHeightRef = useRef(null); // 이전 scrollHeight 값을 저장할 ref

  const navigate = useNavigate();

  const [roomdata, setRoomdata] = useState("");
  const [messageData, setMessageData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState(""); // 채팅 입력값 저장
  // const [messages, setMessages] = useState([]); // 전송된 채팅 목록 저장
  const { messages,setMessages } = useContext(SocketContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [imageData, setImageData] = useState("");
  const [image, setImage]=useState([]);
  const [buttonPosition, setButtonPosition] = useState("20px");
  const [file, setFile] = useState("");
  // const { createFFmpeg } = FFmpeg;

  // const ffmpeg = createFFmpeg({ log: true });

  // async function compressVideo(file) {
  //   await ffmpeg.load();
  //   ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(await file.arrayBuffer()));
  //   await ffmpeg.run('-i', 'input.mp4', '-b:v', '1000k', 'output.mp4');
  //   const data = ffmpeg.FS('readFile', 'output.mp4');
  //   return new Blob([data.buffer], { type: 'video/mp4' });
  // }
  // async function compressFile(file) {
  //   await ffmpeg.load();
  //   ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(await file.arrayBuffer()));
  //   await ffmpeg.run('-i', 'input.mp4', '-b:v', '1000k', 'output.mp4');
  //   const data = ffmpeg.FS('readFile', 'output.mp4');
  //   return new Blob([data.buffer], { type: 'video/mp4' });
  // }
  const lastPostElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    const updateButtonPosition = () => {
      const windowWidth = window.innerWidth;
      const breakpoint = 600;
      if (windowWidth > breakpoint) {
        setButtonPosition(`${(windowWidth - breakpoint) / 2}px`);
      } else {
        setButtonPosition("0px");
      }
    };

    // Set initial position
    updateButtonPosition();

    // Update position on window resize
    window.addEventListener("resize", updateButtonPosition);

    // Clean up
    return () => {
      window.removeEventListener("resize", updateButtonPosition);
    };
  }, []);

  const toggleVisibility = () => {
    if (scrollRef.current) {
      const isNotBottom =
        scrollRef.current.scrollTop + scrollRef.current.clientHeight <
        scrollRef.current.scrollHeight - 5; // 5는 임의의 버퍼값입니다. 정확하게 바닥에 가까운지 여부를 확인하는 데 도움이 됩니다.

      setIsVisible(isNotBottom);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", toggleVisibility);

      // 클린업 함수에서도 null 체크
      return () => {
        if (scrollRef.current) {
          scrollRef.current.removeEventListener("scroll", toggleVisibility);
        }
      };
    }
  }, []);

  useEffect(() => {
    const fetchMoreData = async () => {
      const currentScrollHeight = scrollRef.current.scrollHeight; // 현재 콘텐츠의 전체 높이를 저장

      try {
        const response = await axios.get(
          `${baseURL}chat/${chatID}/?page=${page}`
        );
        
        
        setMessageData((prevMessageData) => ({
          ...prevMessageData,
          data: {
            ...prevMessageData.data,
            chatMessage: {
              ...prevMessageData.chatMessage,
              rows: [
                ...prevMessageData.data.chatMessage.rows,
                ...response.data.chatMessage.rows,
              ],
            },
          },
        }));

        if (previousScrollHeightRef.current !== null) {
          // 새로운 데이터의 높이 = 현재의 전체 높이 - 이전의 전체 높이
          const newContentHeight =
            currentScrollHeight - previousScrollHeightRef.current;
          scrollRef.current.scrollTop += newContentHeight; // 스크롤 위치를 새로운 데이터의 높이만큼 조정
        }

        previousScrollHeightRef.current = currentScrollHeight; // 현재의 scrollHeight 값을 저장
        // console.log(response);
        // if(response.result === false){
        //   alert(response.message);
        //   navigate(-1);
        // }else if(response.result === true){
          
        // }
        
      } catch (error) {
        console.log(error);
      }
    };

    if (page > 1) {
      // 페이지가 1보다 크거나, 검색이 실행되지 않은 경우에 추가 결과를 불러옵니다.
      fetchMoreData();
    }
  }, [page]);

  // useEffect(() => {
  //   if (!socket) {
  //     return;
  //   }

  //   const handleChatMessage = async (data) => {
      
  //     if (data.roomID === Number(chatID)) {
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         {
  //           text: data.message,
  //           self: false,
  //           userID: data.userID,
  //           profileImage: data.profileImage.profileImage,
  //           messageType: data.messageType
  //         },
  //       ]);
  //     }
  //   };

  //   socket.on("chat_message", handleChatMessage);

  //   return () => {
  //     socket.off("chat_message", handleChatMessage);

  //   };
  // }, [socket, chatID]);

  // 채팅방 정보 가져오기
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    setCurrentUser(jwtToken);

    const fetchChatRoom = async () => {
      const response = await axios.get(baseURL + `chat/chatroomdata/${chatID}`);
      setRoomdata(response);
      console.log(response);
    };
    fetchChatRoom();
  }, []);

  // 채팅방 메시지
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(baseURL + `chat/${chatID}`);
        if (response.data.result === false) {
          alert(response.data.message);
          // 적절한 처리를 추가 (예: 이전 페이지로 이동)
          navigate(-1);
          return;
        }
        setMessageData(response);
        setTimeout(() => {
          scrollToBottom();
        }, 400);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // 'messages'는 채팅 메시지 배열이어야 합니다.

  //console.log(`채팅메시지 ${messageData.data.chatMessage.rows[0].content}`)

  const sendMessage = (message) => {
    socket.emit("chat_message", { roomID: chatID, content: message });
  }

  const sendImage = async ()=>{
    const newFileInput = document.createElement("input"); // 새로운 input 요소 생성
    newFileInput.type = "file"; // input 요소의 유형을 'file'로 설정
    newFileInput.accept = "image/*"; // 가능한 파일 형식을 이미지 제한
    newFileInput.click(); // 생성한 input 요소의 'click' 이벤트를 트리거하여 파일 선택 창 열기
    // 파일 input 요소에서 발생하는 'change' 이벤트 리스너 추가
    newFileInput.addEventListener("change", (e) => {
      e.preventDefault();
      const reader = new FileReader();
      const file = e.target.files[0];
      // if (file.size > MAX_SIZE) {
      //   // 파일 크기가 MAX_SIZE를 초과하면 압축을 진행
      //   compressFile(file);
      // }
      console.log(e.target.files);
      reader.readAsDataURL(file);

      // 파일 로딩이 완료되면 데이터 설정 및 이미지 업데이트
      reader.onload = async () => {
        const newData = [...image];
        newData.file = file;
        newData.previewURL = reader.result; // replace image

        const formData = new FormData();
        formData.append("image",file);
        formData.append("socketID", socketId);
        try {
          // 서버로 게시물ID, file, i 보내기
          const result=await axios.post(baseURL + `chat/chattingRoom/${chatID}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data", // multipart/form-data로 보낸다고 명시
            },
            
          });
          closeFileModal()
          console.log(result)
          setMessages([
            ...messages,
            { text: result.data.saveMessage.content, self: true, userID: currentUser, messageType: 1 },
          ]);
        } catch (error) {
          console.log(error);
        }
      };
    });
  }

  const sendVideo=async()=>{
    const newFileInput = document.createElement("input"); // 새로운 input 요소 생성
    newFileInput.type = "file"; // input 요소의 유형을 'file'로 설정
    newFileInput.accept = "video/*"; // 가능한 파일 형식을 이미지 제한
    newFileInput.click(); // 생성한 input 요소의 'click' 이벤트를 트리거하여 파일 선택 창 열기
    // 파일 input 요소에서 발생하는 'change' 이벤트 리스너 추가
    newFileInput.addEventListener("change", (e) => {
      e.preventDefault();
      const reader = new FileReader();
      const file = e.target.files[0];
      console.log(e.target.files);
      reader.readAsDataURL(file);

      // 파일 로딩이 완료되면 데이터 설정 및 이미지 업데이트
      reader.onload = async () => {
        // const newData = [...image];
        // newData.file = file;
        // newData.previewURL = reader.result; // replace image
        // setImageData(newData);
        const formData = new FormData();
        formData.append("video",file);
        formData.append("socketID", socketId);
        try {
          // 서버로 게시물ID, file, i 보내기
          const result=await axios.post(baseURL + `chat/chattingRoom/video/${chatID}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data", // multipart/form-data로 보낸다고 명시
            },
            
          });
          closeFileModal()
          console.log(result)
          setMessages([
            ...messages,
            { text: result.data.saveMessage.content, self: true, userID: currentUser, messageType: 2 },
          ]);
        } catch (error) {
          console.log(error);
        }
      };
    });
  }

  const sendFile = async () =>{
    const newFileInput = document.createElement("input"); // 새로운 input 요소 생성
    newFileInput.type = "file"; // input 요소의 유형을 'file'로 설정
    newFileInput.accept = ".pdf, .doc, .docx, .ppt, .hwp, .hwpx"; // 가능한 파일 형식을 이미지 제한
    newFileInput.click(); // 생성한 input 요소의 'click' 이벤트를 트리거하여 파일 선택 창 열기
    // 파일 input 요소에서 발생하는 'change' 이벤트 리스너 추가
    newFileInput.addEventListener("change", (e) => {
      e.preventDefault();
      const reader = new FileReader();
      const file = e.target.files[0];
      console.log(e.target.files);
      reader.readAsDataURL(file);

      // 파일 로딩이 완료되면 데이터 설정 및 이미지 업데이트
      reader.onload = async () => {
        const newData = [...image];
        newData.file = file;
        newData.previewURL = reader.result; // replace image
        setImageData(newData);
        const formData = new FormData();
        formData.append("files",file);
        formData.append("socketID", socketId);
        try {
          // 서버로 게시물ID, file, i 보내기
          const result=await axios.post(baseURL + `chat/chattingRoom/file/${chatID}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data", // multipart/form-data로 보낸다고 명시
            },
            
          });
          closeFileModal()
          console.log(result)
          setMessages([
            ...messages,
            { text: result.data.saveMessage.content, self: true, userID: currentUser, messageType: 3 },
          ]);
        } catch (error) {
          console.log(error);
        }
      };
    });
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function openFileModal() {
    setIsFileModalOpen(true);
  }

  function closeFileModal() {
    setIsFileModalOpen(false);
  }

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      // Check if the target is the ModalBackground
      closeModal();
      closeFileModal();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // 입력값 설정
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      // 실시간 메시지 배열에 추가하지 않고 'messages' 배열에 추가
      setMessages([
        ...messages,
        { roomID: Number(chatID), text: inputValue, self: true, userID: currentUser, messageType: 0 },
      ]);
      sendMessage(inputValue);
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
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  //강제퇴장
  const dropOut = async () => {
    const response = await axios.delete(baseURL + `chat/chatroom/${chatID}`, {
      data: { userID: "gth1210" }, //여기에 강퇴자 아이디 넣으면 됨
    });
    console.log(response.message);
    navigate("/Chatting");
  };
  //나가기
  const getOut = async () => {
    const response = await axios.delete(
      baseURL + `chat/chatroomquit/${chatID}`
    );
    console.log(response.message);
    navigate("/Chatting");
  };
  async function download(imageUrl) {
    console.log(imageUrl);
    await axios.get(`${baseURL}chat/download`, { params: { key: imageUrl } })
        .then((response) => {
            const url = response.data.url;
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            // link.download attribute is not necessary as we set the file name in the backend
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error('File download failed:', error);
        });
}
  
  return (
    <RoomContainer>
      <TopContainer>
        <Header>
          <button className="back_btn" onClick={() => navigate("/Chatting")}>
            <FontAwesomeIcon icon={faArrowLeft} size="2x" />
          </button>
          <TitleContainer>
            <Title>
              {roomdata && roomdata.data.chatRoomData.companion_post.title}
            </Title>
            <FontAwesomeIcon icon={faUser} size="1x" color="#8F9098" />
            <Person>
              {roomdata && roomdata.data.chatRoomData.user_chats.length}
            </Person>
          </TitleContainer>

          <button className="bars_btn">
            <FontAwesomeIcon icon={faBars} size="2x" onClick={openModal} />
          </button>
          {isModalOpen && (
            <ModalBackground onClick={handleOutsideClick}>
              <ModalBox onClick={(e) => e.stopPropagation()}>
                {roomdata && (
                  <ModalTitle>
                    참여중인 대화자{" "}
                    {roomdata.data.chatRoomData.user_chats.length}
                  </ModalTitle>
                )}
                <div>
                  {roomdata &&
                    roomdata.data.chatRoomData.user_chats
                      // admin 사용자를 첫 번째로 정렬
                      .sort((a, b) => {
                        if (a.userID === roomdata.data.chatRoomData.admin)
                          return -1;
                        if (b.userID === roomdata.data.chatRoomData.admin)
                          return 1;
                        return 0;
                      })
                      .map((list, index) => (
                        <People key={index}>
                          <ModalImage>
                            {list.User.profileImage === null ? (
                              <img
                                alt="chosen"
                                style={{ width: "100%", borderRadius: "100%" }}
                              />
                            ) : (
                              <img
                                src={`${imgURL}${list.User.profileImage.replace(
                                  /\\/g,
                                  "/"
                                )}`}
                                style={{ width: "100%", borderRadius: "100%" }}
                              />
                            )}
                          </ModalImage>
                          <ModalPeople>{list.userID}</ModalPeople>
                          {roomdata.data.chatRoomData.admin === currentUser &&
                            list.userID !==
                              roomdata.data.chatRoomData.admin && (
                              <Dropout>
                                <DropButton onClick={dropOut}>
                                  강퇴하기
                                </DropButton>
                              </Dropout>
                            )}
                        </People>
                      ))}
                </div>
                <Getout>
                  <Button onClick={getOut}>나가기</Button>
                </Getout>
              </ModalBox>
            </ModalBackground>
          )}
        </Header>
      </TopContainer>

      {/* 채팅내역 부분 */}
      <MidContainer ref={scrollRef}>
        {/* 이전의 채팅을 가져오는 부분 */}
        
        {messageData&&
          [...messageData.data.chatMessage.rows]
            .reverse()
            .map((prevchat, index) => {
              const matchedUser =
                roomdata &&
                roomdata.data.chatRoomData.user_chats.find(
                  (user) => user.userID === prevchat.userID
                );
              console.log(prevchat)
              const profileImage = matchedUser?.User?.profileImage;
              const isCurrentUser = currentUser === prevchat.userID; // 현재 사용자와 이전의 채팅 userID가 일치하는지 확인
              const currentMessageDate = new Date(prevchat.sendtime).toLocaleDateString();
              let showDate = false;
              if (currentMessageDate !== lastDate) {
                showDate = true;
                lastDate=currentMessageDate; // 이전 메시지의 날짜 업데이트
              }
              return (
                <>
                
                {showDate && <DateLabel>{currentMessageDate}</DateLabel>}

                <ChatContainer
                  ref={index === 0 ? lastPostElementRef : null}
                  key={index}
                  self={isCurrentUser}
                >
                 
                  {!isCurrentUser && profileImage && (
                    <img
                      src={`${imgURL}${profileImage.replace(/\\/, "/")}`}
                      alt="Profile"
                    />
                  )}

                  <MessageContainer>
                    {!isCurrentUser && <UserID>{prevchat.userID}</UserID>}
                    {prevchat.messageType === 0 &&<ChatContent self={isCurrentUser}>
                      {prevchat.content}
                    </ChatContent>}
                    {prevchat.messageType === 1 && (
                      <ImageContainer>
                        <img src={`${imgURL}${prevchat.content}`}/>
                        <button onClick={() => download(prevchat.content)}>Download</button> {/* 다운로드 버튼 */}
                      </ImageContainer>
                    )}
                    {prevchat.messageType === 2 && (
                      <VideoContainer>
                        <video controls>
                          <source src={`${imgURL}${prevchat.content.replace(/\\/g, "/")}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <button onClick={() => download(prevchat.content)}>Download</button>
                      </VideoContainer>
                    )}
                    {prevchat.messageType===3 && (
                      <DocumentContainer>
                        <div 
                          className="icon" 
                          onClick={(e) => {
                            e.preventDefault();
                            download(prevchat.content);
                          }}
                        >
                          {prevchat.content.endsWith('.pdf') && <FontAwesomeIcon icon={faFilePdf} />}
                          {prevchat.content.endsWith('.doc') || prevchat.content.endsWith('.docx') && <FontAwesomeIcon icon={faFileWord} />}
                        </div>
                      </DocumentContainer>
                    )}
                    <MessageTime isCurrentUser={isCurrentUser}>
                      {new Intl.DateTimeFormat("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(prevchat.sendtime))}
                    </MessageTime>
                  </MessageContainer>
                </ChatContainer>
                </>
              );
              
            })}

        {messages.map((message, index) => {
          
          console.log(message);
          const currentMessageDate = new Date().toLocaleDateString();
          let showDate = false;
          if (currentMessageDate !== lastDate) {
            showDate = true;
            lastDate=currentMessageDate; // 이전 메시지의 날짜 업데이트
          }
          return(
            <>
            {showDate && <DateLabel>{currentMessageDate}</DateLabel>}
            {message.roomID === Number(chatID) && (
              <ChatContainer key={index} self={message.self}>
              {!message.self && message.profileImage && (
                <img
                  src={`${imgURL}${message.profileImage.replace(/\\/g, "/")}`}
                  alt="Profile"
                />
              )}
              <MessageContainer>
                {!message.self && <UserID>{message.userID}</UserID>}
                {message.messageType === 0 && (
                  <ChatMessage self={message.self}>{message.text}</ChatMessage>
                )}
                {/* 이미지 메시지 */}
                {message.messageType === 1 && (
                  <ImageContainer>
                    <img
                      src={`${imgURL}${message.text.replace(/\\/g, "/")}`} 
                      alt="Chat image" 
                    />
                    <button onClick={() => download(message.text)}>Download</button>
                  </ImageContainer>
                )}
                {message.messageType === 2 && (
                  <VideoContainer>
                    <video controls>
                      <source src={`${imgURL}${message.text.replace(/\\/g, "/")}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <button onClick={() => download(message.text)}>Download</button>
                  </VideoContainer>
                )}
                {message.messageType===3 && (
                  <DocumentContainer>
                    <div 
                      className="icon" 
                      onClick={(e) => {
                        e.preventDefault();
                        download(message.text);
                      }}
                    >
                      {message.text.endsWith('.pdf') && <FontAwesomeIcon icon={faFilePdf} />}
                      {message.text.endsWith('.doc') || message.text.endsWith('.docx') && <FontAwesomeIcon icon={faFileWord} />}
                    </div>
                    </DocumentContainer>
                )}
                <MessageTime>
                  {new Intl.DateTimeFormat("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date())}
                </MessageTime>
              </MessageContainer>
            </ChatContainer>
            )}
            
          </>
          )
              
          
        })}
        <div ref={messagesEndRef} />
      </MidContainer>

      {/* 채팅입력 부분 */}

      <BottomContainer>
      <ImageSendButtonContainer>
        <ImageSendButtonIcon onClick={openFileModal}>
          <FontAwesomeIcon icon={faSquarePlus} size="2x" color="#f97800"/>
        </ImageSendButtonIcon>
        {isFileModalOpen && (
          <ModalBackground onClick={handleOutsideClick}>
            <IconBox onClick = {(e)=> e.stopPropagation()}>
            <IconContainer>
              <Icon 
                icon={faImages} 
                onClick={() => sendImage()} 
              />
              <Icon 
                icon={faVideo} 
                onClick={() => sendVideo()} 
              />
              <Icon 
                icon={faFile} 
                onClick={() => sendFile()} 
              />
            </IconContainer>
            </IconBox>
          </ModalBackground>
          
        )}
      </ImageSendButtonContainer>
        <InputContainer>
          
            {/* <FontAwesomeIcon icon={faSquarePlus} size="2x" color={"#f97800"} /> */}
          <ChatInput
            type="text"
            placeholder="메시지 입력"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
          />
          <SendButton onClick={handleSendMessage}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </SendButton>
        </InputContainer>
      </BottomContainer>
      <ScrollToBottomButton
        onClick={scrollToBottom}
        style={{ display: isVisible ? "block" : "none", right: buttonPosition }}
      >
        <FontAwesomeIcon icon={faChevronDown} size="3x" color="#f97800" />
      </ScrollToBottomButton>
    </RoomContainer>
  );
};

const DocumentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  .icon {
    margin-bottom: 10px;
    color: blue;
    text-decoration: underline;
    cursor: pointer; // 아이콘에 마우스를 올리면 포인터가 나타나게 함
  }

  button {
    display: none; // 버튼을 숨김
  }
`;

const IconBox =styled.div`
  width: 300px;
  height: 50px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  position: relative;
`
const IconContainer = styled.div`
display: flex;
justify-content: space-around;
padding: 10px 0;
`;

const Icon = styled(FontAwesomeIcon)`
font-size: 2em;
cursor: pointer;
`;
const UploadInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: transparent;
  cursor: pointer;

  &::-webkit-file-upload-button {
    display: none;
  }
`;
const HiddenDiv = styled.div`
  position: absolute;
  visibility: hidden;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
`;
const Getout = styled.div`
  border-top: 1px solid #dadada;
  margin-top: 200px;
  position: absolute; /* 수정 */
  bottom: 0; /* 추가 */
`;
const ModalImage = styled.div`
  background-color: rgb(254, 237, 229);
  width: 30px;
  height: 30px;
  border-radius: 80%;
  display: flex;
  align-items: center;
  margin-right: 5px;
  margin-bottom: 10px;

  cursor: pointer;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RoomContainer = styled.div``;

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

  button.bars_btn {
    border: none;
    color: #f97800;
    cursor: pointer;
    background-color: white;

    margin: 20px;
  }

  @media (max-width: 640px) {
    width: 100%;
    height: 70px; // 모바일 화면에서 높이 조정
    font-size:13px;
  }

  @media (min-width: 601px) and (max-width: 1200px) {
    height: 80px; // 태블릿 화면에서 높이 조정
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  margin-right: 15px;
`;
const Person = styled.div`
  margin-left: 5px;
  color: #8f9098;
`;

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
  width: 300px;
  height: 400px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const ModalTitle = styled.div`
  display: flex;
  justify-content: center;
  color: #f97800;
  font-size: 19px;
  border-bottom: 1px solid #dadada;
  padding-bottom: 10px;
`;

const People = styled.div`
  display: flex;
  margin-top: 10px;
`;

const ModalPeople = styled.div`
  margin: 5px 0px 10px 5px;
`;

const MidContainer = styled.div`
  margin-top: 75px;
  margin-bottom: 85px;
  overflow-y: scroll;
  height: calc(
    100vh - 70px - 80px
  ); /* 전체 높이에서 헤더와 바텀의 높이를 제외한 값 */
  overflow-x: hidden;

`;
const DateLabel = styled.div`
  position: relative;
  display: block;
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #888;
  margin: 10px 0;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 5px;
  border-radius: 20px;

  &::before,
  &::after {
    content: "----------------------------------------------------------";
    position: absolute;
    top: 50%;
    width: 50%;
    text-align: center;
    transform: translateY(-50%);
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;


const ChatMessage = styled.div`
  display: inline-block;
  background-color: ${(props) => (props.self ? "#FFEB3B" : "#ffffff")};
  border: 1px solid ${(props) => (props.self ? "#FFEB3B" : "#E0E0E0")};
  border-radius: 12px;
  padding: 10px;
  margin: 5px 5px 5px 0px;
  max-width: 95%;
  word-break: break-word;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
  justify-content: ${(props) => (props.self ? "flex-end" : "flex-start")};

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: ${(props) => (props.self ? "0 0 5px 15px" : "0 15px 5px 0")};
  }
`;
const ImageContainer = styled.div`
display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 250px;
    height: 250px;
    border: 1px solid #ffffff;
    border-radius: 4px;
  }
  
  

  button {
    margin-top: 5px;
    padding: 5px 10px;
    background-color: blue;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;
const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  video {
    width: 250px;
    height: 250px;
    border: 1px solid #ffffff;
    border-radius: 4px;
  }

  button {
    margin-top: 5px;
    padding: 5px 10px;
    background-color: blue;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const ScrollToBottomButton = styled.button`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: none;
  background-color: #fff;
  position: fixed;
  bottom: 120px;
  cursor: pointer; // 커서 모양 변경
  transition: background-color 0.3s; // 배경색 변경 애니메이션 효과
  &:hover {
    background-color: rgba(0, 0, 0, 0.05); // 약한 회색 배경색
  }
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;
const MessageTime = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  margin-top: auto;
  font-size: x-small;
`;
const UserID = styled.span`
  font-size: 12px;
  color: #888;
  margin-bottom: 5px;
`;

const ChatContent = styled.div`
  background-color: ${(props) => (props.self ? "#FFEB3B" : "#ffffff")};
  border: 1px solid ${(props) => (props.self ? "#FFEB3B" : "#E0E0E0")};
  border-radius: 12px;
  padding: 10px;
  margin: 5px 5px 5px 0px;
  max-width: 95%;
  word-break: break-word;
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
  background-color: #e1e1e1; // lighter gray for input
  outline: none;
  border-radius: 18px;
  padding: 0 12px;
`;

const SendButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #f97800;
`;
const ImageSendButtonContainer = styled.div`
  position: relative;
  width: 50px; // 이 값을 원하는 크기로 설정
  height: 6 0px; // 이 값을 원하는 크기로 설정
`;

const ImageSendButton = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0; // 이렇게 하면 원래 input이 안 보입니다
  cursor: pointer;
  z-index: 1; // 이것으로 input이 상위에 옵니다
  &::-webkit-file-upload-button {
    display: none;
  }
`;

const ImageSendButtonIcon = styled.div`
  position: absolute;
  top: 50%; // 중앙으로 이동
  left: 50%; // 중앙으로 이동
  transform: translate(-50%, -50%); // 자신의 크기의 절반만큼 오프셋을 줘서 중앙으로 정렬
  z-index: 0; // 이것으로 input 아래에 위치
`;

const Button = styled.div`
box-sizing: border-box;
appearance: none;
background-color: transparent;
border: 2px solid #f97800;
border-radius: 0.6em;
color: #f97800;
cursor: pointer;
align-self: center;
font-size: 16px;
font-family: "Nanum Gothic", sans-serif;
line-height: 1;
padding: 0.5em 0.5em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-bottom: 10px;
margin-left:115px;
margin-right:115px;
text-align:center;
margin-top:10px;

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

const DropButton = styled.div`
box-sizing: border-box;
appearance: none;
background-color: transparent;
border: 2px solid #f97800;
border-radius: 0.6em;
color: #f97800;
cursor: pointer;
align-self: center;
font-size: 13px;
font-family: "Nanum Gothic", sans-serif;
line-height: 1;
padding: 0.5em 0.5em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-bottom: 10px;
margin-left:115px;
text-align:center;

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

const Dropout = styled.div`
  right: 0;
  position: absolute; /*  */
  margin-right: 10px;
`;

export default ChattingRoom;
