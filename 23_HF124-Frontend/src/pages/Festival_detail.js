import styled from "styled-components";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLocationDot,
    faCalendarDays,
    faPhone,
    faUserPlus,
    faUserPen,
} from "@fortawesome/free-solid-svg-icons";

const Festival_detail = () => {
    const [data, setData] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const festivalData = location.state.festivalData;
    console.log(festivalData);
    const [detailInfo, setDetailInfo] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [searchTriggered, setSearchTriggered] = useState(true);
    const [showButtons, setShowButtons] = useState(false);
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

    function formatAddress(address) {
        const parts = address.split(" ");
        if (parts.length > 2) {
            return `${parts.slice(0, 2).join(" ")}\n${parts
                .slice(2)
                .join(" ")}`;
        }
        return address;
    }

    const Detail_Nav = () => {
        const navigate = useNavigate();
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
        return (
            <Navigation>
                <Bottomview>
                    <BottomBox>
                        <NavBox>
                            <FontAwesomeIcon
                                icon={faUserPlus}
                                size="2x"
                                color={"#f97800"}
                                onClick={Companion}
                            />
                            동행인 찾기
                        </NavBox>

                        <NavBox>
                            <FontAwesomeIcon
                                icon={faUserPen}
                                size="2x"
                                color={"#f97800"}
                                onClick={Companion_Write}
                            />
                            동행인 모집하기
                        </NavBox>
                    </BottomBox>
                </Bottomview>
            </Navigation>
        );
    };

    return (
        <div>
            <Top>
                <StyledButton onClick={() => navigate(-1)}>{"<"}</StyledButton>
            </Top>

            <ImgWrapper>
                <Text>{festivalData.title}</Text>
                <Img src={festivalData.firstimage} />
            </ImgWrapper>

            <Content>
                <BasicBox>
                    <Location2>
                        <FontAwesomeIcon
                            icon={faLocationDot}
                            color={"#f97800"}
                            size="2x"
                            style={{ margin: "10px" }}
                        />
                        <Locationdetail>
                            {festivalData.addr2
                                ? formatAddress(festivalData.addr2)
                                : formatAddress(festivalData.addr1)}
                        </Locationdetail>
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

                    {/* <Together1>
                        <FontAwesomeIcon
                            icon={faUserGroup}
                            color={"#f97800"}
                            size="2x"
                            style={{ margin: "10px", cursor: "pointer" }}
                            onClick={() => setShowButtons(!showButtons)}
                        />
                        <Together>
                            동행인 <br /> 구하기
                        </Together>
                        {showButtons && (
                            <CompanionButton>
                                <G onClick={Companion}>동행인 찾기</G>{" "}
                                <G onClick={Companion_Write}> 동행인 모집 </G>
                            </CompanionButton>
                        )}
                    </Together1> */}
                </BasicBox>

                <ContentTitle>
                    <BackgroundBar showDetails={showDetails} />
                    <Button
                        onClick={() => setShowDetails(false)}
                        selected={!showDetails}
                    >
                        행사소개
                    </Button>
                    <Button
                        onClick={() => setShowDetails(true)}
                        selected={showDetails}
                    >
                        행사내용
                    </Button>
                </ContentTitle>

                {showDetails ? (
                    <DetailBox
                        dangerouslySetInnerHTML={{ __html: detailInfo }}
                    />
                ) : (
                    <I_Content
                        dangerouslySetInnerHTML={{ __html: getIntroText() }}
                    ></I_Content>
                )}
                <Detail_Nav />
            </Content>

            <br />
        </div>
    );
};

const Navigation = styled.div`
    position: relative;
    min-height: 100vh;
    box-sizing: border-box;
    height: auto;
    overflow-y: auto;
    padding-bottom: 100px;

    @media (max-width: 600px) {
        padding-bottom: 80px;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        padding-bottom: 90px;
    }
`;

const Bottomview = styled.div`
    cursor: pointer;
    width: 100%; /* 모든 화면 크기에 대해 100%를 설정하여 가로 길이를 유동적으로 조정합니다. */
    max-width: 640px; /* 그러나 최대 너비를 640px로 제한하여 큰 화면에서도 적절한 크기를 유지합니다. */
    position: fixed;
    bottom: 0;
    height: 90px;
    background-color: white;

    @media (max-width: 600px) {
        height: 60px; /* 모바일 화면에 대해 높이를 조정합니다. */
        width: 100%;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        height: 70px; /* 태블릿 화면에 대해 높이를 조정합니다. */
    }
`;

const BottomBox = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

const NavBox = styled.div`
    flex: 1; /* flex-grow, flex-shrink, flex-basis 값을 한 번에 지정할 수 있는 속성을 사용하여 요소 간 공간 분배를 조정합니다. */
    font-weight: bold;
    height: 100%;
    border-top: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;

    &:last-child {
        border-right: none; /* 마지막 요소의 오른쪽 테두리를 제거합니다. */
    }

    svg {
        font-size: 32px; // 기본 아이콘 크기 설정
    }

    @media (max-width: 480px) {
        svg {
            font-size: 20px; // 모바일 화면에서 아이콘 크기 조정
        }
    }
`;

const CompanionButton = styled.div`
    display: flex;
    justify-content: space-evenly;
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
    font-weight: 600;
`;

const Tel = styled.div`
    font-size: 15px;
    margin-left: 5px;
    margin-top: -7px;
`;
const Together1 = styled.div`
    font-size: 15px;
    font-weight: 600;
`;
const Together = styled.div`
    font-size: 15px;
    margin-left: 5px;
    margin-top: -7px;
`;
const Day1 = styled.div`
    font-size: 15px;
    font-weight: 600;
`;

const Day = styled.div`
    font-size: 15px;
    margin-left: 5px;
    margin-top: -7px;
    margin-bottom: 10px;
`;
const Location2 = styled.div`
    font-size: 15px;
    font-weight: 600;
`;
const Locationdetail = styled.div`
    white-space: pre-wrap;
    @media (max-width: 400px) {
        max-width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
`;

// 테두리를 위한 스타일을 추가
const BasicBox = styled.div`
    padding: 10px 30px 10px 30px;
    margin: 20px;
    display: flex;
    justify-content: space-between;
    text-align: center;
    //border-bottom: 1px solid #dadada;
    margin-top: -10px;

    @media (max-width: 600px) {
        padding: 10px;
    }
`;

const DetailBox = styled.div`
    border: 2px solid #dadada;
    padding: 25px;
    border-radius: 10px;
    margin-top: 20px;
    width: 500px;
    margin-left: 45px;
    font-weight: bold;
`;

const I_Content = styled.div`
    border: 2px solid #dadada;
    margin-top: 20px;
    padding: 25px;
    border-radius: 10px;

    width: 500px;
    margin-left: 45px;
    font-weight: bold;
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

const Content = styled.div``;

const ImgWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%; // 필요에 따라 조절하실 수 있습니다.
    margin-top: 100px;
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
    display: flex;
    align-items: center;
    justify-content: center; /* 추가: 중앙 정렬을 위한 속성 */
    width: 640px;
    position: fixed;
    top: 0;
    height: 90px;
    background-color: #fff;
    border-bottom: 1px solid #000;
    z-index: 1000;
    button {
        position: absolute; /* 추가: 버튼을 절대 위치로 설정 */
        left: 20px; /* 추가: 버튼을 왼쪽으로 이동 */
    }

    @media (max-width: 640px) {
        width: 100%;
        height: 70px; // 모바일 화면에서 높이 조정
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        height: 80px; // 태블릿 화면에서 높이 조정
    }
`;

const Text = styled.div`
    display: flex;
    font-size: 24px;
    font-weight: bold;
    justify-content: center; /* 추가: 중앙 정렬을 위한 속성 */
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

const G = styled.button`
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
padding: 0.5em 0.5em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-bottom: 10px;
margin-top:10px;
margin-right:10px;

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

`;

export default Festival_detail;
