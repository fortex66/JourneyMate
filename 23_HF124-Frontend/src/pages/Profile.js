import React, { useEffect, useState,useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faPhone } from "@fortawesome/free-solid-svg-icons";
import ProfileDetail from "./ProfileDetail";
import { SocketContext } from "../App";
import bcrypt from "bcryptjs";

const baseURL = "http://localhost:3000/";

const Profile = () => {
  const navigate = useNavigate();
  const socket=useContext(SocketContext);

  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);

  const onIconClick = async () => {
    // Create a reference to the hidden file input element
    const fileInput = document.getElementById("fileInput");
    // Programmatically trigger a click event on the file input element
    fileInput.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("photo", file);
      try {
        const profileImage = await axios.put(
          baseURL + "mypage/profileImage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // multipart/form-data로 보낸다고 명시
            },
          }
        );
        console.log(profileImage);
        const newURL =
          "uploads\\" + userData.profile[0].userID + "-" + file.name;
        console.log(newURL);
        setImage(newURL);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getProfileImage = async () => {
    try {
      const resUser = await axios.get(baseURL + `mypage/profile`);
      console.log(resUser);
      setUserData(resUser.data);
      console.log(resUser.data.profile[0].profileImage);
      setImage(resUser.data.profile[0].profileImage);
    } catch (error) {
      console.log(error);
    }
  };
  const logout = async () => {
    try {
      const userLogout = await axios.delete(baseURL + "mypage/logout");
      alert("로그아웃을 완료하였습니다!");
      socket.close()
      navigate("/Login");
    } catch (err) {
      console.error(err);
    }
  };

  const pwVerify = () => {
    const userPw = prompt("비밀번호를 입력하세요:");

    const promise = bcrypt.compare(userPw, userData.profile[0].password);
    promise
      .then((comparePW) => {
        if (!comparePW || userPw === null) {
          alert("비밀번호 오류");
          console.log("비밀번호오류");
        } else {
          navigate("/ProfileDetail");
        }
      })
      .catch((err) => {
        alert("비밀번호가 입력되지 않았습니다.");
        console.error(err);
      });
  };

  const changePW = () => {
    const userPw = prompt("비밀번호를 입력하세요:");

    const promise = bcrypt.compare(userPw, userData.profile[0].password);
    promise
      .then((comparePW) => {
        if (!comparePW || userPw === null) {
          alert("비밀번호 오류");
          console.log("비밀번호오류");
        } else {
          navigate("/passwordChange");
        }
      })
      .catch((err) => {
        alert("비밀번호가 입력되지 않았습니다.");
        console.error(err);
      });
  };
  useEffect(() => {
    getProfileImage();
  }, []);

  return (
    <Container>
      <Navigation>
        <Header>
          <button className="back_btn" onClick={() => navigate(-1)}>
            {" "}
            {"<"}{" "}
          </button>
          <button className="complete_btn" onClick={() => logout()}>
            {" "}
            로그아웃{" "}
          </button>
        </Header>
      </Navigation>

      <PhotoContainer>
        <Circle onClick={onIconClick}>
          {image ? (
            <img
              src={`${baseURL}${image && image.replace(/\\/g, "/")}`}
              alt="chosen"
              style={{ width: "100%", borderRadius: "100%" }}
            />
          ) : (
            <FontAwesomeIcon icon={faUser} size="4x" color={"#f97800"} />
          )}
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Circle>
      </PhotoContainer>

      <InfoContainer>
        <TitleBar>
          <Title>내 정보</Title>
          <Edit
            onClick={() => {
              pwVerify();
            }}
          >
            편집
          </Edit>
        </TitleBar>
        <Info>
          <NameBar>
            <Name>이름</Name>
            <NameData>{userData && userData.profile[0].user}</NameData>
          </NameBar>
          <EmailBar>
            <Email>이메일</Email>
            <EmailData>{userData && userData.profile[0].email}</EmailData>
          </EmailBar>
          <RegionBar>
            <Region>지역</Region>
            <RegionData>{userData && userData.profile[0].region}</RegionData>
          </RegionBar>
          <TagBar>
            <Tag>관심사</Tag>
            <TagDataBar>
              {userData &&
                userData.userTag.map((tag) => <TagData>{tag.tagName}</TagData>)}
            </TagDataBar>
          </TagBar>
        </Info>
      </InfoContainer>

      <PasswordContainer>
        <FontAwesomeIcon icon={faLock} size="2x" />
        {/* 비밀번호 변경창으로 이동하는 온클릭 이벤트 처리하기 */}
        <PasswordChange
          onClick={() => {
            changePW();
          }}
        >
          비밀번호 변경
        </PasswordChange>
      </PasswordContainer>

      <ServiceContainer>
        <FontAwesomeIcon icon={faPhone} size="2x" />
        <Service>고객센터</Service>
        <Phonenumber>010 - 9667 - XXXX</Phonenumber>
      </ServiceContainer>
    </Container>
  );
};
const Container = styled.div``;

const Navigation = styled.div`
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

  button {
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
    margin: 20px;
    padding: 0.6em 2em;
    text-decoration: none;
    letter-spacing: 2px;
    font-weight: 700;

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
  button.back_btn {
    padding: 0.6em 1em;
  }
`;

const PhotoContainer = styled.div`
  margin-top: 140px;
  display: flex;
  justify-content: center;
`;

const Circle = styled.div`
  background-color: rgb(254, 237, 229);
  width: 90px;
  height: 90px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  cursor: pointer;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoContainer = styled.div`
  margin-top: 50px;
  margin-left: 50px;
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
`;
const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
`;
const Edit = styled.div`
  margin-left: 30px;
  color: red;
  font-weight: bold;
  cursor: pointer;
`;
const Info = styled.div`
  margin-top: 20px;
  margin-left: 10px;
`;
const NameBar = styled.div`
  display: flex;
`;
const Name = styled.div`
  font-weight: bold;
`;
const NameData = styled.div`
  margin-left: 50px;
`;

const EmailBar = styled.div`
  display: flex;
  margin-top: 15px;
`;
const Email = styled.div`
  font-weight: bold;
`;
const EmailData = styled.div`
  margin-left: 36px;
`;

const RegionBar = styled.div`
  display: flex;
  margin-top: 15px;
`;
const Region = styled.div`
  font-weight: bold;
`;
const RegionData = styled.div`
  margin-left: 50px;
`;

const TagBar = styled.div`
  display: flex;
  margin-top: 15px;
`;
const Tag = styled.div`
  font-weight: bold;
`;
const TagDataBar = styled.div`
  margin-left: 35px;
  display: flex;
`;
const TagData = styled.div`
  margin-right: 9px;
`;

const PasswordContainer = styled.div`
  margin-top: 70px;
  margin-left: 50px;
  display: flex;
  align-items: center;
`;

const PasswordChange = styled.div`
  margin-left: 20px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
`;

const ServiceContainer = styled.div`
  margin-top: 70px;
  margin-left: 50px;
  display: flex;
  align-items: center;
`;

const Service = styled.div`
  margin-left: 20px;
  font-size: 20px;
  font-weight: bold;
`;

const Phonenumber = styled.div`
  margin-left: 20px;
  font-size: 20px;
  font-weight: bold;
`;
export default Profile;
