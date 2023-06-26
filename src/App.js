import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Companion from "./pages/Companion";
import Search from "./pages/Search";
import Mypage from "./pages/Mypage";
import Write from "./pages/Write";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Community" element={<Community />} />
          <Route path="/Companion" element={<Companion />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/Write" element={<Write />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
