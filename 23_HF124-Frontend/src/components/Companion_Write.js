import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
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
  const [tagItem, setTagItem] = useState(""); // 태그 입력값
  const [tagList, setTagList] = useState([]); // 태그 리스트
  const detaildata = useLocation();
  const baseURL = "http://localhost:3000/";
  const navigate = useNavigate();
  const [locationList, setLocationList] = useState([]);

  //const { onCreate_Companion } = useContext(CompanionDispatchContext);
  const [detail, setDetail] = useState(
    detaildata.state ? detaildata.state.data.post : ""
  );

  //수정하기 state관리
  const [title, setTitle] = useState(detail ? detail.title : "");
  const [gender, setGender] = useState(detail ? detail.pgender : "");
  const [age, setAge] = useState(detail ? detail.age : "");
  const [startDate, setStartDate] = useState(detail ? detail.startDate : "");
  const [finishDate, setFinishDate] = useState(detail ? detail.finishDate : "");
  const [personnel, setPersonnel] = useState(detail ? detail.personnel : "");
  const [content, setContent] = useState(detail ? detail.content : "");
  const [file, setFile] = useState(
    detail ? detail.post_images[0].imageURL : ""
  );

  console.log(file);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [previewURL, setPreviewURL] = useState(
    detail ? detail.post_images[0].imageURL : ""
  );
  const fileInput = useRef();

  const [selectedLocation, setSelectedLocation] = useState({});

  const [data, setData] = useState();

  console.log(detaildata.state);

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };
  const handleFinishDateChange = (e) => {
    setFinishDate(e.target.value);
  };

  //위치를 입력 받을때 kakaoapi를 활용하기 위함
  const searchLocation = async () => {
    const query = locationRef.current.value;

    if (!query.trim()) {
      // 입력값이 비어있는 경우 API 호출을 막습니다.
      setLocationList([]); // 위치 목록을 초기화하면서 자동완성 리스트를 비웁니다.
      return; // 빈 문자열인 경우 함수를 여기서 종료합니다.
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/community/posts/search-keyword?query=${locationRef.current.value}`
      );
      if (response.status === 200) {
        // response.data가 배열인지 확인하고, 배열이 아니면 빈 배열로 설정
        setLocationList(Array.isArray(response.data) ? response.data : []);
      } else {
        console.error("주소 검색 실패", response.status);
      }
    } catch (error) {
      console.error("주소를 검색하는 도중 에러가 발생했습니다", error);
    }
  };
  useEffect(() => {
    if (detaildata.state !== null) {
      let tagcontent = detaildata.state.data.post.tags.map(
        (tag) => tag.content
      );
      setTagList(tagcontent);
    }
  }, []);
  const onKeyDown = (e) => {
    if (e.target.value.length !== 0 && e.key === "Enter") {
      submitTagItem();
    }
  };
  // 태그 추가 처리
  const submitTagItem = () => {
    let updatedTagList = [...tagList];
    updatedTagList.push(tagItem);
    setTagList(updatedTagList);
    setTagItem("");
  };

  // 태그 삭제 처리
  const deleteTagItem = (e) => {
    const deleteTagItem = e.target.parentElement.firstChild.innerText;
    const filteredTagList = tagList.filter(
      (tagItem) => tagItem !== deleteTagItem
    );
    setTagList(filteredTagList);
  };
  const handleLocationSelect = (location) => {
    locationRef.current.value = location.place_name;
    setSelectedLocation({ x: location.x, y: location.y });
    setLocationList([]);
  };

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
    newFileInput.addEventListener("change", (e) => {
      onFileInput(e, i);
    });
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
    } else if (start_dateRef.current.value > finish_dateRef.current.value) {
      start_dateRef.current.focus();
      return;
    } else if (
      !parseInt(personnelRef.current.value, 10) ||
      isNaN(parseInt(personnelRef.current.value, 10))
    ) {
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
      const formData = new FormData();
      formData.append("files", file);
      const jsonData = {
        title: titleRef.current.value,
        location: locationRef.current.value,
        startDate: start_dateRef.current.value,
        finishDate: finish_dateRef.current.value,
        pgender: gender,
        age: ageRef.current.value,
        personnel: personnelRef.current.value,
        content: contentRef.current.value,
        tags: tagList, // 태그 리스트 추가
      };
      formData.append("jsonData", JSON.stringify(jsonData));
      axios
        .post("http://localhost:3000/companion/cupload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          navigate("/Companion", { replace: true });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleEditsubmit = async () => {
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
    } else if (
      !parseInt(personnelRef.current.value, 10) ||
      isNaN(parseInt(personnelRef.current.value, 10))
    ) {
      personnelRef.current.focus();
      return;
    } else if (window.confirm("게시글을 등록하시겠습니까?")) {
      const formData = new FormData();
      formData.append("files", file);
      const jsonData = {
        title: titleRef.current.value,
        location: locationRef.current.value,
        startDate: startDate,
        finishDate: finishDate,
        pgender: gender,
        age: ageRef.current.value,
        personnel: personnel,
        content: content,
        tags: tagList, // 태그 리스트 추가
      };
      formData.append("jsonData", JSON.stringify(jsonData));
      const postId = detail.cpostID;
      axios
        .put(`http://localhost:3000/companion/${postId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          navigate("/Companion", { replace: true });
        })
        .catch((error) => {
          console.log(error);
        });
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
              {" "}
              {"<"}{" "}
            </button>
            {detaildata.state === null ? (
              <button className="complete_btn" onClick={handleSubmit}>
                {" "}
                등록{" "}
              </button>
            ) : (
              <button className="complete_btn" onClick={handleEditsubmit}>
                {" "}
                수정{" "}
              </button>
            )}
          </Header>
        </Navigation>
      </Section>

      <Section>
        <InputContainer>
          <Title>제목</Title>
          {detaildata.state === null ? (
            <Input
              type="text"
              name="title"
              placeholder="제목을 입력하세요"
              ref={titleRef}
            />
          ) : (
            <Input
              type="text"
              name="title"
              value={title}
              ref={titleRef}
              onChange={(e) => setTitle(e.target.value)}
            />
          )}
        </InputContainer>

        <InputContainer>
          <InputLabel>위치</InputLabel>
          {detaildata.state === null ? (
            <Input
              name="location"
              placeholder="위치 입력"
              ref={locationRef}
              onChange={searchLocation}
            />
          ) : (
            <Input
              name="location"
              placeholder={detail.location}
              ref={locationRef}
              onChange={searchLocation}
            />
          )}
          {locationList.map((location, i) => (
            <li key={i} onClick={() => handleLocationSelect(location)}>
              {location.place_name}
            </li>
          ))}
        </InputContainer>

        <InputContainer>
          <InputLabel>성별</InputLabel>
          <RadioContainer>
            <RadioButton
              type="radio"
              name="gender"
              value="남자"
              onChange={handleGenderChange}
              checked={gender === "남자"}
            />
            <RadioLabel>남자</RadioLabel>
            <RadioButton
              type="radio"
              name="gender"
              value="여자"
              onChange={handleGenderChange}
              checked={gender === "여자"}
            />
            <RadioLabel>여자</RadioLabel>
            <RadioButton
              type="radio"
              name="gender"
              value="상관없음"
              onChange={handleGenderChange}
              checked={gender === "상관없음"}
            />
            <RadioLabel>상관없음</RadioLabel>
          </RadioContainer>
        </InputContainer>

        <InputContainer>
          <InputLabel>나이</InputLabel>
          <Select
            name="age"
            ref={ageRef}
            value={age}
            onChange={handleAgeChange}
          >
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
            <DateInput
              type="date"
              name="start_date"
              value={startDate}
              onChange={handleStartDateChange}
              ref={start_dateRef}
            />
            <DateSeparator>~</DateSeparator>
            <DateInput
              type="date"
              name="finish_date"
              value={finishDate}
              onChange={handleFinishDateChange}
              ref={finish_dateRef}
            />
          </DateContainer>
        </InputContainer>

        <InputContainer>
          <InputLabel>모집인원</InputLabel>
          {detaildata.state === null ? (
            <Input
              type="text"
              name="personnel"
              placeholder="모집인원(숫자만 입력가능)"
              ref={personnelRef}
            />
          ) : (
            <Input
              type="text"
              name="personnel"
              placeholder="모집인원(숫자만 입력가능)"
              value={personnel}
              ref={personnelRef}
              onChange={(e) => setPersonnel(e.target.value)}
            />
          )}
        </InputContainer>

        <InputContainer>
          {detaildata.state === null ? (
            <PhotoContainer>
              {file ? (
                <Preview>
                  <ProfilePreview
                    src={previewURL}
                    alt="uploaded"
                    ref={fileInput}
                  />
                  <EditButton onClick={() => handleEdit()}>
                    {" "}
                    사진수정{" "}
                  </EditButton>
                </Preview>
              ) : (
                <Upload>
                  <UploadInput
                    type="file"
                    name="photo"
                    id="photo"
                    accept="image/*"
                    ref={fileRef}
                    onChange={onFileInput}
                  />
                  <UploadButton type="submit">
                    <p className="text1"> 사진 올리기 </p>
                    <p className="text2"> (1장) </p>
                  </UploadButton>
                </Upload>
              )}
            </PhotoContainer>
          ) : (
            <Preview>
              <ProfilePreview src={previewURL} alt="uploaded" ref={fileInput} />
              <EditButton onClick={() => handleEdit()}> 사진수정 </EditButton>
            </Preview>
          )}
        </InputContainer>

        <InputContainer>
          <InputLabel>내용</InputLabel>
          {detaildata.state === null ? (
            <ContentTextarea
              name="content"
              placeholder="내용을 입력하세요."
              value={content}
              ref={contentRef}
              onChange={(e) => handleInput(e)}
            />
          ) : (
            <ContentTextarea
              name="content"
              placeholder="내용을 입력하세요."
              value={content}
              ref={contentRef}
              onChange={(e) => setContent(e.target.value)}
            />
          )}
        </InputContainer>

        <InputContainer>
          <InputLabel>태그</InputLabel>
          {tagList.map((tagItem, index) => {
            return (
              <TagItem key={index}>
                <Text>{tagItem}</Text>
                <TagButton onClick={deleteTagItem}>X</TagButton>
              </TagItem>
            );
          })}
          <TagInput
            type="text"
            placeholder="태그를 입력해주세요!"
            onChange={(e) => setTagItem(e.target.value)}
            value={tagItem}
            onKeyDown={onKeyDown}
          />
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
  border: none;
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

const PhotoContainer = styled.div``;

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
`;

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

const TagButton = styled.button`
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

export default Companion_Write;
