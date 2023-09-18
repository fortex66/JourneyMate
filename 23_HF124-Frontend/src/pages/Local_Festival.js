// 무한스크롤 css 날짜까지 추가
import React, { useEffect, useState, useRef, useCallback } from "react";
import Navigationbar from "../components/Navigationbar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass,
    faPlane,
    faChevronLeft,
    faChevronRight,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import seoul from "../images/seoul.jpg";

import incheon from "../images/incheon.jpg";

import daejeon from "../images/daejeon.jpg";
import daegu from "../images/daegu.jpg";
import busan from "../images/busan.jpg";
import chungcheongbukdo from "../images/chungcheongbukdo.jpg";
import chungcheongnamdo from "../images/chungcheongnamdo.jpg";
import gangwondo from "../images/gangwondo.jpg";
import gyeonggido from "../images/gyeonggido.jpg";
import gyeongsangbukdo from "../images/gyeongsangbukdo.jpg";
import gyeongsangnamdo from "../images/gyeongsangnamdo.jpg";
import jejudo from "../images/jejudo.jpg";
import jeonrabukdo from "../images/jeonrabukdo.jpg";
import jeonranamdo from "../images/jeonranamdo.jpg";
import ulsan from "../images/ulsan.jpg";
import sejong from "../images/sejong.jpg";
import gwangju from "../images/gwangju.jpg";
import journeymatelogo from "../images/journeymatelogo.png";

const Local_Festival = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState(""); // 검색어 상태 추가
    const [showModal, setShowModal] = useState(false); // 모달 보이기 상태
    const [selectedRegion, setSelectedRegion] = useState(""); // 선택된 지역 상태
    //최대날짜 지정용 변수
    const [maxDate, setMaxDate] = useState("");
    const [pageNo, setPageNo] = useState(1); // 페이지 번호 상태 추가
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
    const observer = useRef(); // IntersectionObserver를 위한 ref
    const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false); // 검색 버튼이 눌렸는지 확인하는 상태
    const [isPageLoaded, setIsPageLoaded] = useState(true); // 페이지 로딩 확인용 상태
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });
    const [contentMode, setContentMode] = useState("regular");
    const areaCodes = {
        서울: 1,
        인천: 2,
        대전: 3,
        대구: 4,
        광주: 5,
        부산: 6,
        울산: 7,
        세종특별자치시: 8,
        경기도: 31,
        강원특별자치도: 32,
        충청북도: 33,
        충청남도: 34,
        경상북도: 35,
        경상남도: 36,
        전라북도: 37,
        전라남도: 38,
        제주도: 39,
    };
    // 페이지가 로드될 때 스크롤을 맨 위로 이동
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const lastPostElementRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    setPageNo((prevPageNo) => prevPageNo + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading]
    ); // 마지막에 isLoading을 dependency로 추가

    const OPEN_KEY =
        "gjCAjUo72Uf%2BjMwy1BdQo85%2B1vNiWiTVe4X987jUj42meneObLKNI%2F4pAYfK%2BysqF%2FObJvxdZp7Fe4uA6%2FPxKQ%3D%3D";

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const realkeyword = encodeURIComponent(searchKeyword);
            let url = "";

            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            const maxDate = `${year}${month}${day}`;

            url = `https://apis.data.go.kr/B551011/KorService1/searchFestival1?numOfRows=20&pageNo=${pageNo}&MobileOS=ETC&MobileApp=Journeymate&_type=json&arrange=R&eventStartDate=${maxDate}&serviceKey=${OPEN_KEY}`;

            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            const json = await response.json();
            const newItems = json.response?.body?.items?.item || [];
            setData((prevData) => [...prevData, ...newItems]); // 이 부분 확인
            setIsLoading(false);
        } catch (error) {
            console.error("Fetching API failed:", error);
        }
    };

    const nearFetchData = async () => {
        setIsLoading(true);
        try {
            if (location.latitude && location.longitude) {
                let url = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?numOfRows=1000&MobileOS=ETC&MobileApp=Journeymate&_type=json&arrange=R&mapX=${location.longitude}&mapY=${location.latitude}&radius=40000&contentTypeId=15&serviceKey=${OPEN_KEY}
        `;

                const response = await fetch(url);
                if (!response.ok)
                    throw new Error(`HTTP error! Status: ${response.status}`);

                const json = await response.json();
                const newItems = json.response?.body?.items?.item || [];
                setData2((prevData) => [...prevData, ...newItems]);
                setIsLoading(false);
            } else {
                console.error("Location data is not available");
            }
        } catch (error) {
            console.error("Fetching API failed:", error);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (isPageLoaded || pageNo > 1) {
            fetchData();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    () => console.error("Unable to retrieve your location")
                );
            }
        }
        if (isSearchButtonClicked) {
            setIsSearchButtonClicked(false); // 다시 false로 설정
        }
        if (isPageLoaded) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            const maxDate = `${year}${month}${day}`;
            setMaxDate(maxDate);
            setIsPageLoaded(false); // 다시 false로 설정
        }
    }, [isPageLoaded, pageNo]);
    const handleNearClick = () => {
        nearFetchData();
        setContentMode("near");
    };

    // '최신순' 버튼 클릭 핸들러
    const handleRecentClick = () => {
        fetchData();
        setContentMode("regular");
    };
    const goDetail = (info) => {
        navigate("/Festival_detail", {
            state: { festivalData: info },
        });
    };
    const goArea = (areaName) => {
        const areaCode = areaCodes[areaName];
        if (areaCode) {
            navigate("/Area_Festival", {
                state: { AreaData: areaCode },
            });
        } else {
            console.error("Invalid area name");
        }
    };

    function formatDate(dateString) {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);

        return `${year}.${month}.${day}`;
    }

    const areaRef = useRef(null);

    const scrollLeft = () => {
        if (areaRef.current) {
            areaRef.current.scrollBy({ left: -100, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (areaRef.current) {
            areaRef.current.scrollBy({ left: 100, behavior: "smooth" });
        }
    };
    return (
        <Container>
            <RealHead>
              
                <RealTitle onClick={() => navigate("/Home")}>
                    Journeymate{" "}
                    <FontAwesomeIcon
                        icon={faPlane}
                        size="1x"
                        color={"#f97800"}
                    />
                </RealTitle>
                <RealSearch>
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        size="2x"
                        color={"#f97800"}
                        onClick={() => navigate("/Area_Search")}
                    />
                </RealSearch>
            </RealHead>
            <MainContainer>
                <Area>
                    <StyledIcon icon={faChevronLeft} onClick={scrollLeft} style={{ marginRight: "10px" }}/>
                    <Area1 ref={areaRef}>
                        <Seoul onClick={() => goArea("서울")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={seoul}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>서울</AreaTitle>
                        </Seoul>
                        <Incheon onClick={() => goArea("인천")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={incheon}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>인천</AreaTitle>
                        </Incheon>
                        <Daejeon onClick={() => goArea("대전")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={daejeon}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>대전</AreaTitle>
                        </Daejeon>
                        <Daegu onClick={() => goArea("대구")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={daegu}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>대구</AreaTitle>
                        </Daegu>
                        <Gwangju onClick={() => goArea("광주")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={gwangju}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>광주</AreaTitle>
                        </Gwangju>
                        <Busan onClick={() => goArea("부산")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={busan}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>부산</AreaTitle>
                        </Busan>
                        <Ulsan onClick={() => goArea("울산")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={ulsan}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>울산</AreaTitle>
                        </Ulsan>
                        <Sejong onClick={() => goArea("세종특별자치시")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={sejong}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>세종</AreaTitle>
                        </Sejong>{" "}
                        <Gyeonggido onClick={() => goArea("경기도")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={gyeonggido}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>경기도</AreaTitle>
                        </Gyeonggido>
                        <Gangwondo onClick={() => goArea("강원특별자치도")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={gangwondo}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>강원도</AreaTitle>
                        </Gangwondo>
                        <Chungcheongbukdo onClick={() => goArea("충청북도")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={chungcheongbukdo}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>충청북도</AreaTitle>
                        </Chungcheongbukdo>
                        <Chungcheongnamdo onClick={() => goArea("충청남도")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={chungcheongnamdo}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>충청남도</AreaTitle>
                        </Chungcheongnamdo>
                        <Gyeongsangbukdo onClick={() => goArea("경상북도")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={gyeongsangbukdo}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>경상북도</AreaTitle>
                        </Gyeongsangbukdo>
                        <Gyeongsangnamdo onClick={() => goArea("경상남도")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={gyeongsangnamdo}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>경상남도</AreaTitle>
                        </Gyeongsangnamdo>
                        <Jeonrabukdo onClick={() => goArea("전라북도")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={jeonrabukdo}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>전라북도</AreaTitle>
                        </Jeonrabukdo>
                        <Jeonranamdo onClick={() => goArea("전라남도")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={jeonranamdo}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>전라남도</AreaTitle>
                        </Jeonranamdo>
                        <Jejudo onClick={() => goArea("제주도")}>
                            {" "}
                            <AreaCircle>
                                <img
                                    src={jejudo}
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            </AreaCircle>
                            <AreaTitle>제주도</AreaTitle>
                        </Jejudo>
                    </Area1>
                    <StyledIcon icon={faChevronRight} onClick={scrollRight} />
                </Area>

                <NewContent>
                    {data &&
                        data.slice(0, 10).map((info, index) => {
                            const address = info.addr1
                                .split(" ")
                                .slice(0, 2)
                                .join(" ");
                            if (data.length === index + 1) {
                                return (
                                    <Box ref={lastPostElementRef} key={index}>
                                        <NewBack>
                                            <NewImg
                                                onClick={() => goDetail(info)}
                                                src={info.firstimage}
                                                alt={"사진이 없습니다."}
                                            />
                                            <Title>{info.title}</Title>
                                            <Address>{address}</Address>
                                        </NewBack>
                                    </Box>
                                );
                            } else {
                                return (
                                    <Box key={index}>
                                        <NewBack>
                                            <NewImg
                                                onClick={() => goDetail(info)}
                                                src={info.firstimage}
                                                alt={"사진이 없습니다."}
                                            />
                                            <NewAddress>{address}</NewAddress>
                                            <NewTitle>{info.title}</NewTitle>
                                            <NewDate>
                                                {formatDate(
                                                    info.eventstartdate
                                                )}
                                            </NewDate>
                                        </NewBack>
                                    </Box>
                                );
                            }
                        })}
                </NewContent>

                <GatherButton>
                    <NearButton onClick={handleNearClick}>내주변</NearButton>
                    <NearButton onClick={handleRecentClick}>최신순</NearButton>
                </GatherButton>
                {contentMode === "regular" ? (
                    <Content>
                        {data &&
                            data.slice(10).map((info, index) => {
                                const address = info.addr1
                                    .split(" ")
                                    .slice(0, 2)
                                    .join(" ");
                                if (data.length === index + 11) {
                                    return (
                                        <ContentBox
                                            ref={lastPostElementRef}
                                            key={index}
                                        >
                                            <Img
                                                onClick={() => goDetail(info)}
                                                src={info.firstimage}
                                                alt={"사진이 없습니다."}
                                            />
                                            <Info>
                                                <Title>{info.title}</Title>
                                                <Address>
                                                    <FontAwesomeIcon
                                                        icon={faLocationDot}
                                                        color={"#f97800"}
                                                    />{" "}
                                                    {address}
                                                </Address>
                                                <FontAwesomeIcon
                                                    icon={faLocationDot}
                                                />
                                                <EventDate>
                                                    {info.eventstartdate
                                                        ? formatDate(
                                                              info.eventstartdate
                                                          )
                                                        : ""}
                                                </EventDate>
                                            </Info>
                                        </ContentBox>
                                    );
                                } else {
                                    return (
                                        <ContentBox key={index}>
                                            <Back>
                                                {" "}
                                                <Img
                                                    onClick={() =>
                                                        goDetail(info)
                                                    }
                                                    src={info.firstimage}
                                                    alt={"사진이 없습니다."}
                                                />
                                                <Info>
                                                    {" "}
                                                    <Title>{info.title}</Title>
                                                    <Address>
                                                        <FontAwesomeIcon
                                                            icon={faLocationDot}
                                                            color={"#f97800"}
                                                        />{" "}
                                                        {address}
                                                    </Address>
                                                    <EventDate>
                                                        {info.eventstartdate
                                                            ? formatDate(
                                                                  info.eventstartdate
                                                              )
                                                            : ""}
                                                    </EventDate>
                                                </Info>
                                            </Back>
                                        </ContentBox>
                                    );
                                }
                            })}
                    </Content>
                ) : (
                    <NearContent>
                        {data2 &&
                            data2.map((info, index) => {
                                const address = info.addr1
                                    .split(" ")
                                    .slice(0, 2)
                                    .join(" ");
                                if (data.length === index + 1) {
                                    return (
                                        <ContentBox
                                            ref={lastPostElementRef}
                                            key={index}
                                        >
                                            <Img
                                                onClick={() => goDetail(info)}
                                                src={info.firstimage}
                                                alt={"사진이 없습니다."}
                                            />
                                            <Info>
                                                <Title>{info.title}</Title>
                                                <Address>
                                                    <FontAwesomeIcon
                                                        icon={faLocationDot}
                                                        color={"#f97800"}
                                                    />{" "}
                                                    {address}
                                                </Address>

                                                <EventDate>
                                                    {info.eventstartdate
                                                        ? formatDate(
                                                              info.eventstartdate
                                                          )
                                                        : ""}
                                                </EventDate>
                                            </Info>
                                        </ContentBox>
                                    );
                                } else {
                                    return (
                                        <ContentBox key={index}>
                                            <Back>
                                                {" "}
                                                <Img
                                                    onClick={() =>
                                                        goDetail(info)
                                                    }
                                                    src={info.firstimage}
                                                    alt={"사진이 없습니다."}
                                                />
                                                <Info>
                                                    {" "}
                                                    <Title>{info.title}</Title>
                                                    <Address>
                                                        <FontAwesomeIcon
                                                            icon={faLocationDot}
                                                            color={"#f97800"}
                                                        />{" "}
                                                        {address}
                                                    </Address>
                                                    <EventDate>
                                                        {info.eventstartdate
                                                            ? formatDate(
                                                                  info.eventstartdate
                                                              )
                                                            : ""}
                                                    </EventDate>
                                                </Info>
                                            </Back>
                                        </ContentBox>
                                    );
                                }
                            })}
                    </NearContent>
                )}
            </MainContainer>

            <Navigationbar />
        </Container>
    );
};

const Container = styled.div`
    position: relative;
    width: 100%;
`;



const RealHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end	;
    width: 640px;
    position: fixed;
    top: 0;
    height: 90px;
    background-color: #fff;
    z-index: 1000;

    @media (max-width: 440px) {
        width: 100%;
        height: 70px;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        height: 80px;
    }
`;

const RealTitle = styled.div`
    color: #f97800;
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    @media (max-width: 480px) {
        font-size: 25px;
    }
`;

const RealSearch = styled.div`
    cursor: pointer;
    margin-right: 20px;
    
    @media (max-width: 480px) {
        margin-right: 8px;
    }
`;


const MainContainer = styled.div`
    margin-right: 20px;
    margin-left: 20px;
    margin-top: 100px;

    @media (max-width: 440px) {
        margin-right: 20px;
        margin-left: 20px;
        margin-top: 70px;
        padding-top: 10px;
    }
`;
const GatherButton = styled.div`
    display: flex;
    justify-content: center;
`;

const NearButton = styled.button`
align-self: center;  // 수직 중앙 정렬
appearance: none;
background-color: transparent;
border: 2px solid #ffffff;
border-radius: 0.6em;
color: #f97800;
cursor: pointer;
align-self: center;
font-size: 20px;
font-family: "Nanum Gothic", sans-serif;
line-height: 1;
margin: 20px 50px 20px 50px;
padding: 0.6em 1em;//세로 가로 
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
`;
const StyledIcon = styled(FontAwesomeIcon)`
    color: #f97800;
    font-size: 24px;
    cursor: pointer;
    margin-top: 25px;
    &:hover {
        color: #f99000;
    }
`;

const Area1 = styled.div`
    display: flex;
    justify-content: space-between;
    //width: 90%;

    overflow-x: auto; /* 가로 스크롤을 유지 */
    //overflow-y: hidden; /* 세로 스크롤을 숨김 */

    /* 스크롤 바를 숨기는 스타일 */
    &::-webkit-scrollbar {
        display: none;
    }

    /* Firefox */
    scrollbar-width: none;
`;

const AreaCircle = styled.div`
    background-color: rgb(254, 237, 229);
    width: 65px;
    height: 65px;
    border-radius: 80%;
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
const Area = styled.div`
    display: flex;
`;
const Seoul = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Incheon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Daejeon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Daegu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Gwangju = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Busan = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Ulsan = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Sejong = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Gyeonggido = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Gangwondo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Chungcheongbukdo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Chungcheongnamdo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Gyeongsangbukdo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Gyeongsangnamdo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Jeonrabukdo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Jeonranamdo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
`;
const Jejudo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const AreaTitle = styled.div`
    //text-align: center;
    font-size: 15px;
    //font-weight: bold;
`;

const AreaText = styled.div`
    font-weight: bold;
    margin-bottom: 10px;
`;
const NewTitle = styled.div`
    font-size: 20px;
    font-weight: bold;

    margin-bottom: 30px;
    width: 100%;
    text-align: center; // 기본은 중앙정렬
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
const NewDate = styled.div`
    display: flex;
    justify-content: center;
    margin-top: -18px;
    font-size: 12px;
    font-weight: ;
    margin-bottom: 10px;
`;
const NewAddress = styled.div`
    display: flex;
    justify-content: center;
    margin-top: -18px;
    font-size: 14px;
    font-weight: ;
`;
const NewBack = styled.div`
    @media (max-width: 600px) {
        width: 300px;
        margin-right: 10px;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        width: 300px;
        margin-left: 100px;
    }

    @media (min-width: 1201px) {
        width: 300px;
        margin-left: 100px;
    }
`;

const NewImg = styled.img`
    display: flex;
    justify-content: center;
    align-items: center;
    //padding-bottom: 10px;
    margin-bottom: 10px;
    width: 300px; /* 가로 너비를 고정합니다 */
    height: 400px; /* 비율에 맞게 높이를 자동으로 설정합니다 */
    object-fit: cover; /* 이미지가 부모 요소를 완전히 덮도록 설정하되 비율은 유지합니다 */
    cursor: pointer;
    margin-right: 40px;
    border-radius: 10px;
    margin-bottom: 20px;
`;
const NewContent = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  &::before, &::after {
    content: "";
    flex: 0 0 auto;
    width: 50px; /* Adjust to your needs */
    height: 100%;
  }
  /* Webkit Scrollbar styling */

  /* 설정된 높이는 수직 스크롤바의 두께를 조절합니다. */
  &::-webkit-scrollbar {
    height: 12px;
  }

  /* 스크롤바의 배경(트랙)에 색상을 적용합니다. */
  &::-webkit-scrollbar-track {
    background:white
    //background: #ffdab9;
    width: 100px;
  }

  /* 스크롤바의 실제 '움직이는 부분'(썸)에 대한 스타일을 적용합니다. */
  &::-webkit-scrollbar-thumb {
    background: #ffdab9;
    border-radius: 10px; /* 스크롤바의 모서리를 둥글게 만듭니다. */
    height: 20%; /* 스크롤바 썸의 높이를 트랙 높이의 20%로 설정 */
    margin: 60% 0; /* 스크롤바 썸을 아래쪽으로 이동시키기 위해 위쪽 마진을 더 크게 설정 */
  }

  /* 사용자가 스크롤바를 마우스로 호버할 때의 스타일을 적용합니다. */
  &::-webkit-scrollbar-thumb:hover {
    background: #f97800;

  }
`;




const Img = styled.img`
    object-fit: cover;
    cursor: pointer;
    margin-left: 30px;
    margin-bottom: 10px;
    border-radius: 10px;

    @media (max-width: 600px) {
        width: 100px;
        height: 200px; // 모바일 화면에서의 세로 크기
        margin-left: -30px;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        width: 200px;
        height: 300px;
    }

    @media (min-width: 1201px) {
        width: 200px;
        height: 300px;
    }
`;
const Back = styled.div`
    display: flex;
    width: 450px;
    margin-left: 30px;
    margin-bottom: 20px;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
`;

const NearContent = styled.div`
    display: flex;
    flex-direction: column;
    //margin-top: 100px;
    margin-left: 25px;
`;
const Box = styled.div`
    @media (max-width: 600px) {
        margin-top: 20px;
        width: 100%;
        margin-right: 10px;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        margin-top: 20px;
        width: 100%;
        
    }

    @media (min-width: 1201px) {
        margin-top: 20px;
        width: 100%;
      
    }
`;

const ContentBox = styled.div`
    @media (max-width: 600px) {
        margin-top: 20px;
        width: 100%;
        margin-left: 20px;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        margin-top: 20px;
        width: 100%;
        margin-left: 0px;
    }

    @media (min-width: 1201px) {
        margin-top: 20px;
        width: 100%;
        margin-left: 0px;
    }
`;
/**
 * const Box = styled.div`
  flex-basis: calc(33.333% - 40px); // 33.333% 너비에서 마진 40px 제외!
  margin: 20px; // 원하는 마진
  border-radius: 30px;
`;

 */

const Title = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 600px) {
        width: 200px;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        width: 300px;
    }

    @media (min-width: 1201px) {
        width: 300px;
    }
`;
const Address = styled.div`
    font-weight: bold;
    margin-bottom: 8px;
`;
const Info = styled.div`
    display: flex;
    flex-direction: column;

    @media (max-width: 600px) {
        margin-left: 20px;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        margin-left: 40px;
    }

    @media (min-width: 1201px) {
        margin-left: 40px;
    }
`;
const EventDate = styled.div`
    margin-bottom: 8px;
`;

export default Local_Festival;
