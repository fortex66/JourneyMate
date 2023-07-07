import "./App.css";
import React from "react";
import { useState, useRef, useReducer } from "react";
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

export const CompanionStateContext = React.createContext();
export const CompanionDispatchContext = React.createContext();

function App() {
  const [data, dispatch] = useReducer(reducer, []);
  const dataId = useRef(0);
  //CREATE
  const onCreate_Companion = (
    title,
    location,
    tag,
    start_date,
    finish_date,
    content,
    personnel
  ) => {
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        title,
        location,
        tag,
        start_date,
        finish_date,
        content,
        personnel,
      },
    });
    dataId.current += 1;
  };

  return (
    <CompanionStateContext.Provider value={data}>
      <CompanionDispatchContext.Provider value={onCreate_Companion}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/Login" element={<Login />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Community" element={<Community />} />
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
      </CompanionDispatchContext.Provider>
    </CompanionStateContext.Provider>
  );
}

export default App;
