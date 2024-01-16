// 0905 Local_Festival 백업 (게시글 2개씩 출력)
import React, { useEffect, useState, useRef, useCallback } from "react";
import Navigationbar from "../components/Navigationbar";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlane,
    faLocationDot,
    faPhone,
} from "@fortawesome/free-solid-svg-icons";

const Local_Festival = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
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

    const location = useLocation();
    const areaCode = location.state ? location.state.AreaData : null;

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
            let url = "";
            url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?numOfRows=10&pageNo=${pageNo}&MobileOS=ETC&MobileApp=Journeymate&_type=json&arrange=R&contentTypeId=15&areaCode=${areaCode}&serviceKey=${OPEN_KEY}`;
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            const json = await response.json();
            const newItems = json.response?.body?.items?.item || [];
            if (pageNo === 1) {
                setData(newItems);
            } else {
                setData((prevData) => [...prevData, ...newItems]);
            }
        } catch (error) {
            console.error("Fetching API failed:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (isSearchButtonClicked || isPageLoaded || pageNo > 1) {
            fetchData();
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
    }, [isSearchButtonClicked, isPageLoaded, pageNo]);

    const getByKeyword = () => {
        setPageNo(1); // 페이지 번호를 1로 리셋
        setIsSearchButtonClicked(true); // 검색 버튼이 눌렸음을 설정
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            setPageNo(1); // 페이지 번호를 1로 리셋
            fetchData(); // 검색 실행
        }
    };
    const goDetail = (info) => {
        navigate("/Festival_detail", {
            state: { festivalData: info },
        });
    };
    const handleModalClose = (e) => {
        if (e.target === e.currentTarget) {
            setShowModal(false);
        }
    };
    return (
        <Container>
            <RealHead>
                <RealButton onClick={() => navigate(-1)}> {"<"}</RealButton>
                <RealTitle onClick={() => navigate("/Home")}>
                    Journeymate{" "}
                    <FontAwesomeIcon
                        icon={faPlane}
                        size="1x"
                        color={"#f97800"}
                    />
                </RealTitle>
            </RealHead>
            <div>
                <Content>
                    {data &&
                        data.map((info, index) => {
                            const address = info.addr1
                                .split(" ")
                                .slice(0, 2)
                                .join(" ");
                            if (data.length === index + 1) {
                                return (
                                    <Box ref={lastPostElementRef} key={index}>
                                        <Back>
                                            <Img
                                                onClick={() => goDetail(info)}
                                                src={info.firstimage}
                                                alt={"사진이 없습니다."}
                                            />
                                            <Title>{info.title}</Title>
                                            <Address>
                                                <FontAwesomeIcon
                                                    icon={faLocationDot}
                                                    color={"#f97800"}
                                                />{" "}
                                                {address}
                                            </Address>
                                        </Back>
                                    </Box>
                                );
                            } else {
                                return (
                                    <Box key={index}>
                                        <Back>
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
                                                <Tel>
                                                    <FontAwesomeIcon
                                                        icon={faPhone}
                                                        color={"#f97800"}
                                                    />{" "}
                                                    {info.tel}
                                                </Tel>
                                            </Info>
                                        </Back>
                                    </Box>
                                );
                            }
                        })}
                </Content>
            </div>

            <Navigationbar />
        </Container>
    );
};
const Address = styled.div`
    font-weight: bold;
    margin-bottom: 8px;
`;
const Tel = styled.div`
    font-weight: ;
    margin-bottom: 8px;
`;
const Info = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 20px;
`;
const RealTitle = styled.div`
    color: #f97800;
    font-size: 30px;
    font-weight: bold; //글짜 굵게
    align-self: center; // 수직 중앙 정렬
    margin-left: 100px;
    margin-top: -5px;
    cursor: pointer;
`;
const RealHead = styled.div`
    display: flex;
    align-items: center; // 수직 중앙 정렬
    //justify-content: space-between; // 수평 간격 동일하게
    
`;
const RealSearch = styled.div`
    align-self: center; // 수직 중앙 정렬
    margin-right: 50px;
    cursor: pointer;
`;

const RealButton = styled.div`  
align-self: center;  // 수직 중앙 정렬
appearance: none;
background-color: transparent;
//border: 2px solid #f97800;
border-radius: 0.6em;
color: #f97800;
cursor: pointer;
align-self: center;
font-size: 20px;
font-family: "Nanum Gothic", sans-serif;
line-height: 1;
margin: 20px;
padding: 0.6em 1.5em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
width:10px;
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
const Title = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200px;
`;

const Img = styled.img`
    width: 200px;
    height: 300px;
    object-fit: cover;
    cursor: pointer;
    margin-left: 30px;
    margin-bottom: 10px;
    border-radius: 10px;
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
    margin-top: px;
    margin-left: 25px;
`;

const Box = styled.div`
    margin-top: 20px;
    width: 100%;
`;
/**
 * const Box = styled.div`
  flex-basis: calc(33.333% - 40px); // 33.333% 너비에서 마진 40px 제외
  margin: 20px; // 원하는 마진
  border-radius: 30px;
`;

 */
const Local = styled.div`
    display: flex; // 오타 수정
    justify-content: center;
    align-items: center; // 추가
`;

const Keyword = styled.div`
    display: flex; // 오타 수정
    justify-content: center;
    align-items: center; // 추가
`;

const ModalContent = styled.div`
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap; // 각 지역의 버튼이 뜰 때 한 줄에 3개씩 뜨도록 설정
    justify-content: center; // 가운데 정렬
    gap: 10px; // 버튼 간의 간격
`;
const Button1 = styled.button`
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
padding: 0.8em 1em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-top: 10px;
margin-left:5px;
width:5px;
&:hover,
&:focus {
  color: #fff;
  outline: 0;
}
transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
&:hover {
  box-shadow: 0 0 40px 40px #f97800 inset;
}


}
`;
const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;

    .modal {
        display: flex;
        flex-wrap: wrap; // Wrap items
        justify-content: space-around; // Distribute items
        background-color: white; // Set the background to white
        padding: 20px; // Add some padding
        border-radius: 10px; // Optional, if you want to round corners
    }

    .modal > button {
        flex-basis: calc(
            33.333% - 10px
        ); // Take up 1/3 of container width, accounting for 10px gap
        margin: 5px; // Add margin for visual separation
    }
`;

const Button = styled.button`
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
padding: 0.8em 1em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-top: 10px;
margin-left:5px;

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

const Container = styled.div`
    position: relative;
    width: 100%;
`;

const Header = styled.div`
    justify-content: space-evenly;
    align-items: center;
    width: 640px;

    position: fixed;
    top: 0;
    height: 90px;
    background-color: #fff;
    border-bottom: 1px solid;
    padding-bottom: 30px; // 또는 원하는 크기로 설정
    z-index: 1; // Bring the header to the front
`;

const SearchInput = styled.input`
    width: 70%;
    height: 40px;
    border-radius: 15px;
    border: 1px solid #dadde0;
    //padding: 0 10px;
    margin-left: 15px;
    &:focus {
        outline: none;
    }
    margin-top: 10px;
    pointer-events: auto;
`;
const SearchInput1 = styled.input`
    width: 60%;
    height: 40px;
    border-radius: 15px;
    border: 1px solid #dadde0;
    //padding: 0 10px;
    &:focus {
        outline: none;
    }
    margin-top: 10px;
    pointer-events: auto;
    margin-left: 18px;
    width: 445px;
`;

export default Local_Festival;
