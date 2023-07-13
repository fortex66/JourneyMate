import React, { useContext, useState, useRef } from "react";
import MyButton from "../components/MyButton";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CompanionDispatchContext } from "../App";

const Companion_Write = () => {
  const titleRef = useRef();
  const locationRef = useRef();
  const start_dateRef = useRef();
  const finish_dateRef = useRef();
  const personnelRef = useRef();
  const contentRef = useRef();
  const tagRef = useRef();

  const navigate = useNavigate();

  const { onCreate_Companion } = useContext(CompanionDispatchContext);

  const [inputs, setInputs] = useState({
    title: "",
    location: "",
    gender: "man",
    start_date: "",
    finish_date: "",
    personnel: "",
    content: "",
    tag: "",
  });

  const [previewURL, setPreviewURL] = useState("");
  const [file, setFile] = useState();
  const fileInput = useRef();

  function onChange(e) {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  const {
    title,
    location,
    gender,
    start_date,
    finish_date,
    personnel,
    content,
    tag,
  } = inputs;

  const handleSubmit = () => {
    const finalGender = gender === "man" ? "남자" : "여자";

    if (title.length < 1) {
      titleRef.current.focus();
      return;
    } else if (location.length < 1) {
      locationRef.current.focus();
      return;
    } else if (start_date === "") {
      start_dateRef.current.focus();
      return;
    } else if (finish_date === "") {
      finish_dateRef.current.focus();
      return;
    } else if (content.length < 1) {
      contentRef.current.focus();
      return;
    } else if (personnel === "" || isNaN(personnel)) {
      personnelRef.current.focus();
      return;
    } else if (!file) {
      // Check if a file is not selected
      // Display an error message or handle the case when no file is selected
      return;
    } else if (window.confirm("게시글을 등록하시겠습니까?")) {
      onCreate_Companion(
        title,
        location,
        finalGender,
        start_date,
        finish_date,
        personnel,
        file,
        content,
        tag
      );
    }

    navigate("/Companion", { replace: true }); // 작성하는 페이지로 뒤로오기 금지
  };

  const onFileInput = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.readAsDataURL(file);

    reader.onload = () => {
      setFile(file);
      setPreviewURL(reader.result);
    };
  };

  return (
    <Container>
      <Section>
        <Header>
          <MyButton
            className="back_btn"
            text={"<"}
            onClick={() => navigate(-1)}
          />
          <MyButton
            className="complete_btn"
            text={"등록"}
            onClick={handleSubmit}
          />
        </Header>
      </Section>

      <Section>
        <InputContainer>
          <InputLabel>제목</InputLabel>
          <Input
            name="title"
            placeholder="제목을 입력하세요"
            ref={titleRef}
            value={title}
            onChange={onChange}
          />
        </InputContainer>

        <InputContainer>
          <InputLabel>위치</InputLabel>
          <Input
            name="location"
            placeholder="위치를 입력하세요"
            ref={locationRef}
            value={location}
            onChange={onChange}
          />
        </InputContainer>

        <InputContainer>
          <InputLabel>성별</InputLabel>
          <RadioContainer>
            <RadioButton
              type="radio"
              name="gender"
              checked={gender === "man"}
              value="man"
              onChange={onChange}
            />
            <RadioLabel>남성</RadioLabel>
            <RadioButton
              type="radio"
              name="gender"
              value="girl"
              checked={gender === "girl"}
              onChange={onChange}
            />
            <RadioLabel>여성</RadioLabel>
          </RadioContainer>
        </InputContainer>

        <InputContainer>
          <InputLabel>여행기간</InputLabel>
          <DateContainer>
            <DateInput
              type="date"
              name="start_date"
              ref={start_dateRef}
              value={start_date}
              onChange={onChange}
            />
            <DateSeparator>~</DateSeparator>
            <DateInput
              type="date"
              name="finish_date"
              ref={finish_dateRef}
              value={finish_date}
              onChange={onChange}
            />
          </DateContainer>
        </InputContainer>

        <InputContainer>
          <InputLabel>모집인원</InputLabel>
          <Input
            type="text"
            name="personnel"
            placeholder="모집인원(숫자만 입력가능)"
            ref={personnelRef}
            value={personnel}
            onChange={onChange}
          />
        </InputContainer>

        <InputContainer>
          <PhotoContainer>
            {file ? (
              <Preview>
                <ProfilePreview
                  src={previewURL}
                  alt="uploaded"
                  ref={fileInput}
                />
              </Preview>
            ) : (
              <>
                <UploadInput
                  type="file"
                  name="photo"
                  id="photo"
                  accept="image/*"
                  onChange={onFileInput}
                  required
                />
                <Upload htmlFor="photo">
                  배경사진
                  <p>(최소 한장을 올려주세요)</p>
                </Upload>
              </>
            )}
          </PhotoContainer>
        </InputContainer>

        <InputContainer>
          <InputLabel>내용</InputLabel>
          <ContentTextarea
            name="content"
            placeholder="내용 입력"
            ref={contentRef}
            value={content}
            onChange={onChange}
          />
        </InputContainer>

        <InputContainer>
          <InputLabel>태그</InputLabel>
          <Input
            type="text"
            name="tag"
            placeholder="태그를 입력하세요"
            ref={tagRef}
            value={tag}
            onChange={onChange}
          />
        </InputContainer>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const Section = styled.section`
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #dadada;
`;

const InputContainer = styled.div`
  margin-bottom: 10px;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #dadada;
  border-radius: 4px;
  outline: none;
`;

const RadioContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RadioButton = styled.input`
  margin-right: 5px;
`;

const RadioLabel = styled.label`
  margin-right: 15px;
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
`;

const DateInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #dadada;
  border-radius: 4px;
  outline: none;
`;

const DateSeparator = styled.div`
  margin: 0 10px;
`;

const PhotoContainer = styled.div`
  position: relative;
`;

const UploadInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: transparent;

  &::-webkit-file-upload-button {
    display: none;
  }
`;

const Upload = styled.label`
  display: block;
  margin-top: 10px;
  padding: 8px;
  text-align: center;
  color: #a4acb3;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid #dadada;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.backgroundGrey};

  i {
    display: block;
    font-size: 18px;
  }

  p {
    font-size: 12px;
    margin-top: 5px;
  }
`;

const Preview = styled.div`
  margin-bottom: 10px;
`;

const ProfilePreview = styled.img`
  width: 100%;
  height: auto;
`;

const ContentTextarea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #dadada;
  border-radius: 4px;
  outline: none;
  resize: vertical;
`;

export default Companion_Write;
