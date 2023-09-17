import styled from "styled-components";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendarDays,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
const Festival_detail = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const festivalData = location.state.festivalData;
  console.log(festivalData);
  const [detailInfo, setDetailInfo] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [searchTriggered, setSearchTriggered]=useState(true);
  // 페이지가 로드될 때 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  

  const formatDate = (date) => {
    if (!date || date.length !== 8) return ""; // 데이터의 길이가 8이 아닐 경우 빈 문자열 반환

    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);

    return `${year}-${month}-${day}`;
  };

  const getContent = async () => {
    try {
      const response = await fetch(
        `https://apis.data.go.kr/B551011/KorService1/detailInfo1?MobileOS=ETC&MobileApp=Journeymate&_type=json&contentId=${festivalData.contentid}&contentTypeId=15&serviceKey=gjCAjUo72Uf%2BjMwy1BdQo85%2B1vNiWiTVe4X987jUj42meneObLKNI%2F4pAYfK%2BysqF%2FObJvxdZp7Fe4uA6%2FPxKQ%3D%3D`
      );
      const json = await response.json();
      console.log(json.response.body.items.item);
      setData(json.response.body.items.item);
      const detailItem = json.response.body.items.item.find(
        (item) => item.infoname === "행사내용"
      );
      if (detailItem) {
        setDetailInfo(detailItem.infotext);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getContent();
  }, []);

  const Companion_Write = () => {
    navigate("/Companion_Write");
  };

  const Companion = () => {
    navigate("/Companion", {
      state: { 
        posts: null,
        location: null,
        searchTriggered,
        tagList: [],
        gender: null,
        age: null,
        title: festivalData.title,
        startDate: null,
        endDate: null,
       },
    });
  };

  const getIntroText = () => {
    const introItem = data?.find((item) => item.infoname === "행사소개");
    return introItem?.infotext || "";
  };
  return (
    <div>
      <Top>
        <StyledButton onClick={() => navigate(-1)}>{"<"}</StyledButton>
        <Text>{festivalData.title}</Text>
      </Top>
      <ImgWrapper>
        <Img src={festivalData.firstimage} />
      </ImgWrapper>
      <StyledButton onClick={Companion}>동행인 찾기</StyledButton>{" "}
      <StyledButton onClick={Companion_Write}> 동행인 모집 </StyledButton>
      <Content>
        <ContentTitle>
          <BackgroundBar showDetails={showDetails} />
          <Button onClick={() => setShowDetails(false)} selected={!showDetails}>
            기본정보
          </Button>
          <Button onClick={() => setShowDetails(true)} selected={showDetails}>
            행사내용
          </Button>
        </ContentTitle>

        {showDetails ? (
          <DetailBox dangerouslySetInnerHTML={{ __html: detailInfo }} />
        ) : (
          <BasicBox>
            <Location2>
              <FontAwesomeIcon
                icon={faLocationDot}
                color={"#f97800"}
                size="2x"
                style={{ margin: "10px" }}
              />
              <Locationdetail>{festivalData.addr2}</Locationdetail>
            </Location2>

            <Day1>
              {" "}
              <FontAwesomeIcon
                icon={faCalendarDays}
                color={"#f97800"}
                size="2x"
                style={{ margin: "10px" }}
              />
              <Day>
                {formatDate(festivalData.eventstartdate)} <br />
                {formatDate(festivalData.eventenddate)}
              </Day>
            </Day1>
            <Tel1>
              <FontAwesomeIcon
                icon={faPhone}
                color={"#f97800"}
                size="2x"
                style={{ margin: "10px" }}
              />
              <Tel>{festivalData.tel}</Tel>
            </Tel1>
          </BasicBox>
        )}
      </Content>
      <EventTitle>행사소개</EventTitle>
      <Introduce>
        <I_Content
          dangerouslySetInnerHTML={{ __html: getIntroText() }}
        ></I_Content>
      </Introduce>
      <br />
    </div>
  );
};

const EventTitle = styled.div`
  display: flex;
  font-size: 20px;
  font-weight: bold;
  justify-content: center;
  color: white;
  margin-bottom: 5px;
  border: 1px solid #f97800;
  border-radius: 30px;
  width: 540px;
  margin-left: 50px;
  margin-top: 15px;
  background-color: #f97800;
`;

const Introduce = styled.div`
  background-color: transparent;
  border: 1px solid #dadada;
  border-radius: 5px;
  width: 530px;
  margin-left: 55px;
  margin-top: 20px;
`;
const Tel1 = styled.div`
  font-size: 15px;
  font-weight: 700;
`;

const Tel = styled.div`
  font-size: 15px;
  margin-left: 5px;
  margin-top: -7px;
`;
const Day1 = styled.div`
  font-size: 15px;
  font-weight: 700;
`;

const Day = styled.div`
  font-size: 15px;
  margin-left: 5px;
  margin-top: -7px;
  margin-bottom: 10px;
`;
const Location2 = styled.div`
  font-size: 15px;
  font-weight: 700;
`;
const Locationdetail = styled.div`
  @media (max-width: 400px) {
    max-width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
`;
const Location1 = styled.div`
  display: flex;
`;

const Location = styled.div`
  font-size: 15px;
  margin-left: 5px;
  margin-top: -7px;
  margin-bottom: 10px;
`;
// 테두리를 위한 스타일을 추가
const BasicBox = styled.div`
  padding: 10px 30px 10px 30px;
  margin: 20px;
  display: flex;
  justify-content: space-between;
  text-align: center;
  border-bottom: 1px solid #dadada;

  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const DetailBox = styled.div`
  border: 1px solid #dadada;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  width: 500px;
  margin-left: 60px;
`;

const I_Content = styled.div`
  padding: 10px;
`;
const Button = styled.button`
  appearance: none;
  background-color: transparent; // 배경색을 투명으로 변경
  border: none; // 테두리를 제거
  border-radius: 2em;
  color: ${(props) =>
    props.selected
      ? "#fff"
      : "#000"}; // 선택될 경우 글자 색상을 하얀색으로 변경
  cursor: pointer;
  align-self: center;
  font-size: 16px;
  font-family: "Nanum Gothic", sans-serif;
  line-height: 1;
  padding: 0.8em 2em;
  text-decoration: none;
  letter-spacing: 2px;
  font-weight: 700;

  transform: ${(props) =>
    props.selected ? "translateX(10px)" : "translateX(0)"};
`;

const ContentTitle = styled.div`
  display: flex;
  justify-content: center; // 버튼을 중앙으로 배치
  padding: 5px;
  border-radius: 30px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  position: relative;
  gap: 100px; // 버튼 간의 간격 설정
  width: 500px;
  height: 30px;
  margin-left: 65px;
  position: relative;
  overflow: hidden; // 이 부분이 추가됨
`;

const BackgroundBar = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0; // 초기 위치
  width: 50%; // ContentTitle의 50% 너비에 해당하는 값
  background-color: #f97800;
  transition: transform 300ms ease-in-out;
  transform: translateX(
    ${(props) => (props.showDetails ? "100%" : "0")}
  ); // showDetails 값에 따라 움직임
`;
const Detail = styled.div``;
const Basic = styled.div``;

const Content = styled.div``;

const ImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; // 필요에 따라 조절하실 수 있습니다.
`;

const Img = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  width: 500px;
  cursor: pointer;
  padding-top: 5px;
  border-radius: 30px; // 둥근 모서리를 위한 코드 추가
`;
const Top = styled.div`
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  display: flex;
  justify-content: center; /* Text를 중앙으로 정렬하기 위해 추가 */
  align-items: center; /* 세로로 중앙으로 정렬하기 위해 추가 */
  border-bottom: 1px solid #dadada;
  position: relative; /* StyledButton을 절대 위치로 설정하기 위해 추가 */
  padding-bottom: 20px; /* 여기에 원하는 크기의 padding 값을 설정하세요 */
  button {
    position: absolute; /* 버튼을 절대 위치로 설정 */
    left: 1px; /* Top 컨테이너의 왼쪽 모서리에서 시작 */
  }
`;

const Text = styled.div`
  display: flex;
  font-size: 24px; /* 원하는 글자 크기로 설정하세요 */
  font-weight: bold; /* 글자를 굵게 만듭니다 */
`;

const StyledButton = styled.button`
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
padding: 0.6em 1.5em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-bottom: 10px;
margin-top:10px;

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

export default Festival_detail;
