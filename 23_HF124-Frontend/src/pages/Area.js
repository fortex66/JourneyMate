import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddressForm() {
  const [addressInput, setAddressInput] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleInputChange = (event) => {
    setAddressInput(event.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.get(
        `http://localhost:3000/signup/search-address?query=${addressInput}`
      );
  
      if (response.status === 200) {
        setAddressList(response.data);

      } else {
        console.error("주소 검색 실패", response.status);
      }
    } catch (error) {
      console.error("주소 검색 에러", error);
    }
  };

  const handleAddressSelect = async (place_name) => {
    if (window.confirm("선택하시겠습니까?")) {
      setSelectedAddress(place_name);
      console.log({ selectedAddress: place_name });

      try {
        const response = await fetch("http://localhost:3000/signup/part2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: place_name,
          }),
          credentials: "include",
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
          <input type="text" value={addressInput} onChange={handleInputChange} />
        </label>
        <input type="submit" value="주소 검색" />
      </form>
      {selectedAddress && <p>선택한 주소: {selectedAddress}</p>}
      {addressList.length > 0 && (
        <div>
          <h2>주소 목록</h2>
          <ul>
            {addressList.map((place_name, index) => (
              <li key={index} onClick={() => handleAddressSelect(place_name)}>
                {place_name}
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
