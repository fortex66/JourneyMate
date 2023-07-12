import React from "react";
import { useNavigate } from "react-router-dom";

function Modal(props) {
  function closeModal() {
    props.closeModal();
  }

  const navigate = useNavigate();
  return (
    <div>
      <div className="Modal" onClick={closeModal}>
        <div className="modalBody" onClick={(e) => e.stopPropagation()}>
          <button
            className="Cummunity_write"
            onClick={() => navigate("/Community_Write")}
          >
            커뮤니티 글쓰기
          </button>
          <button
            className="Companion_write"
            onClick={() => navigate("/Companion_Write")}
          >
            동행인 글쓰기
          </button>
          <button id="modalCloseBtn" onClick={closeModal}>
            ✖
          </button>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
