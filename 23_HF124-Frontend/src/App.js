// App.js
import "./App.css";
import React, { useRef, useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import Scrap from "./pages/Scrap";
import Community_Write from "./components/Community_Write";
import Companion_Write from "./components/Companion_Write";
import Community_Detail from "./pages/Community_Detail";
import Companion_Detail from "./pages/Companion_Detail";
import Search from "./pages/Search";
import ScrollToTop from "./components/ScrollToTop";

// export const CompanionStateContext = React.createContext();
// export const CompanionDispatchContext = React.createContext();

// export const CommunityStateContext = React.createContext();
// export const CommunityDispatchContext = React.createContext();

// const reducer = (state, action) => {
//   let newState = [];
//   switch (action.type) {
//     case "INIT": {
//       return action.data;
//     }
//     case "CREATE": {
//       const newItem = {
//         ...action.data,
//       };
//       newState = [newItem, ...state];
//       break;
//     }
//     case "CREATE_COMPANION": {
//       const newItem = {
//         ...action.data,
//       };
//       newState = [newItem, ...state];
//       break;
//     }
//     default:
//       return state;
//   }
//   return newState;
// };

function App() {
  // const [companionData, companionDispatch] = useReducer(reducer, []);
  // const [communityData, communityDispatch] = useReducer(reducer, []);
  // const companion_dataId = useRef(0);
  // const dataId = useRef(0);

  // const onCreate_Companion = (
  //   title,
  //   location,
  //   gender,
  //   age,
  //   start_date,
  //   finish_date,
  //   personnel,
  //   photo,
  //   content,
  //   tag
  // ) => {
  //   companionDispatch({
  //     type: "CREATE_COMPANION",
  //     data: {
  //       id: companion_dataId.current,
  //       title,
  //       location,
  //       gender,
  //       age,
  //       start_date,
  //       finish_date,
  //       personnel,
  //       photo,
  //       content,
  //       tag,
  //     },
  //   });
  //   companion_dataId.current += 1;
  // };

  // const onCreate = (title, location, tag, photos, content) => {
  //   communityDispatch({
  //     type: "CREATE",
  //     data: {
  //       id: dataId.current,
  //       title,
  //       location,
  //       tag,
  //       photos,
  //       content,
  //     },
  //   });
  //   dataId.current += 1;
  // };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Community" element={<Community />} />
          <Route path="/Community_Detail/:postId" element={<Community_Detail />} />
          <Route path="/Companion_Detail/:postId" element={<Companion_Detail />} />
          <Route path="/Companion" element={<Companion />} />
          <Route path="/Chatting" element={<Chatting />} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/Write" element={<Write />} />
          <Route path="/Sign" element={<Sign />} />
          <Route path="/Area" element={<Area />} />
          <Route path="/Tag" element={<Tag />} />
          <Route path="/" element={<Start />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Scrap" element={<Scrap />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Community_Write" element={<Community_Write />} />
          <Route path="/Companion_Write" element={<Companion_Write />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
