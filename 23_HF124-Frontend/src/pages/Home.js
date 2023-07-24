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

const Home = () => {
  const [markerUrl, setMarkerUrl] = useState(null);
  const navigate = useNavigate();
  const [write, setWrite] = useState(false);

  const handleSearchClick = () => {
    navigate("/Search");
  };

  // useEffect(() => {
  //   const fetchMarkerImage = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3000/home");
  //       setMarkerUrl(response.data.url);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchMarkerImage();
  // }, []);

  return (
    <Container>
      <Header>
        <SearchInput
          type="text"
          onClick={handleSearchClick}
          placeholder="검색"
        />
        <IconContainer onClick={() => setWrite(!write)}>
          {write && <Modal closeModal={() => setWrite(!write)}></Modal>}
          <FontAwesomeIcon icon={faSquarePlus} size="3x" color={"#f97800"} />
        </IconContainer>
      </Header>
      <MapContainer>
        <Map
          center={{
            lat: 36.8, //세로
            lng: 127.5, //가로
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
          level={13}
          maxLevel={13} //지도화면 더 이상 축소금지
        >
          {markerUrl && (
            <MapMarker
              position={{
                lat: 37.54699,
                lng: 128,
              }}
              image={{
                src: markerUrl,
                size: {
                  width: 164,
                  height: 169,
                },
                options: {
                  offset: {
                    x: 27,
                    y: 69,
                  },
                },
              }}
            />
          )}
          <LocationIcon
            icon={faLocationCrosshairs}
            size="2x"
            color={"#f97800"}
          />
        </Map>
      </MapContainer>
      <Navigationbar />
    </Container>
  );
};

export default Home;

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