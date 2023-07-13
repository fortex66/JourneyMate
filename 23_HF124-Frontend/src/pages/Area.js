//Area.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddressForm() {
  const [addressInput, setAddressInput] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  // const history = useHistory(); // 페이지 이동을 위해 useHistory 훅 사용

  const handleInputChange = (event) => {
    setAddressInput(event.target.value);
  };
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    // 카카오 API를 사용하기 위한 헤더 설정
    const headers = {
      Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
    };
    try {
      const response = await axios.get(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${addressInput}`,
        { headers }
      );

      if (response.status === 200) {
        setAddressList(response.data.documents);
      } else {
        console.error("주소 검색 실패", response.status);
      }
    } catch (error) {
      console.error("주소 검색 에러", error);
    }
  };

  const handleAddressSelect = async (address) => {
    // 선택하시겠습니까? 확인창 추가
    if (window.confirm("선택하시겠습니까?")) {
      setSelectedAddress(address);
      console.log({ selectedAddress: address });

      try {
        const response = await fetch("http://localhost:3000/signup/part2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: address,
          }),
          credentials: "include", //세션값을 함께 날려줘야 다음 파트로 넘어갈때 userID값이 세션에 같이 저장됩니다
        });
        if (response.status === 200) {
          console.log("위치정보 입력 완료");
        } else {
          console.error("위치정보 입력중 문제 발생");
        }
      } catch (error) {
        console.error("위치 정보를 전송하는 도중 문제가 발생했습니다.", error);
      }
    }
  };

  // 다음 버튼을 클릭하면 /Tag 페이지로 이동
  const handleNext = () => {
    if (selectedAddress) {
      navigate("/Tag", { replace: true });
    } else {
      alert("주소를 선택해 주세요.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          주소 검색:
          <input
            type="text"
            value={addressInput}
            onChange={handleInputChange}
          />
        </label>
        <input type="submit" value="주소 검색" />
      </form>
      {selectedAddress && <p>선택한 주소: {selectedAddress}</p>}
      {addressList.length > 0 && (
        <div>
          <h2>주소 목록</h2>
          <ul>
            {addressList.map((address, index) => (
              <li
                key={index}
                onClick={() => handleAddressSelect(address.address_name)}
              >
                {address.address_name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleNext}>다음</button>
    </div>
  );
}

export default AddressForm;
