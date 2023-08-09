// App.js
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useRef, useState, useEffect, createContext } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Companion from "./pages/Companion";
import Chatting from "./pages/Chatting";
import Chat from "./components/Chatting/Chat";
import Mypage from "./pages/Mypage";
import Write from "./pages/Write";
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
import Community_Search from "./pages/Community_Search";
import Companion_Search from "./pages/Companion_Search";
// import {socket,SOCKET_EVENT,SocketContext} from "./components/Chatting/Chat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";

export const SocketContext = createContext(); // SocketContext 생성

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
    newSocket.emit("chat message", "Hello world!");
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <BrowserRouter>
      <SocketContext.Provider value={socket}>
        {" "}
        {/* SocketContext.Provider로 감싸기 */}
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
            {/* <Route path="/Chat" element={<Chat />} /> */}
            <Route path="/Mypage" element={<Mypage />} />
            <Route path="/Write" element={<Write />} />
            <Route path="/Sign" element={<Sign />} />
            <Route path="/Area" element={<Area />} />
            <Route path="/Tag" element={<Tag />} />
            <Route path="/" element={<Start />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/ProfileDetail" element={<ProfileDetail />} />
            <Route path="/PasswordChange" element={<PasswordChange />} />
            <Route path="/Scrap" element={<Scrap />} />
            <Route path="/Search" element={<Search />} />
            <Route path="/Community_Write" element={<Community_Write />} />
            <Route path="/Companion_Write" element={<Companion_Write />} />
            <Route path="/Community_Search" element={<Community_Search />} />
            <Route path="/Companion_Search" element={<Companion_Search />} />
          </Routes>
        </div>
      </SocketContext.Provider>
    </BrowserRouter>
  );
}

export default App;
