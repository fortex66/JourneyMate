import React from "react";
import { useContext, useEffect, useState } from "react";
import Navigationbar from "../components/Navigationbar";
import Community_List from "../components/Community_List";
import { CommunityStateContext } from "../App";
// const dummyList = [
//   {
//     id: 1,
//     title: "영남대학교 학생입니다.",
//     location: "경산",
//     tag: "카페",
//     photo: "",
//     content: "안녕하세요 저는....",
//   },
//   {
//     id: 2,
//     title: "계명대학교 학생입니다.",
//     location: "달서구",
//     tag: "카페",
//     photo: "",
//     content: "안녕하세요 저는....",
//   },
//   {
//     id: 3,
//     title: "경북대학교 학생입니다.",
//     location: "남구",
//     tag: "카페",
//     photo: "",
//     content: "안녕하세요 저는....",
//   },
//   {
//     id: 4,
//     title: "대구대학교 학생입니다.",
//     location: "대구",
//     tag: "카페",
//     photo: "",
//     content: "안녕하세요 저는....",
//   },
//   {
//     id: 5,
//     title: "부산대학교 학생입니다.",
//     location: "부산",
//     tag: "카페",
//     photo: "",
//     content: "안녕하세요 저는....",
//   },
// ];

const Community = () => {
  const community_list = useContext(CommunityStateContext);
  const [data, setData] = useState([]);
  return (
    <div>
      <h1>Community</h1>

      <Community_List community_list={data} />

      <Navigationbar />
    </div>
  );
};

export default Community;
