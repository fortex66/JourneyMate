import Navigationbar from "../components/Navigationbar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  const navigate = useNavigate();
  const handleSearchClick = () => {
    navigate("/Home");
  };

  return (
    <div>
      <Header>
        <FontAwesomeIcon icon={faMagnifyingGlass} size="1x" color={"#f97800"} />
        <SearchInput
          type="text"
          onClick={handleSearchClick}
          placeholder="검색어를 입력하세요"
        />
      </Header>
      <Navigationbar />
    </div>
  );
};

export default Search;

const Header = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  margin-top: 20px;
  height: 70px;
  padding: 0px 16px;
  margin-left: 20px;
  margin-right: 20px;
  border-radius: 8px;
  background-color: rgb(242, 244, 245);
  transition: width 0.25s ease 0s;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 15px;
  border: none;
  padding: 0 10px;
  &:focus {
    outline: none;
  }
`;