import Navigationbar from "../components/Navigationbar";
import {
  Map,
  MapMarker,
  MapInfoWindow,
  MarkerClusterer,
} from "react-kakao-maps-sdk";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faLocationCrosshairs,
} from "@fortawesome/free-solid-svg-icons";
import Cmodal from "../components/Cmodal";
import Nearby from "../components/Nearby";

// NearbyModal 컴포넌트 선언
const NearbyModal = (props) => {
  const { closeModal, marker } = props;
  const [sortType, setSortType] = useState("latest");

  // 정렬 방식 변경 핸들러
  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
  };

  return (
    <NearbyModalStyled>
      <div>
        <button className="close-button" onClick={closeModal}>
          ✖
        </button>
        <div className="sorting-buttons">
          <button onClick={() => handleSortChange("popular")}>인기순</button>
          <button onClick={() => handleSortChange("latest")}>최신순</button>
        </div>
        <Nearby marker={marker} sortType={sortType} />
      </div>
    </NearbyModalStyled>
  );
};

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
  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isMarkerHovered, setMarkerHovered] = useState(false);
  const [isMarkerClicked, setMarkerClicked] = useState(false);

  const markerHoverTimeout = useRef();
  const [currentLevel, setCurrentLevel] = useState(13);
  const handleMouseOverMarker = (marker) => {
    if (markerHoverTimeout.current) {
      clearTimeout(markerHoverTimeout.current);
    }
    setMarkerHovered(marker);
  };
  // const handleZoomChange = (newLevel) => {
  //   setCurrentLevel(newLevel);
  // };
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
  const baseURL = "http://localhost:3000/";
  useEffect(() => {
    const fetchMarkerData = async () => {
      try {
        const response = await axios.get(baseURL + "community/mapimage");
        const markerData = response.data;

        // Group markers by location.
        const markerGroups = markerData.posts.rows.reduce((groups, marker) => {
          const key = `${marker.x},${marker.y}`;
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(marker);
          return groups;
        }, {});

        // For each group, keep only the latest marker.
        const latestMarkers = Object.values(markerGroups).map(
          (group) => group.sort((a, b) => b.createdAt - a.createdAt)[0]
        );

        setMarkerData(markerData);
        setLatestMarkers(latestMarkers);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMarkerData();
  }, []);

  const handleMarkerClick = (marker) => {
    if (markerHoverTimeout.current) {
      clearTimeout(markerHoverTimeout.current);
    }
    setMarkerHovered(null);
    setMarkerClicked(true);
    setSelectedMarker(marker);
    setShowNearbyModal(true);
  };

  const closeNearbyModal = () => {
    setSelectedMarker(null);
    setShowNearbyModal(false);
    setMarkerClicked(false);
    setMarkerHovered(null);
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
            {write && <Cmodal closeModal={() => setWrite(!write)} />}
            <FontAwesomeIcon icon={faSquarePlus} size="3x" color={"#f97800"} />
          </IconContainer>
        </Header>
        <MapContainer>
          <Map
            center={{
              lat: 36.8,
              lng: 127.5,
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
            level={13}
            maxLevel={13}
            onZoomChanged={(map) => setCurrentLevel(map.getLevel())} // 지도 줌 변경 시 핸들러 함수
          >
            <MarkerClusterer
              averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
              minLevel={10} // 클러스터 할 최소 지도 레벨
            >
              {latestMarkers &&
                latestMarkers.map((marker, index) => (
                  <Circle key={index}>
                    <MapMarker
                      position={{
                        lat: marker.y,
                        lng: marker.x,
                      }}
                      clickable={true}
                      onMouseOver={() => handleMouseOverMarker(marker)}
                      onMouseOut={handleMouseOutMarker}
                      onClick={() => handleMarkerClick(marker)}
                    />
                    {isMarkerHovered === marker &&
                      isMarkerClicked === false && (
                        <MapInfoWindow
                          position={{
                            lat: marker.y + latChangeByLevel[currentLevel], // latitude 값을 조정하여 정보창을 위로 이동시킵니다.
                            lng: marker.x,
                          }}
                        >
                          <img
                            src={
                              marker.post_images[0]
                                ? marker.post_images[0].imageURL.replace(
                                    /\\/g,
                                    "/"
                                  )
                                : ""
                            }
                            alt="post"
                            style={{ width: "150px", height: "100px" }}
                          />
                        </MapInfoWindow>
                      )}
                  </Circle>
                ))}
            </MarkerClusterer>
          </Map>
        </MapContainer>
        <Navigationbar />
      </Container>
      {showNearbyModal && selectedMarker && (
        <NearbyModal closeModal={closeNearbyModal} marker={selectedMarker} />
      )}
    </div>
  );
};
export default Home;

const NearbyModalStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  & > div {
    position: relative;
    width: 300px;
    height: 500px;
    padding: 40px;
    text-align: center;
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
  }

  & .close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    border: none;
    color: rgba(0, 0, 0, 0.7);
    background-color: transparent;
    font-size: 20px;

    &:hover {
      cursor: pointer;
    }
  }

  & .sorting-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  & .sorting-buttons > button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    background-color: #f97800;
    color: white;
    font-size: 16px;

    &:hover {
      cursor: pointer;
    }
  }
`;

const Circle = styled.div`
  border-radius: 20px;
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
  height: calc(100% - 90px);
`;

const LocationIcon = styled(FontAwesomeIcon)`
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
