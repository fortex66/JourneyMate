import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";
import background from "../images/backgroundimg.jpg";

function Start() {
  return (
    <Box>
      <Intro>
        <Logo>
          <Brand>Journeymate</Brand>
          <Iconcontainer>
            <FontAwesomeIcon icon={faPlane} size="2x" color={"#f97800"} />
          </Iconcontainer>
        </Logo>
        <Content>
          <Title>같이 여행하실래요?</Title>
          <Middle>
            여행정보부터 새로운 사람과의 만남까지,
            <br />
            지금 바로 시작해보세요!
          </Middle>
        </Content>
      </Intro>
      <Select>
        <WrapBottom>
          <button>
            <Link to="/Login">시작하기</Link>
          </button>
          <p>
            계정이 없으신가요?{" "}
            <span>
              <Link to="/Sign">회원가입</Link>
            </span>
          </p>
        </WrapBottom>
      </Select>
    </Box>
  );
}

const Box = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;

  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.6),
      rgba(0, 0, 0, 0.6)
    ),
    url(${background}); // 여기를 수정
  background-size: cover;
  background-position: center;
`;

const Intro = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 130px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Brand = styled.h1`
  color: white;
`;

const Iconcontainer = styled.div`
  margin-left: 10px;
  position: relative;
  opacity: 0; // 처음에는 투명하게
  animation: flyIn 2s ease-out 3s forwards; // 2초 동안 움직이고 3초 뒤에 시작

  @keyframes flyIn {
    0% {
      left: -100vw; // 화면 밖 왼쪽으로 시작
      opacity: 0;
    }
    100% {
      left: 0; // 원래 위치로 돌아옴
      opacity: 1;
    }
  }
`;

const Content = styled.div`
  text-align: center;
  color: white; // 글자색을 흰색으로 변경
  margin-top: 100px;
`;

const Title = styled.h2`
  font-weight: bold;
  margin-top: 10px;
  color: white; // 글자색을 흰색으로 변경
  opacity: 0; // 처음에는 투명하게
  animation: slideInFromLeft 1.5s ease-out 1s forwards; // 1.5초 동안 움직이고 1초 뒤에 시작
  @keyframes slideInFromLeft {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const Middle = styled.div`
  opacity: 0; // 처음에는 투명하게 설정
  animation: fadeIn 1.5s ease-out 2.5s forwards; // 1.5초 동안 나타나게 하고, 2.5초 뒤에 시작

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Select = styled.div`
  position: relative;
`;

const WrapBottom = styled.div`
  width: 100%;
  height: 140px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  button {
    width: 85%;
    height: 50px;
    border: none;
    border-radius: 10px;
    color: white; // 글자색을 흰색으로 변경
    font-weight: bold;
    padding: 0; // 패딩을 0으로 설정

    a {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #787878;
      transition: background 0.3s;
      text-decoration: none; // 밑줄 제거
      color: inherit;
      border-radius: 10px;
      animation: changeColor 1s ease-out 6s forwards;
      &:hover {
        background-color: #f97800;
      }
    }
    /* 색상을 변경하는 애니메이션 */
    @keyframes changeColor {
      0% {
        background-color: #787878;
      }
      100% {
        background-color: #f97800;
      }
    }
  }

  p {
    margin-top: 30px;
    color: white; // 글자색을 흰색으로 변경
    span {
      margin-left: 8px;
      color: white; // 글자색을 흰색으로 변경
      a {
        text-decoration: none; // 밑줄 제거
        color: #f97800;
      }
    }
  }
`;

export default Start;
