import React, { useContext, useState, useRef } from "react";
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
  const ageRef = useRef();
  const fileRef = useRef();
  const navigate = useNavigate();

  const { onCreate_Companion } = useContext(CompanionDispatchContext);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [file, setFile] = useState();
  const fileInput = useRef();
  const [gender, setGender] = useState("man");
  const [content, setContent] = useState(""); // Set the initial value of content


  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  function handleInput(e) {
    contentRef.current.style.height = "auto";
    contentRef.current.style.height = contentRef.current.scrollHeight + "px";
    setContent(e.target.value); // Update the content state with the input value
  }

   /** "사진수정" 버튼 클릭 시 처리 - 사진 변경 부분 */
   const handleEdit = (i) => {
    const newFileInput = document.createElement("input"); // 새로운 input 요소 생성
    newFileInput.type = "file"; // input 요소의 유형을 'file'로 설정
    newFileInput.accept = "image/*"; // 가능한 파일 형식을 이미지 제한
    // 파일 input 요소에서 발생하는 'change' 이벤트 리스너 추가, 이벤트 발생시 onFileInput 함수를 호출한다.
    newFileInput.addEventListener("change", (e) => {onFileInput(e, i); });
    newFileInput.click(); // 생성한 input 요소의 'click' 이벤트를 트리거하여 파일 선택 창 열기
  };

  const handleSubmit = () => {
    // const finalGender = gender === "man" ? "남자" : "여자";

    if (titleRef.current.value.length < 1) {
      titleRef.current.focus();
      return;
    } else if (locationRef.current.value.length < 1) {
      locationRef.current.focus();
      return;
    } else if (start_dateRef.current.value === "") {
      start_dateRef.current.focus();
      return;
    } else if (finish_dateRef.current.value === "") {
      finish_dateRef.current.focus();
      return;
    } else if (contentRef.current.value.length < 1) {
      contentRef.current.focus();
      return;
    } else if (ageRef.current.value === "") {
      ageRef.current.focus();
      return;
    } else if (!parseInt(personnelRef.current.value, 10) || isNaN(parseInt(personnelRef.current.value, 10))) {
      personnelRef.current.focus();
      return;
    } else if (!file) {
      setModalMessage("사진을 올려주세요.");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
      return;
    } else if (window.confirm("게시글을 등록하시겠습니까?")) {
      onCreate_Companion(
        titleRef.current.value,
        locationRef.current.value,
        gender,
        ageRef.current.value,
        start_dateRef.current.value,
        finish_dateRef.current.value,
        personnelRef.current.value,
        file,
        contentRef.current.value,
        tagRef.current.value
      );
      navigate("/Companion", { replace: true });
    }
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
        <Navigation>
          <Header>
            <button className="back_btn" onClick={() => navigate(-1)}>
              {"<"}
            </button>
            <button className="complete_btn" onClick={handleSubmit}>
              등록
            </button>
          </Header>
        </Navigation>
      </Section>

      <Section>
        <InputContainer>
          <Title>제목</Title>
          <Input name="title" placeholder="제목을 입력하세요" ref={titleRef} />
        </InputContainer>

        <InputContainer>
          <InputLabel>위치</InputLabel>
          <Input name="location" placeholder="위치를 입력하세요" ref={locationRef} />
        </InputContainer>

        <InputContainer>
          <InputLabel>성별</InputLabel>
          <RadioContainer>
            <RadioButton type="radio" name="gender" checked={gender === "man"} value="남자" onChange={handleGenderChange}/>
            <RadioLabel>남성</RadioLabel>
            <RadioButton type="radio" name="gender" value="여자" checked={gender === "girl"} onChange={handleGenderChange} />
            <RadioLabel>여성</RadioLabel>
          </RadioContainer>
        </InputContainer>

        <InputContainer>
          <InputLabel>나이</InputLabel>
          <Select name="age" ref={ageRef}>
            <option value="">선택하세요</option>
            <option value="10대">10대</option>
            <option value="20대">20대</option>
            <option value="30대">30대</option>
            <option value="40대">40대</option>
            <option value="50대">50대</option>
            <option value="60대">60대</option>
          </Select>
        </InputContainer>

        <InputContainer>
          <InputLabel>여행기간</InputLabel>
          <DateContainer>
            <DateInput type="date" name="start_date" ref={start_dateRef} />
            <DateSeparator>~</DateSeparator>
            <DateInput type="date" name="finish_date" ref={finish_dateRef} />
          </DateContainer>
        </InputContainer>

        <InputContainer>
          <InputLabel>모집인원</InputLabel>
          <Input type="text" name="personnel" placeholder="모집인원(숫자만 입력가능)" ref={personnelRef} />
        </InputContainer>

        <InputContainer>
          <PhotoContainer>
            {file ? (
              <Preview>
                <ProfilePreview src={previewURL} alt="uploaded" ref={fileInput} />
                <EditButton onClick={() => handleEdit()}> 사진수정 </EditButton>
              </Preview>
            ) : (
              <Upload>
                <UploadInput type="file" name="photo" id="photo" accept="image/*" ref={fileRef} onChange={onFileInput} />
                <UploadButton type="submit">
                    <p className="text1"> 사진 올리기 </p>
                    <p className="text2"> (1장) </p>
                </UploadButton>
              </Upload>
              
            )}
          </PhotoContainer>
        </InputContainer>

        <InputContainer>
          <InputLabel>내용</InputLabel>
          <ContentTextarea name="content" placeholder="내용을 입력하세요." value={content} ref={contentRef} onChange={(e)=>handleInput(e)}/>
        </InputContainer>

        <InputContainer>
          <InputLabel>태그</InputLabel>
          <Input type="text" name="tag" placeholder="태그를 입력하세요" ref={tagRef} />
        </InputContainer>
      </Section>
      {showModal && <Modal>{modalMessage}</Modal>}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  margin-bottom: 50px;
`;

const Section = styled.section`
  margin-bottom: 20px;
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
const InputContainer = styled.div`
  margin-bottom: 20px;
  padding-right: 20px;
  padding-left: 20px;
`;

const Title = styled.label`
  margin-top: 100px; // Adjust as needed to account for the height of the Header
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 5px;
  font-weight: bold;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  border:none;
  border-bottom: 1px solid #dadada;
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
 
`;

const UploadInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: transparent;
  cursor: pointer;

  &::-webkit-file-upload-button {
    display: none;
  }
`;

const UploadButton = styled.button`
  flex: 1 1 auto;
  padding: 100px 0px;
  width: 100%;
  height: 100%;
  margin-right: 20px;
  text-align: center;
  color: #a4acb3;
  font-weight: bold;
  border: none;

  background: linear-gradient(to right, #ccc 50%, rgba(255, 255, 255, 0) 0%),
    linear-gradient(#ccc 50%, rgba(255, 255, 255, 0) 0%),
    linear-gradient(to right, #ccc 50%, rgba(255, 255, 255, 0) 0%),
    linear-gradient(#ccc 50%, rgba(255, 255, 255, 0) 0%);
  background-position: top, right, bottom, left;
  background-repeat: repeat-x, repeat-y;
  background-size: 10px 1px, 1px 10px;
  background-color: #f0f0f0;

  &:hover {
    opacity: 0.5;
  }

  p.text1 {
    font-size: 15px;
    margin-top: 5px;
    margin-bottom: 0px;
    font-family: "Nanum Gothic", sans-serif;
  }
  p.text2 {
    font-size: 10px;
    margin-top: 0px;
    font-family: "Nanum Gothic", sans-serif;
  }
`;

const Upload = styled.div`
position: relative;
flex: 1 1 auto;

@media screen and (max-width: 64px) {
  width: 100%;
}
`


const Preview = styled.div`
  margin-bottom: 10px;
  text-align: center;
`;

const EditButton = styled.button`
  font-size: 15px;
  margin-top: 10px;
  padding: 10px;
  background-color: #333333;
  color: #fff;
  border: none;
  cursor: pointer;
  font-family: "Nanum Gothic", sans-serif;
  letter-spacing: 1px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  &:hover {
    opacity: 0.5;
  }
`;

const ProfilePreview = styled.img`
  width: 100%;
  height: auto;
`;

const ContentTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #dadada;
  border-radius: 4px;
  outline: none;
  resize: vertical;
  height: 50px;
  font-size: 16px;

  border: none;
  outline: none;
  resize: none;
  letter-spacing: 1px;
  line-height: 28px;
  font-family: "Noto Sans KR", sans-serif;
`;


const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #dadada;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #3875d7;
  }
`;

const Modal = styled.div`
  position: fixed;
  z-index: 1000;
  left: 50%;
  top: 80%;
  transform: translate(-50%, -50%);
  background-color: #333333;
  color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export default Companion_Write;
