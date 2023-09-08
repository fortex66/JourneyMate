// App.js
import "./App.css";
import { BrowserRouter, Routes, Route, useAsyncError } from "react-router-dom";
import React, { useRef, useState, useEffect, createContext } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Companion from "./pages/Companion";
import Chatting from "./pages/Chatting";
import ChattingMessage from "./components/ChattingMessage";
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
// import {socket,SOCKET_EVENT,SocketContext} from "./components/Chatting/Chat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";

export const SocketContext = createContext();

function App() {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newsocket = io(ENDPOINT, { withCredentials: true });
    newsocket.emit("init");
    setSocket(newsocket);

    return () => {
      newsocket.close();
      newsocket.off("chat_message");
    };
  }, []);

  return (
    <BrowserRouter>
      <SocketContext.Provider value={socket}>
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
            <Route path="/ChattingRoom/:chatID" element={<ChattingRoom />} />
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
            <Route path="/UserDetail/:userId" element={<UserDetail />} />
            <Route path="/HomeC" element={<HomeC />} />
            <Route path="/HomeF" element={<HomeF />} />
            <Route path="/DiscoverId" element={<DiscoverId />} />
            <Route path="/DiscoverPw" element={<DiscoverPw />} />
            <Route path="/Local_Festival" element={<Local_Festival />} />
            <Route path="/Festival_detail" element={<Festival_detail />} />
            <Route path="/Area_Festival" element={<Area_Festival />} />
            <Route path="/Area_Search" element={<Area_Search />} />
          </Routes>
        </div>
      </SocketContext.Provider>
    </BrowserRouter>
  );
}

export default App;
