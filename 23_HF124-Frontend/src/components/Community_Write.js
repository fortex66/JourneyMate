import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

// const token=localStorage.getItem('jwtToken');
axios.defaults.withCredentials = true;

const Community_Write = () => {
  const titleRef = useRef();
  const locationRef = useRef();
  const tagRef = useRef();
  const photoRefs = useRef([]);
  const contentRefs = useRef([]);
  const navigate = useNavigate();
  const [locationList, setLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [data, setData] = useState([{ photo: "", content: "", file: null }]);


  const [tagItem, setTagItem] = useState(""); // 태그 입력값
  const [tagList, setTagList] = useState([]); // 태그 리스트


  
  //위치를 입력 받을때 kakaoapi를 활용하기 위함
  const searchLocation = async () => {
    const query = locationRef.current.value;
  
    if (!query.trim()) { // 입력값이 비어있는 경우 API 호출을 막습니다.
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


   // 태그 입력 처리
   const onKeyPress = (e) => {
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
    const filteredTagList = tagList.filter((tagItem) => tagItem !== deleteTagItem);
    setTagList(filteredTagList);
  };

  // 선택한 위치를 사용하기 위함
  const handleLocationSelect = (location) => {
    locationRef.current.value = location.place_name;
    setSelectedLocation({x: location.x, y: location.y, address_name:location.address_name });
    setLocationList([]);
  };

  /** 새로운 사진 및 내용 입력 영역 추가 */
  const handleClick = () => {
    setData([...data, { photo: "", content: "", file: null }]);
    photoRefs.current = photoRefs.current.concat(null);
    contentRefs.current = contentRefs.current.concat(null);
  };

  /** 내용 및 사진 데이터 변경 */
  const handleChange = (e, i) => {
    const { name, value } = e.target;
    const newData = [...data];
    newData[i][name] = value;
    setData(newData);

    // 자동으로 높이를 조절하여 사용자가 입력한 영역에 맞게 크기를 조절
    contentRefs.current[i].style.height = "auto";
    contentRefs.current[i].style.height =
      contentRefs.current[i].scrollHeight + "px";
  };

  /** 선택한 사진 및 내용 입력 영역 제거 */ 
  const handleDelete = (i) => {
    const newData = [...data]; //현재 data 배열을 복사
    newData.splice(i, 1); // index i의 항목을 삭제
    setData(newData); // 변경된 배열로 data 상태를 업데이트

    /* 
      photoRefs.current에서 인덱스 i와 일치하지 않는 항목들만 필터링하여 새로운 배열을 생성하고 
      photoRefs.current를 이렇게 변경된 배열로 업데이트한다. 
      결국 인덱스 i 항목이 제거됩니다.
    */
    photoRefs.current = photoRefs.current.filter((_, idx) => idx !== i); 
    contentRefs.current = contentRefs.current.filter((_, idx) => idx !== i); // contentRefs 배열에서 index i의 항목을 제거
  };
  

  // 서버에서 데이터를 받아서 띄우면 필요없는 부분
  //const { onCreate } = useContext(CommunityDispatchContext);

  /** 사진 파일 내용을 처리 */
  const onFileInput = (e, i) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.readAsDataURL(file);

    /** 파일 로딩이 완료되면 데이터 설정 및 이미지 업데이트 */ 
    reader.onload = () => {
      const newData = [...data];
      newData[i].file = file;
      newData[i].previewURL = reader.result; // replace image
      //newData[i].previewURL.push(reader.result);
      setData(newData);
    };
  };

  /** "사진수정" 버튼 클릭 시 처리 - 사진 변경 부분 */
  const handleEdit = (i) => {
    const newFileInput = document.createElement("input"); // 새로운 input 요소 생성
    newFileInput.type = "file"; // input 요소의 유형을 'file'로 설정
    newFileInput.accept = "image/*"; // 가능한 파일 형식을 이미지 제한
    // 파일 input 요소에서 발생하는 'change' 이벤트 리스너 추가, 이벤트 발생시 onFileInput 함수를 호출한다.
    newFileInput.addEventListener("change", (e) => {onFileInput(e, i); });
    newFileInput.click(); // 생성한 input 요소의 'click' 이벤트를 트리거하여 파일 선택 창 열기
  };
  

  /** 각 입력 부분의 간단한 유효성 검사 수행 
   부적절한 데이터 발견 시 해당 입력 부분으로 포커싱 */ 
  const handleSubmit = async () => {
    if (titleRef.current.value.length < 1) {
      titleRef.current.focus();
      return;
    } else if (locationRef.current.value.length < 1) {
      locationRef.current.focus();
      return;
    } else if (data.some((item, i) => !item.file)) {
      setModalMessage("사진을 올려주세요."); setShowModal(true);
      setTimeout(() => { setShowModal(false); }, 2000);
      return;
    } else if (data.some((item, i) => item.content.length < 1)) {
      contentRefs.current.find((ref, i) => data[i].content.length < 1)?.focus();
      return;
    } else if (window.confirm("게시글을 등록하시겠습니까?")) {

      const formData = new FormData();

      // 사진과 내용 데이터를 FormData에 추가
      data.forEach((item, i) => {
        formData.append("photos[]", item.file);
        formData.append("contents[]", item.content);
      });
      // json으로 제목과 위치를 만들기
      const jsonData = {
        title: titleRef.current.value,
        location: locationRef.current.value,
        x: selectedLocation.x,
        y: selectedLocation.y,
        address_name: selectedLocation.address_name,
        tags: tagList,
      };
      formData.append("jsonData", JSON.stringify(jsonData)); // 위치와 제목데이터를 formdata에 담기
      // 서버로 formData전송
      try {
        await axios.post("http://localhost:3000/community/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // multipart/form-data로 보낸다고 명시
          },
        });
        
        navigate("/Community", { replace: true }); // 작성하는 페이지로 뒤로오기 금지
      } catch (error) {
        console.log(error);
      }
    }
  };

  
  return (
    <Write>
      <Navigation>
        <Header>
          <button className="back_btn" onClick={() => navigate(-1)}> {"<"} </button>
          <button className="complete_btn" onClick={handleSubmit}> 등록 </button>
        </Header>
      </Navigation>
      <div>
        <Title>
          <input type="text" name="title" placeholder="제목을 입력하세요" ref={titleRef} />
        </Title>
        <Info>
          <input name="location" placeholder="위치 입력" ref={locationRef} onChange={searchLocation} />
          {locationList.map((location, i) => (
            <li key={i} onClick={() => handleLocationSelect(location)}>
              {location.place_name}
            </li>
          ))}
          {tagList.map((tagItem, index) => {
            return (
              <TagItem key={index}>
                <Text>{tagItem}</Text>
                <tagButton onClick={deleteTagItem}>X</tagButton>
              </TagItem>
            );
          })}
          <TagInput
            type="text"
            placeholder="태그를 입력해주세요!"
            onChange={(e) => setTagItem(e.target.value)}
            value={tagItem}
            onKeyPress={onKeyPress}
          />
        </Info>
      </div>
      <Addform>
        {data.map((val, i) => (
          <RepeatWrapper key={i}>
            <PhotoWrapper>
              <AddButton onClick={handleClick}> + </AddButton>
              {val.file ? (
                <Preview>
                  <ProfilePreview name="photopreview" onChange={(e) => handleChange(e, i)}
                    src={val.previewURL} alt="uploaded" ref={(el) => (photoRefs.current[i] = el)} />
                  <EditButton onClick={() => handleEdit(i)}> 사진수정 </EditButton>
                </Preview>
              ) : (
                <PhotoContainer>
                  <UploadInput type="file" name="photo" id="photo" accept="image/*" value={val.photo}
                    onChange={(e) => onFileInput(e, i)} required />
                  <UploadButton type="submit">
                    <FontAwesomeIcon icon={faCamera} size="4x" />
                    <br />
                    <p className="text1"> 사진 올리기 </p>
                    <p className="text2"> (1장) </p>
                  </UploadButton>
                </PhotoContainer>
              )}
              {i === 0 ? (<DisabledDeleteButton> x </DisabledDeleteButton>
              ) : (<DeleteButton onClick={() => handleDelete(i)}> x </DeleteButton> )}
            </PhotoWrapper>
            <Contents>
              <textarea name="content" placeholder="내용 입력" value={val.content}
                onChange={(e) => handleChange(e, i)} ref={(el) => (contentRefs.current[i] = el)}/>
            </Contents>
          </RepeatWrapper>
        ))}
      </Addform>
      {showModal && <Modal>{modalMessage}</Modal>}
    </Write>
  );
};

const Write = styled.div``;

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

const Button = styled.button`
  font-size: 20px;
  padding: 6px 12px 6px 12px;
  background-color: white;
  border: 1px solid rgb(164, 172, 179);
  border-radius: 10px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    opacity: 0.5;
  }
`;

const Title = styled.div`
  margin-top: 100px; // Adjust as needed to account for the height of the Header
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 10px;
  border-bottom: 1px solid rgb(234, 235, 239);

  input {
    height: 50px;
    font-family: "Nanum Gothic", sans-serif;
    font-size: 20px;
    font-weight: bold;
    border: 0;
    outline: none;
    padding-left: 10px;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgb(234, 235, 239);

  input {
    border: 0;
    outline: none;
    padding: 10px;
    font-family: "Nanum Gothic", sans-serif;
  }
`;

const Addform = styled.div`
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
`;

const RepeatWrapper = styled.div`
  display: flex;
  flex-direction: column; // row를 column으로 변경
  justify-content: space-between;
  margin-bottom: 30px;
`;

const PhotoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const AddButton = styled(Button)`
  font-size: 20px;
`;

const DeleteButton = styled(Button)`
  font-size: 20px;
  margin-left: 10px;
`;

const DisabledDeleteButton = styled(DeleteButton)`
  color: gray;
  cursor: not-allowed;
`;

const EditButton = styled(Button)`
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

const Preview = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 10px;

  text-align: center;
  border-bottom: 1px solid #dadada;
`;

const ProfilePreview = styled.img`
  width: 100%;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 30px;
  margin-right: 28px;
  margin-top: 20px;

  textarea {
    height: 50px;
    font-size: 16px;
    padding-left: 20px;
    padding-right: 20px;
    border: none;
    outline: none;
    resize: none;
    letter-spacing: 1px;
    line-height: 28px;
    font-family: "Noto Sans KR", sans-serif;
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

const tagButton = styled.button`
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

export default Community_Write;
