import { useContext, useState, useRef } from "react";
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
  const [data, setData] = useState([{ photo: "", content: "" }]);

  const [inputs, setInputs] = useState({
    title: "",
    location: "",
    start_date: "",
    finish_date: "",
    personnel: "",
    man: "man",
    girl: "",
    content: "",
    tag: "",
  });

  const [previewURL, setPreviewURL] = useState("");
  const [file, setFile] = useState();
  const fileInput = useRef();

  const handleChange = (e, i) => {
    const { name, value } = e.target;
    const onchangeVal = [...data];
    onchangeVal[i][name] = value;
    setData(onchangeVal);
  };

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
    start_date,
    finish_date,
    personnel,
    man,
    girl,
    content,
    tag,
  } = inputs;

  const navigate = useNavigate();

  const { onCreate_Companion } = useContext(CompanionDispatchContext);

  const handleSubmit = () => {
    if (title.length < 1) {
      titleRef.current.focus();
      return;
    } else if (location.length < 1) {
      locationRef.current.focus();
      return;
    } else if (start_date == 0) {
      start_dateRef.current.focus();
      return;
    } else if (finish_date == 0) {
      finish_dateRef.current.focus();
      return;
    } else if (content.length < 1) {
      contentRef.current.focus();
      return;
    } else if (personnel === "" || isNaN(personnel)) {
      personnelRef.current.focus();
      return;
    } else if (window.confirm("게시글을 등록하시겠습니까?")) {
      onCreate_Companion(
        title,
        location,
        start_date,
        finish_date,
        tag,
        content,
        personnel
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
    <div>
      <section>
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
      </section>

      <Info>
        <input
          name="title"
          placeholder="제목을 입력하세요"
          ref={titleRef}
          value={title}
          onChange={onChange}
        />
        <input
          name="location"
          placeholder="위치를 입력하세요"
          ref={locationRef}
          value={location}
          onChange={onChange}
        />
        <label>
          <span>남성</span>
          <input
            type="radio"
            name="gender"
            checked={man === "man"}
            value={man}
            onChange={onChange}
          />
          <span>여성</span>
          <input type="radio" name="gender" value={girl} onChange={onChange} />
        </label>
        <label>
          <span>여행기간</span>{" "}
          <input
            type="date"
            name="start_date"
            ref={start_dateRef}
            value={start_date}
            onChange={onChange}
          />
          {"     ~     "}
          <input
            type="date"
            name="finish_date"
            ref={finish_dateRef}
            value={finish_date}
            onChange={onChange}
          />
        </label>
        <label>
          {" "}
          <span>모집인원</span>{" "}
          <input
            type="text"
            name="personnel"
            placeholder="모집인원(숫자만 입력가능)"
            ref={personnelRef}
            value={personnel}
            onChange={onChange}
          />
        </label>
      </Info>
      {data.map((val, i) => (
        <div>
          {file ? (
            <Preview>
              <ProfilePreview
                name="photo"
                onchange={(e) => handleChange(e, i)}
                src={previewURL}
                alt="uploaded"
                ref={fileInput}
              />
            </Preview>
          ) : (
            <PhotoContainer>
              <UploadInput
                type="file"
                name="photo"
                id="photo"
                accept="image/*"
                value={val.photo}
                onChange={onFileInput}
                required
              />
              <Upload type="submit">
                사진 올리기
                <p>(*1장만)</p>
              </Upload>
            </PhotoContainer>
          )}
        </div>
      ))}
      <Contents>
        <textarea
          name="content"
          placeholder="내용 입력"
          ref={contentRef}
          value={content}
          onChange={onChange}
        />
      </Contents>
      <Tag>
        <input
          type="text"
          name="tag"
          placeholder="태그를 입력하세요"
          ref={tagRef}
          value={tag}
          onChange={onChange}
        />
      </Tag>
    </div>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 16px 15px;
  border-bottom: 1px solid #dadada;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Tag = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PhotoContainer = styled.form`
  position: relative;
  flex: 1 1 auto;

  @media screen and (max-width: 64px) {
    width: 100%;
  }
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

const Upload = styled.button`
  flex: 1 1 auto;
  padding: 100px 0px;
  width: 100%;
  height: 100%;
  margin-right: 20px;
  text-align: center;
  color: #a4acb3;
  font-weight: bold;
  cursor: pointer;
  border: none;
  background-color: ${({ theme }) => theme.backgroundGrey} !important;

  //for border dot's wider spacing
  background: linear-gradient(to right, #ccc 50%, rgba(255, 255, 255, 0) 0%),
    linear-gradient(#ccc 50%, rgba(255, 255, 255, 0) 0%),
    linear-gradient(to right, #ccc 50%, rgba(255, 255, 255, 0) 0%),
    linear-gradient(#ccc 50%, rgba(255, 255, 255, 0) 0%);
  background-position: top, right, bottom, left;
  background-repeat: repeat-x, repeat-y;
  background-size: 10px 1px, 1px 10px;

  &:hover {
    opacity: 0.5;
  }

  i {
    display: block;
    font-size: 3rem;
  }

  p {
    font-size: 0.6rem;
  }
`;

const Preview = styled.div`
  position: relative;
  flex-basis: 50%;
  margin-bottom: 10px;
  text-align: center;
`;

const ProfilePreview = styled.img`
  width: 70%;
  height: 70%;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default Companion_Write;
