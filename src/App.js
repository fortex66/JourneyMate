import "./App.css";
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

function App() {
  return (
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
