import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Community_Header = () => {
  const navigate = useNavigate();

  return (
    <header>
      <div>
        <input name="title" placeholder="검색" />
        <button
          className={"MyButton"}
          onClick={() => navigate("/Community_Write")}
        >
          글쓰기
        </button>
      </div>
    </header>
  );
};

const header = styled`

`

export default Community_Header;
