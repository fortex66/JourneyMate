//Community_Search.js
import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navigationbar from "../components/Navigationbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";

axios.defaults.withCredentials = true;
const baseURL = "http://localhost:3000/";
const Community_Search = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    //const [title, setTitle] = useState([]);
    const [searchTriggered, setSearchTriggered] = useState(true); //Community에 searchTriggered값을 true로
    //날려서 검색 useeffect가 실행되게 하기 위함

    const [inputValue, setInputValue] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("");

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [tags, setTags] = useState([]);

    // 하나라도 입력을 하였는지 여부를 조사하기 위한 로직
    const isAnyFieldFilled = title || location || tags.length > 0;

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
    };

    const handleInputKeyPress = (e) => {
        if (e.key === "Enter") {
            if (selectedFilter === "title") setTitle(inputValue);
            if (selectedFilter === "location") setLocation(inputValue);
            if (selectedFilter === "tag") setTags([...tags, inputValue]);

            setInputValue("");
        }
    };

    const handleTagDelete = (index) => {
        setTags(tags.filter((_, idx) => idx !== index));
    };

    // 서버로 전송하는 부분
    const handleCompleteBtnClick = async () => {
        try {
            const response = await axios.get(
                `${baseURL}community/searchcount`,
                {
                    params: {
                        location: location === "" ? "empty" : location,
                    },
                }
            );

            if (response.status === 200) {
                return true; // Return true on success
            } else {
                console.error("Failed to update search count", response.status);
                return false; // Return false on failure
            }
        } catch (error) {
            console.error(
                "An error occurred while updating search count",
                error
            );
            return false; // Return false on error
        }
    };

    return (
        <div>
            <Navigation>
                <Header>
                    <div className="left">
                        <button
                            className="back_btn"
                            onClick={() => navigate(-1)}
                        >
                            {"<"}
                        </button>
                    </div>
                    <Title>맞춤찾기</Title>
                    <div className="right"></div>
                </Header>
            </Navigation>

            <Info>
                <Filter>
                    <TitleSelect
                        onClick={() => handleFilterClick("title")}
                        selected={selectedFilter === "title"}
                    >
                        제목
                    </TitleSelect>
                    <LocationSelect
                        onClick={() => handleFilterClick("location")}
                        selected={selectedFilter === "location"}
                    >
                        위치
                    </LocationSelect>
                    <TagSelect
                        onClick={() => handleFilterClick("tag")}
                        selected={selectedFilter === "tag"}
                    >
                        태그
                    </TagSelect>
                </Filter>
                <InputWrapper>
                    <SearchIcon icon={faMagnifyingGlass} />
                    <TotalInput
                        placeholder="검색 입력"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleInputKeyPress}
                    />
                </InputWrapper>
                <MainContainer>
                    <MainTitle>
                        필터 목록 &nbsp;
                        <FontAwesomeIcon icon={faFilter} />
                    </MainTitle>
                    {title && (
                        <TitleContainer>
                            <TitleName>제목</TitleName>
                            <TitleContent>
                                {title}
                                {title && (
                                    <DeleteButton onClick={() => setTitle("")}>
                                        x
                                    </DeleteButton>
                                )}
                            </TitleContent>
                        </TitleContainer>
                    )}

                    {location && (
                        <LocationContainer>
                            <LocationName>위치</LocationName>
                            <LocationContent>
                                {location}
                                {location && (
                                    <DeleteButton
                                        onClick={() => setLocation("")}
                                    >
                                        x
                                    </DeleteButton>
                                )}
                            </LocationContent>
                        </LocationContainer>
                    )}

                    {tags.length > 0 && (
                        <TagContainer>
                            <TagName>태그</TagName>
                            <TagList>
                                {tags.map((tag, index) => (
                                    <TagItem key={index}>
                                        {tag}
                                        <DeleteButton
                                            onClick={() =>
                                                handleTagDelete(index)
                                            }
                                        >
                                            x
                                        </DeleteButton>
                                    </TagItem>
                                ))}
                            </TagList>
                        </TagContainer>
                    )}
                </MainContainer>
            </Info>
            <Button isAnyFieldFilled={isAnyFieldFilled}>
                <button
                    className="complete_btn"
                    onClick={async () => {
                        const isSuccess = await handleCompleteBtnClick();
                        if (isSuccess) {
                            navigate("/Community", {
                                state: {
                                    posts,
                                    title,
                                    location: location,
                                    searchTriggered,
                                    tagList: tags,
                                },
                            });
                        }
                    }}
                >
                    찾기
                </button>
            </Button>
            <Navigationbar />
        </div>
    );
};

export default Community_Search;

const Button = styled.div`
    display: flex;
    justify-content: center;
    padding-top: 20px;

    button.complete_btn {
        height: 40px;
        border: none;
        border-radius: 10px;
        background-color: ${({ isAnyFieldFilled }) =>
            isAnyFieldFilled ? "#f97800" : "#787878"};
        color: white;
        font-size: 15px;
        cursor: pointer;

        &:hover {
            box-shadow: ${({ isAnyFieldFilled }) =>
                isAnyFieldFilled ? "0 0 40px 40px #f97800 inset" : "none"};
        }
    }
`;

const Title = styled.div`
    color: #f97800;
    font-size: 24px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Navigation = styled.div`
    position: relative;
    box-sizing: border-box;
    height: auto;
    overflow-y: auto;
`;

const Header = styled.div`
    position: fixed;
    top: 0;
    width: 640px;
    height: 70px;
    z-index: 100; // Optional: ensure the header is always on top
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dadada;
    background-color: white;

    .left,
    .right {
        width: 100px; // 이 값을 조절해서 버튼과 타이틀 사이의 간격을 변경할 수 있습니다.
    }

    button {
        box-sizing: border-box;
        appearance: none;
        background-color: transparent;
        border: 2px solid #f97800;
        border-radius: 0.6em;
        color: #f97800;
        cursor: pointer;
        align-self: center;
        font-size: 16px;
        font-family: "Nanum Gothic", sans-serif;
        line-height: 1;
        margin: 20px;
        padding: 0.6em 2em;
        text-decoration: none;
        letter-spacing: 2px;
        font-weight: 700;

        &:hover,
        &:focus {
            color: #fff;
            outline: 0;
        }
        transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
        &:hover {
            box-shadow: 0 0 40px 40px #f97800 inset;
        }

        &:focus:not(:hover) {
            color: #f97800;
            box-shadow: none;
        }
    }
    button.back_btn {
        padding: 0.6em 1em;
    }
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 80px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgb(234, 235, 239);
`;

const Filter = styled.div`
    margin: 20px 0px 20px 20px;
`;

const TitleSelect = styled.button`
    background-color: ${(props) =>
        props.selected ? "rgb(37, 37, 37)" : "rgb(218 218 218)"};
    color: ${(props) =>
        props.selected ? "rgb(248, 248, 248)" : "rgb(37, 37, 37)"};

    height: 40px;
    padding: 10px;
    border: none;
    border-radius: 10px;
    box-sizing: border-box;
    flex-wrap: nowrap;
    flex-shrink: 0;
    font-weight: 400;
    font-size: 14px;
    margin-right: 12px;
    line-height: 21px;
    transition: all 0.25s ease-out 0s;
    font-family: NotoSansKR, "Noto Sans CJK KR", sans-serif;
    margin-right: 10px;
    cursor: pointer;
`;

const LocationSelect = styled.button`
    background-color: ${(props) =>
        props.selected ? "rgb(37, 37, 37)" : "rgb(218 218 218)"};
    color: ${(props) =>
        props.selected ? "rgb(248, 248, 248)" : "rgb(37, 37, 37)"};

    height: 40px;
    padding: 10px;
    border: none;
    border-radius: 10px;
    box-sizing: border-box;
    flex-wrap: nowrap;
    flex-shrink: 0;
    font-weight: 400;
    font-size: 14px;
    margin-right: 12px;
    line-height: 21px;
    transition: all 0.25s ease-out 0s;
    font-family: NotoSansKR, "Noto Sans CJK KR", sans-serif;
    margin-right: 10px;
    cursor: pointer;
`;

const TagSelect = styled.button`
    background-color: ${(props) =>
        props.selected ? "rgb(37, 37, 37)" : "rgb(218 218 218)"};
    color: ${(props) =>
        props.selected ? "rgb(248, 248, 248)" : "rgb(37, 37, 37)"};

    height: 40px;
    padding: 10px;
    border: none;
    border-radius: 10px;
    box-sizing: border-box;
    flex-wrap: nowrap;
    flex-shrink: 0;
    font-weight: 400;
    font-size: 14px;
    margin-right: 12px;
    line-height: 21px;
    transition: all 0.25s ease-out 0s;
    font-family: NotoSansKR, "Noto Sans CJK KR", sans-serif;
    margin-right: 10px;
    cursor: pointer;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;
  margin-right; 20px;
`;

const TotalInput = styled.input`
    height: 30px;
    width: 88%;
    padding-left: 35px;
    border-radius: 10px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
`;

const MainContainer = styled.div`
    background-color: #efefef;
    margin: 50px 20px 30px 20px;
    border-radius: 8px;

    height: 320px;
`;

const MainTitle = styled.div`
    margin: 15px 0px 10px 30px;
    font-size: 17px;
    font-weight: 700;
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px 20px 20px 20px;
    border-radius: 8px;
    background-color: #fff;
`;
const TitleName = styled.span`
    font-size: 16px;
    font-weight: 700;
    margin: 5px 0px 5px 10px;
`;

const TitleContent = styled.div`
    display: flex;
    font-size: 14px;
    font-weight: 700;
    color: #636363;
    margin: 5px 0px 5px 10px;
`;

const LocationContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px 20px 20px 20px;
    border-radius: 8px;
    background-color: #fff;
`;

const LocationName = styled.span`
    font-size: 16px;
    font-weight: 700;
    margin: 5px 0px 5px 10px;
`;

const LocationContent = styled.div`
    display: flex;
    font-size: 14px;
    font-weight: 700;
    color: #636363;
    margin: 5px 0px 5px 10px;
`;

const TagContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px 20px 20px 20px;
    border-radius: 8px;
    background-color: #fff;
`;

const TagName = styled.span`
    font-size: 16px;
    font-weight: 700;
    margin: 5px 0px 5px 10px;
`;
const TagList = styled.div`
    display: flex;
    font-size: 14px;
    font-weight: 700;
    color: #636363;
    margin: 5px 0px 5px 10px;
`;
const TagItem = styled.div`
    display: flex;
    align-items: center;
    margin-right: 5px;
`;

const DeleteButton = styled.button`
    color: red;
    border: none;
    background-color: transparent;
    cursor: pointer;
`;
