import "./App.css";
import { BrowserRouter, Routes, Route, useAsyncError } from "react-router-dom";
import React, { useRef, useState, useEffect, createContext } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Companion from "./pages/Companion";
import Chatting from "./pages/Chatting";
import Mypage from "./pages/Mypage";
import Sign from "./pages/Sign";
import Area from "./pages/Area";
import Tag from "./pages/Tag";
import Start from "./pages/Start";
import Profile from "./pages/Profile";
import ProfileDetail from "./pages/ProfileDetail";
import PasswordChange from "./pages/PasswordChange";
import Scrap from "./pages/Scrap";
import Community_Write from "./components/Community_Write";
import Companion_Write from "./components/Companion_Write";
import Community_Detail from "./pages/Community_Detail";
import Companion_Detail from "./pages/Companion_Detail";
import Search from "./pages/Search";
import UserDetail from "./pages/UserDetail";
import Community_Search from "./pages/Community_Search";
import Companion_Search from "./pages/Companion_Search";
import ChattingRoom from "./components/ChattingRoom";
import HomeC from "./pages/HomeC";
import DiscoverId from "./pages/DiscoverId";
import DiscoverPw from "./pages/DiscoverPw";
import Local_Festival from "./pages/Local_Festival";
import Festival_detail from "./pages/Festival_detail";
import Area_Festival from "./pages/Area_Festival";
import Area_Search from "./pages/Area_Search";
import HomeF from "./pages/HomeF";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";
const imgURL = "https://journeymate.s3.ap-northeast-2.amazonaws.com/";

export const SocketContext = createContext();

function App() {
    const [socket, setSocket] = useState();
    const [socketId, setSocketId] = useState(null);
    const [messages, setMessages] = useState([]); // 전송된 채팅 목록 저장

    useEffect(() => {
        if (!("Notification" in window)) {
            console.error("This browser does not support notifications.");
        } else {
            // 알림 권한 상태 확인
            if (Notification.permission === "granted") {
                // 권한이 이미 부여된 경우
                new Notification("Hello World!");
            } else if (Notification.permission !== "denied") {
                // 권한이 아직 부여되지 않은 경우
                Notification.requestPermission().then((permission) => {
                    // 사용자가 권한을 부여한 경우
                    if (permission === "granted") {
                        new Notification("Hello World!");
                    }
                });
            }
        }
        const newsocket = io(ENDPOINT, { withCredentials: true });
        newsocket.on("connect", () => {
            newsocket.emit("init");
            setSocketId(newsocket.id); // 이벤트 핸들러 내부에서 socketId 설정
        });

        setSocket(newsocket);

        return () => {
            newsocket.close();
            newsocket.off("chat_message");
        };
    }, []);
    useEffect(() => {
        if (!socket) {
            return;
        }
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                const handleChatMessage = async (data) => {
                    new Notification(`${data.title.title}`, {
                        body: data.message,
                        icon: imgURL + data.profileImage.profileImage,
                    });
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            roomID: data.roomID,
                            title: data.title,
                            text: data.message,
                            self: false,
                            userID: data.userID,
                            profileImage: data.profileImage.profileImage,
                            messageType: data.messageType,
                        },
                    ]);
                };

                socket.on("chat_message", handleChatMessage);

                return () => {
                    socket.off("chat_message", handleChatMessage);
                };
            }
        });
    }, [socket]);
    return (
        <BrowserRouter>
            <SocketContext.Provider
                value={{ socket, socketId, messages, setMessages }}
            >
                <div className="App">
                    <Routes>
                        <Route path="/Login" element={<Login />} />
                        <Route path="/Home" element={<Home />} />
                        <Route path="/Community" element={<Community />} />
                        <Route
                            path="/Community_Detail/:postId"
                            element={<Community_Detail />}
                        />
                        <Route
                            path="/Companion_Detail/:postId"
                            element={<Companion_Detail />}
                        />
                        <Route path="/Companion" element={<Companion />} />
                        <Route path="/Chatting" element={<Chatting />} />
                        <Route
                            path="/ChattingRoom/:chatID"
                            element={<ChattingRoom />}
                        />
                        {/* <Route path="/Chat" element={<Chat />} /> */}
                        <Route path="/Mypage" element={<Mypage />} />

                        <Route path="/Sign" element={<Sign />} />
                        <Route path="/Area" element={<Area />} />
                        <Route path="/Tag" element={<Tag />} />
                        <Route path="/" element={<Start />} />
                        <Route path="/Profile" element={<Profile />} />
                        <Route
                            path="/ProfileDetail"
                            element={<ProfileDetail />}
                        />
                        <Route
                            path="/PasswordChange"
                            element={<PasswordChange />}
                        />
                        <Route path="/Scrap" element={<Scrap />} />
                        <Route path="/Search" element={<Search />} />
                        <Route
                            path="/Community_Write"
                            element={<Community_Write />}
                        />
                        <Route
                            path="/Companion_Write"
                            element={<Companion_Write />}
                        />
                        <Route
                            path="/Community_Search"
                            element={<Community_Search />}
                        />
                        <Route
                            path="/Companion_Search"
                            element={<Companion_Search />}
                        />
                        <Route
                            path="/UserDetail/:userId"
                            element={<UserDetail />}
                        />
                        <Route path="/HomeC" element={<HomeC />} />
                        <Route path="/HomeF" element={<HomeF />} />
                        <Route path="/DiscoverId" element={<DiscoverId />} />
                        <Route path="/DiscoverPw" element={<DiscoverPw />} />
                        <Route
                            path="/Local_Festival"
                            element={<Local_Festival />}
                        />
                        <Route
                            path="/Festival_detail"
                            element={<Festival_detail />}
                        />
                        <Route
                            path="/Area_Festival"
                            element={<Area_Festival />}
                        />
                        <Route path="/Area_Search" element={<Area_Search />} />
                    </Routes>
                </div>
            </SocketContext.Provider>
        </BrowserRouter>
    );
}

export default App;
