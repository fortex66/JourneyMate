//Tag.js
import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Tag = () => {
    const [tagItem, setTagItem] = useState("");
    const [tagList, setTagList] = useState([]);
    const navigate = useNavigate();

    const onKeyPress = (e) => {
        if (e.target.value.length !== 0 && e.key === "Enter") {
            submitTagItem();
        }
    };

    const submitTagItem = () => {
        let updatedTagList = [...tagList];
        updatedTagList.push(tagItem);
        setTagList(updatedTagList);
        setTagItem("");
    };

    const deleteTagItem = (e) => {
        const deleteTagItem = e.target.parentElement.firstChild.innerText;
        const filteredTagList = tagList.filter(
            (tagItem) => tagItem !== deleteTagItem
        );
        setTagList(filteredTagList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 사용자가 입력한 태그가 최소 2개 이상인지 검사
        if (tagList.length < 2) {
            alert("최소 2개 이상의 태그를 입력해주세요.");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:3000/signup/part3",
                {
                    tags: tagList,
                },
                {
                    withCredentials: true, // credentials 옵션 추가
                }
            );

            if (response.data.message === "회원가입3 성공") {
                navigate("/login"); // 성공 후 리다이렉트될 경로
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div>
                <div className="Tag">
                    <h1>관심사 설정</h1>
                </div>
            </div>
            <div>
                {tagList.map((tagItem, index) => {
                    return (
                        <TagItem key={index}>
                            <Text>{tagItem}</Text>
                            <Button onClick={deleteTagItem}>X</Button>
                        </TagItem>
                    );
                })}
                <TagInput
                    type="text"
                    placeholder="여행 관심 테마를 입력해주세요!"
                    tabIndex={5}
                    onChange={(e) => setTagItem(e.target.value)}
                    value={tagItem}
                    onKeyPress={onKeyPress}
                />
            </div>

            <button onClick={handleSubmit}>다음</button>
        </div>
    );
};

const TagItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 5px;
    padding: 5px;
    background-color: tomato;
    border-radius: 5px;
    color: white;
    font-size: 13px;
`;

const Text = styled.span``;

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 15px;
    height: 15px;
    margin-left: 5px;
    background-color: white;
    border-radius: 50%;
    color: tomato;
`;

const TagInput = styled.input`
    display: inline-flex;
    min-width: 200px;
    background: transparent;
    border: none;
    outline: none;
    cursor: text;
`;

export default Tag;
