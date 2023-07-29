import Navigationbar from "../components/Navigationbar";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faLocationCrosshairs,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";
import Nearby from "../components/NearbyPage";

// NearbyModal 컴포넌트 선언
const NearbyModal = (props) => {
  const { closeModal, marker } = props;

  // 정렬 방식 변경 핸들러
  const handleSortChange = (sortType) => {
    console.log(`Sorting by ${sortType}`);
    // TODO: 이곳에서 실제로 게시글 정렬을 수행합니다.
  };

  return (
    <NearbyModalStyled>
      <div>
        <button className="close-button" onClick={closeModal}>✖</button>
        <div className="sorting-buttons">
          <button onClick={() => handleSortChange("popular")}>인기순</button>
          <button onClick={() => handleSortChange("recent")}>최신순</button>
        </div>
        <Nearby marker={marker} />
      </div>
    </NearbyModalStyled>
  );
};

const Home = () => {
  const [markerData, setMarkerData] = useState(null);
  const [latestMarkers, setLatestMarkers] = useState(null);
  const navigate = useNavigate();
  const [write, setWrite] = useState(false);
  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleSearchClick = () => {
    navigate("/Search");
  };

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
    setSelectedMarker(marker);
    setShowNearbyModal(true);
  };

  const closeNearbyModal = () => {
    setSelectedMarker(null);
    setShowNearbyModal(false);
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
            {write && <Modal closeModal={() => setWrite(!write)} />}
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
          >
            {latestMarkers &&
              latestMarkers.map((marker, index) => (
                <Circle>
                  <MapMarker
                    key={index}
                    position={{
                      lat: marker.y,
                      lng: marker.x,
                    }}
                    image={{
                      src: marker.post_images[0]
                        ? marker.post_images[0].imageURL.replace(/\\/g, "/")
                        : "",
                      size: {
                        width: 50,
                        height: 50,
                      },
                      options: {
                        offset: {
                          x: 27,
                          y: 69,
                        },
                      },
                    }}
                    onClick={() => handleMarkerClick(marker)}
                  />
                </Circle>
              ))}
            <LocationIcon
              icon={faLocationCrosshairs}
              size="2x"
              color={"#f97800"}
            />
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