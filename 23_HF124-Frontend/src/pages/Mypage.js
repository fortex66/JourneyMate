import Modal from "../components/Modal";
import Navigationbar from "../components/Navigationbar";
import React, { useState } from "react";
import "./listForm.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faUser, faScroll } from "@fortawesome/free-solid-svg-icons";

function MyPage() {
  const navigate = useNavigate();
  const [write, setWrite] = useState(false);

  return (
    <div className="Wrap">
      <div className="TMenuBar">
        <p>마이페이지</p>
      </div>
      <div className="topView">
        <div className="ContentsBox">
          <MyInfoBox>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={faUser}
                size="2x"
                color={"#f97800"}
                onClick={() => {
                  navigate("/Profile");
                }}
              />
            </div>
          </MyInfoBox>

          <MyMenuMiddle>
            <div>
              <Circle onClick={() => setWrite(!write)}>
                {write && <Modal closeModal={() => setWrite(!write)}></Modal>}

                <FontAwesomeIcon icon={faPen} size="2x" color={"#f97800"} />
              </Circle>
              글쓰기
            </div>

            <div>
              <Circle
                onClick={() => {
                  navigate("/Scrap");
                }}
              >
                <FontAwesomeIcon icon={faScroll} size="2x" color={"#f97800"} />
              </Circle>
              스크랩
            </div>
          </MyMenuMiddle>
        </div>
      </div>

      <Navigationbar />
    </div>
  );
}

const MyInfoBox = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #dddddd;
  height: 130px;
`;

const MyMenuMiddle = styled.div`
  height: 120px;
  border-bottom: 1px solid #dddddd;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 25px auto;
  text-align: center;
`;

const Circle = styled.div`
  background-color: rgb(254, 237, 229);
  width: 60px;
  height: 60px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

export default MyPage;
