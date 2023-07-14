import Navigationbar from "../components/Navigationbar";
import {Map, MapMarker} from 'react-kakao-maps-sdk';
import React, {useEffect, useState} from 'react';
// const {kakao}=window;

const Home = () => {
  const [isOpen, setIsOpen] = useState(false)


  
    return (
      <div>
      <Map // 지도를 표시할 Container
      center={{
        // 지도의 중심좌표
        lat: 37.54699,
        lng: 127.09598,
      }}
      style={{
        // 지도의 크기
        width: "100%",
        height: "450px",
      }}
      level={4} // 지도의 확대 레벨
    >
      <MapMarker // 마커를 생성합니다
        position={{
          // 마커가 표시될 위치입니다
          lat: 37.54699,
          lng: 127.09598,
        }}
        image={{
          src: "http://localhost:3000/uploads/1689332410281-20190226_180111.jpg", // 마커이미지의 주소입니다
          size: {
            width: 164,
            height: 169,
          }, // 마커이미지의 크기입니다
          options: {
            offset: {
              x: 27,
              y: 69,
            }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
          },
        }}
      />
    </Map>

        <Navigationbar/>
    </div>
  
    )
};

export default Home;