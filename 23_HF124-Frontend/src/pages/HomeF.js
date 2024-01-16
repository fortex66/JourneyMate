import Navigationbar from "../components/Navigationbar";
import {
    Map,
    MapMarker,
    MapInfoWindow,
    MarkerClusterer,
} from "react-kakao-maps-sdk";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSquarePlus,
    faWindowRestore,
    faLocationCrosshairs,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import Cmodal from "../components/Cmodal";
const imgURL = "https://journeymate.s3.ap-northeast-2.amazonaws.com/";

const latChangeByLevel = {
    13: 0.37,
    12: 0.19,
    11: 0.09,
    10: 0.05,
    9: 0.025,
    8: 0.011,
    7: 0.006,
    6: 0.003,
    5: 0.0015,
    4: 0.0007,
    3: 0.00035,
    2: 0.00018,
    1: 0.00009,
};

const Home = () => {
    const [markerData, setMarkerData] = useState(null);
    const [latestMarkers, setLatestMarkers] = useState(null);
    const navigate = useNavigate();
    const [write, setWrite] = useState(false);
    const [isMarkerHovered, setMarkerHovered] = useState(false);
    const [isMarkerClicked, setMarkerClicked] = useState(false);
    const [location, setLocation] = useState({
        center: {
            lat: 36.8,
            lng: 127.5,
        },
        level: 13,
        errMsg: null,
        isLoading: true,
    });
    const markerHoverTimeout = useRef();
    const [currentLevel, setCurrentLevel] = useState(13);
    const handleMouseOverMarker = (marker) => {
        if (markerHoverTimeout.current) {
            clearTimeout(markerHoverTimeout.current);
        }
        setMarkerHovered(marker);
    };
    const handleMouseOutMarker = () => {
        markerHoverTimeout.current = setTimeout(() => {
            setMarkerHovered(null);
        }, 300); // 마우스가 마커 밖으로 벗어났을 때 딜레이를 주는 시간 (ms 단위)
    };
    const handleSearchClick = () => {
        navigate("/Search");
    };

    useEffect(() => {
        return () => {
            if (markerHoverTimeout.current) {
                clearTimeout(markerHoverTimeout.current);
            }
        };
    }, []);
    const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
        const dd = String(today.getDate()).padStart(2, "0");

        return `${yyyy}${mm}${dd}`;
    };

    const currentDate = getTodayDate();
    useEffect(() => {
        const fetchMarkerData = async () => {
            try {
                const response = await fetch(
                    `https://apis.data.go.kr/B551011/KorService1/searchFestival1?numOfRows=2000&MobileOS=ETC&MobileApp=Journeymate&_type=json&arrange=R&eventStartDate=${currentDate}&serviceKey=gjCAjUo72Uf%2BjMwy1BdQo85%2B1vNiWiTVe4X987jUj42meneObLKNI%2F4pAYfK%2BysqF%2FObJvxdZp7Fe4uA6%2FPxKQ%3D%3D`
                );
                const json = await response.json();

                setLatestMarkers(json.response.body.items.item);
                // Group markers by location.
            } catch (err) {
                console.error(err);
            }
        };

        fetchMarkerData(markerData);
    }, []);

    const mylocationClick = () => {
        if (navigator.geolocation) {
            // GeoLocation을 이용해서 접속 위치를 얻어옵니다
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation((prev) => ({
                        ...prev,
                        center: {
                            lat: position.coords.latitude, // 위도
                            lng: position.coords.longitude, // 경도
                        },
                        isLoading: false,
                        level: 5,
                    }));
                },
                (err) => {
                    setLocation({
                        errMsg: err.message,
                        isLoading: false,
                    });
                }
            );
        } else {
            // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
            setLocation({
                errMsg: "geolocation을 사용할수 없어요..",
                isLoading: false,
            });
        }
    };
    const goDetail = (marker) => {
        navigate("/Festival_detail", {
            state: { festivalData: marker },
        });
    };
    return (
        <div>
            <Container>
                <Header>
                    <SearchInput
                        type="text"
                        onClick={handleSearchClick}
                        placeholder="검색"
                    />
                    <IconContainer onClick={() => setWrite(!write)}>
                        {write && (
                            <Cmodal closeModal={() => setWrite(!write)} />
                        )}
                        <FontAwesomeIcon
                            icon={faSquarePlus}
                            size="3x"
                            color={"#f97800"}
                        />
                    </IconContainer>
                </Header>
                <MapContainer>
                    <Map
                        center={location.center}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        level={location.level}
                        maxLevel={13}
                        onZoomChanged={(map) => setCurrentLevel(map.getLevel())} // 지도 줌 변경 시 핸들러 함수
                        onCenterChanged={(map) =>
                            setLocation({
                                level: map.getLevel(),
                                center: {
                                    lat: map.getCenter().getLat(),
                                    lng: map.getCenter().getLng(),
                                },
                            })
                        }
                    >
                        <MarkerClusterer
                            averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
                            minLevel={10} // 클러스터 할 최소 지도 레벨
                        >
                            {latestMarkers &&
                                latestMarkers.map((marker, index) => (
                                    <React.Fragment key={index}>
                                        <MapMarker
                                            position={{
                                                lat: parseFloat(marker.mapy), // API의 y 좌표
                                                lng: parseFloat(marker.mapx), // API의 x 좌표
                                            }}
                                            clickable={true}
                                            onMouseOver={() =>
                                                handleMouseOverMarker(marker)
                                            }
                                            onMouseOut={handleMouseOutMarker}
                                            onClick={() => goDetail(marker)}
                                        />
                                        {isMarkerHovered === marker &&
                                            isMarkerClicked === false && (
                                                <MapInfoWindow
                                                    position={{
                                                        lat:
                                                            parseFloat(
                                                                marker.mapy
                                                            ) +
                                                            latChangeByLevel[
                                                                currentLevel
                                                            ], // latitude 값을 조정하여 정보창을 위로 이동시킵니다.
                                                        lng: parseFloat(
                                                            marker.mapx
                                                        ),
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <img
                                                            src={
                                                                marker.firstimage
                                                            }
                                                            alt={marker.title}
                                                            style={{
                                                                width: "150px",
                                                                height: "100px",
                                                            }}
                                                        />
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                            }}
                                                        >
                                                            {marker.title}
                                                        </p>
                                                    </div>
                                                </MapInfoWindow>
                                            )}
                                    </React.Fragment>
                                ))}
                        </MarkerClusterer>
                    </Map>
                    <MyLocation>
                        <FontAwesomeIcon
                            onClick={() => {
                                mylocationClick();
                            }}
                            icon={faLocationCrosshairs}
                            size="2x"
                            color={"#f97800"}
                        />
                    </MyLocation>

                    <Community>
                        <FontAwesomeIcon
                            onClick={() => navigate("/Home")}
                            icon={faWindowRestore}
                            size="2x"
                            color={"#f97800"}
                        />
                    </Community>
                    <Companion>
                        <FontAwesomeIcon
                            onClick={() => navigate("/HomeC")}
                            icon={faUsers}
                            size="2x"
                            color={"#f97800"}
                        />
                    </Companion>
                </MapContainer>
                <Navigationbar />
            </Container>
        </div>
    );
};
export default Home;
const Companion = styled.div`
    position: absolute;
    left: 10px;
    bottom: 81px;
    z-index: 3;
    margin-bottom: 10px;
    margin-left: 7px;
    padding: 10px;
    border-radius: 8px;
    background-color: white;
    padding-right: 6px;
    padding-left: 6px;
`;

const Container = styled.div`
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100vh;
`;

const Header = styled.div`
    position: absolute;
    z-index: 2;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 0 15px;
    margin-top: 10px;
`;

const SearchInput = styled.input`
    width: 70%;
    height: 40px;
    border-radius: 15px;
    border: none;
    padding: 0 10px;
    &:focus {
        outline: none;
    }
    margin-top: 10px;
`;
const IconContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-right: 10px;
`;

const MapContainer = styled.div`
    position: relative;
    z-index: 1;
    top: 0;
    height: calc(100% - 60px); // 기존에 -90px로 되어있어서 지도와 네비게이션바 사이에 빈공간이 있었습니다.
`;

const MyLocation = styled.div`
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 3;
    margin-bottom: 20px;
    margin-left: 7px;
    padding: 10px;
    border-radius: 8px;
    background-color: white;
`;

const Community = styled.div`
    position: absolute;
    left: 10px;
    bottom: 140px;
    z-index: 3;
    margin-bottom: 10px;
    margin-left: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 10px;
    padding-left: 10px;
    border-radius: 8px;
    background-color: white;
`;
