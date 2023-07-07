import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MyButton from "./MyButton";

import { CommunityDispatchContext } from "../App";

const Community_Write = () => {
  const titleRef = useRef();
  const locationRef = useRef();
  const tagRef = useRef();

  const [data, setData] = useState([
    { photo: "", content: "", file: null, previewURL: null, fileInput: null },
  ]);

  const handleClick = () => {
    setData([
      ...data,
      { photo: "", content: "", file: null, previewURL: null, fileInput: null },
    ]);
  };

  const handleChange = (e, i) => {
    const { name, value } = e.target;
    const newData = [...data];
    newData[i][name] = value;
    setData(newData);
  };

  const handleDelete = (i) => {
    const newData = [...data];
    newData.splice(i, 1);
    setData(newData);
  };

  const [inputs, setInputs] = useState({
    title: "",
    location: "",
    tag: "",
  });

  const { title, location, tag } = inputs;

  const navigate = useNavigate();

  function onChange(e) {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  const { onCreate } = useContext(CommunityDispatchContext);

  const onFileInput = (e, i) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.readAsDataURL(file);

    reader.onload = () => {
      const newData = [...data];
      newData[i].file = file;
      newData[i].previewURL = reader.result;
      setData(newData);
    };
  };

  const handleSubmit = () => {
    if (title.length < 1) {
      titleRef.current.focus();
      return;
    } else if (location.length < 1) {
      locationRef.current.focus();
      return;
    } else if (tag.length < 1) {
      tagRef.current.focus();
      return;
    } else if (window.confirm("게시글을 등록하시겠습니까?"))
      onCreate(title, location, tag, content);

    navigate("/Community", { replace: true }); // 작성하는 페이지로 뒤로오기 금지
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

      <section>
        <Title>
          <input
            name="title"
            placeholder="제목"
            ref={titleRef}
            value={title}
            onChange={onChange}
          />
        </Title>
        <Info>
          <input
            name="location"
            placeholder="위치 입력"
            ref={locationRef}
            value={location}
            onChange={onChange}
          />
          <input
            name="tag"
            placeholder="테그 입력"
            ref={tagRef}
            value={tag}
            onChange={onChange}
          />
        </Info>
      </section>

      <section>
        <button onClick={handleClick}>+</button>
        {data.map((val, i) => (
          <div key={i}>
            {val.file ? (
              <Preview>
                <ProfilePreview
                  name="photopreview"
                  onChange={(e) => handleChange(e, i)}
                  src={val.previewURL}
                  alt="uploaded"
                  ref={val.fileInput}
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
                  onChange={(e) => onFileInput(e, i)}
                  required
                />
                <Upload type="submit">
                  사진 올리기
                  <p>(*1장만)</p>
                </Upload>
              </PhotoContainer>
            )}
            <Contents>
              <textarea
                name="content"
                placeholder="내용 입력"
                value={val.content}
                onChange={(e) => handleChange(e, i)}
              />
            </Contents>

            <button onClick={() => handleDelete(i)}>X</button>
          </div>
        ))}
      </section>
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

export default Community_Write;
