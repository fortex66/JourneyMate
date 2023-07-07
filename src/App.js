import "./App.css";
import React, { useReducer } from "react";
import { useState, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Companion from "./pages/Companion";
import Chat from "./pages/Chat";
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

export const CommunityStateContext = React.createContext();
export const CommunityDispatchContext = React.createContext();

const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const newItem = {
        ...action.data,
      };
      newState = [newItem, ...state];
      break;
    }
    default:
      return state;
  }
  return newState;
};

function App() {
  const [data, dispatch] = useReducer(reducer, []);

  const dataId = useRef(0);

  const onCreate = (title, location, tag, photos, content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        title,
        location,
        tag,
        photos,
        content,
      },
    });
    dataId.current += 1;
  };

  return (
    <CommunityStateContext.Provider value={data}>
      <CommunityDispatchContext.Provider value={{ onCreate }}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/Login" element={<Login />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Community" element={<Community />} />
              <Route
                path="/Community_Detail/:id"
                element={<Community_Detail />}
              />
              <Route path="/Companion" element={<Companion />} />
              <Route path="/Chat" element={<Chat />} />
              <Route path="/Mypage" element={<Mypage />} />
              <Route path="/Write" element={<Write />} />
              <Route path="/Sign" element={<Sign />} />
              <Route path="/Area" element={<Area />} />
              <Route path="/Tag" element={<Tag />} />
              <Route path="/" element={<Start />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Scrap" element={<Scrap />} />
              <Route path="/Community_Write" element={<Community_Write />} />
              <Route path="/Companion_Write" element={<Companion_Write />} />
            </Routes>
          </div>
        </BrowserRouter>
      </CommunityDispatchContext.Provider>
    </CommunityStateContext.Provider>
  );
}

export default App;
