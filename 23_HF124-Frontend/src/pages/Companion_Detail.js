//Companion_Detail.js
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Detail_Nav from "../components/Detail_Nav";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faLocationDot,
  faUser,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "../App";
const Companion_Detail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { socket, socketId } = useContext(SocketContext);

  const baseURL = "http://localhost:3000/";
  const imgURL = "https://journeymate.s3.ap-northeast-2.amazonaws.com/";
  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      // Check if the target is the ModalBackground
      closeModal();
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");

    setCurrentUser(jwtToken);
    const fetchData = async () => {
      try {
        const responsePost = await axios.get(baseURL + `companion/${postId}`); // postId를 API 호출에 사용하여 게시글 데이터 가져오기
        setData(responsePost.data);
        console.log(responsePost);
        const responseComments = await axios.get(
          baseURL + `companion/comments/${postId}`
        ); // postId를 API 호출에 사용하여 댓글 데이터 가져오기
        setComments(responseComments.data);
        console.log(responseComments);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleNewCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const goUserDetail = (userId) => {
    navigate(`/UserDetail/${userId}`);
  };

  const enterChatRoom = async () => {
    const cpostID = window.location.pathname.split("/").pop();
    try {
      await axios
        .put(baseURL + `companion/chatroom/${cpostID}`, { socketID: socketId })
        .then((res) => {
          console.log(res);
          navigate(`/ChattingRoom/${cpostID}`);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.errror(err);
    }
  };

  const addComment = () => {
    const newCommentObject = {
      contents: newComment,
      commentDate: new Date().toISOString(),
    };

    const cpostID = window.location.pathname.split("/").pop();
    axios
      .post(`${baseURL}companion/comments/${cpostID}`, newCommentObject, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then(function (response) {
        console.log(response);
        setComments((prevComments) => [...prevComments, response.data]);
        setNewComment(""); // 댓글 작성 후 작성창을 비웁니다.
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const EditCompanion = () => {
    const postID = window.location.pathname.split("/").pop();
    navigate("/Companion_Write", {
      state: { data: data, mode: "edit", postId: postID },
    });
  };

  const deleteCompanion = async () => {
    const postID = window.location.pathname.split("/").pop();
    try {
      await axios.delete(`http://localhost:3000/companion/${postID}`);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = (ccommentID) => {
    const cpostID = window.location.pathname.split("/").pop();
    axios
      .delete(`${baseURL}companion/comments/${cpostID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // JWT 토큰을 Authorization 헤더에 포함시킵니다.
        },
        data: {
          ccommentID: ccommentID,
        },
      })
      .then(function (response) {
        console.log(response);
        // 서버에서 성공적으로 삭제되면 클라이언트에서도 삭제
        const newComments = comments.filter(
          (comment) => comment.ccommentID !== ccommentID
        );
        setComments(newComments);
      })
      .catch(function (error) {
        console.log(error);
        // 권한이 없는 경우 사용자에게 알려줍니다.
        if (error.response && error.response.status === 403) {
          alert("댓글을 삭제할 권한이 없습니다.");
        }
      });
  };

  const formatText = (text) => {
    return text.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // shiftKey를 체크하여 shift + enter는 줄바꿈으로 작동하게 함.
      event.preventDefault(); // 기본적인 Enter 행동(줄바꿈)을 방지
      addComment();
    }
  };

  // 데이터가 없을때
  if (!data) {
    return <div className="DiaryPage">로딩중입니다...</div>;
  } else {
    return (
      <Page>
        <Top>
          <StyledButton className="back_btn" onClick={() => navigate(-1)}>
            {"<"}
          </StyledButton>
          
          {currentUser && data?.post.userID === currentUser && (
            <>
              <FontAwesomeIcon
                icon={faBars}
                size="2x"
                color={"#f97800"}
                onClick={openModal}
                style={{ cursor: "pointer", marginRight: "25px" }}
              />
              {isModalOpen && (
                <ModalBackground onClick={handleOutsideClick}>
                  <ModalBox onClick={(e) => e.stopPropagation()}>
                    <ModalButton onClick={EditCompanion}>수정</ModalButton>
                    <ModalButton
                      onClick={() => {
                        deleteCompanion(data.post.tpostID);
                        closeModal(); // Optional: Close modal after delete action
                      }}
                    >
                      삭제
                    </ModalButton>
                  </ModalBox>
                </ModalBackground>
              )}
            </>
          )}
        </Top>
        <Title>{data && data.post.title}</Title>
        <ImageContainer>
          <img
            src={`${imgURL}${
              data && data.post.post_images[0].imageURL.replace(/\\/g, "/")
            }`}
          />
        </ImageContainer>
        
        <ProfileContainer>
          <Profile>
            <ProfileImage
              onClick={(e) => {
                e.stopPropagation();
                goUserDetail(data.post.userID);
              }}
            >
              {data.post.users.profileImage === null ? (
                <img
                  alt="chosen"
                  style={{ width: "100%", borderRadius: "100%" }}
                />
              ) : (
                <img
                  src={`${imgURL}${data.post.users.profileImage.replace(
                    /\\/g,
                    "/"
                  )}`}
                  style={{ width: "100%", borderRadius: "100%" }}
                />
              )}
            </ProfileImage>
            <ProfileData>
              <Id>{data && data.post.userID} </Id>
              <UserInfo>
                {data && data.age}세 &nbsp;&nbsp;{" "}
                {data && data.post.users.gender}
              </UserInfo>
            </ProfileData>
          </Profile>
          <JoinButton onClick={() => enterChatRoom()}>채팅방 입장</JoinButton>
        </ProfileContainer>

        <Info>
          <FirstInfo>
            <FontAwesomeIcon
              icon={faLocationDot}
              color="#f97800"
              size="2x"
              style={{ margin: "10px" }}
            />
            <LocationInfo>{data && data.post.location}</LocationInfo>
          </FirstInfo>

          <SecondInfo>
            <FontAwesomeIcon
              icon={faUser}
              color="#f97800"
              size="2x"
              style={{ margin: "10px" }}
            />
            <PeopleInfo>{data && data.post.personnel}명</PeopleInfo>
          </SecondInfo>

          <ThirdInfo>
            <FontAwesomeIcon
              icon={faCalendar}
              size="2x"
              style={{ margin: "10px" }}
            />
            <PeriodInfo>
              <div className="date-wrapper">
                <span>{data && data.post.startDate}</span>
                <span>{data && data.post.finishDate}</span>
              </div>
            </PeriodInfo>
          </ThirdInfo>
        </Info>

        <FourthInfo>
          <AgeInfo>모집 나이 &nbsp;:&nbsp; {data && data.post.age}</AgeInfo>
          <GenderInfo>
            모집 성별 &nbsp;:&nbsp; {data && data.post.pgender}
          </GenderInfo>
        </FourthInfo>

        <Main>
          <Content>{formatText(data && data.post.content)}</Content>
        </Main>

        <TagContainer>
          <TagList>
            {data &&
              data.post.tags &&
              data.post.tags.map((tag) => <TagItem>#{tag.content}</TagItem>)}
          </TagList>
        </TagContainer>

        <CommentSection>
          <h3 style={{ marginLeft: "10px" }}>댓글</h3>
          <CommentInput>
            <textarea
              value={newComment}
              onKeyPress={handleKeyPress}
              onChange={handleNewCommentChange}
              placeholder="댓글을 입력하세요"
            />
            <StyledButtonInput onClick={addComment}>입력</StyledButtonInput>
          </CommentInput>
          <CommentList>
            {comments.map((comment, index) => (
              <Comment key={index}>
                <CommentContent>
                  <CommentProfile>
                    <ProfileImage onClick={(e) => { e.stopPropagation(); goUserDetail(data && data?.post.userID); }}  >
                        {comment.User.profileImage === null ? (
                          <img alt="chosen" style={{ width: "100%", borderRadius: "100%" }} />
                        ) : (
                          <img src={`${imgURL}${comment.User.profileImage.replace(/\\/g, "/")}`}
                            style={{ width: "100%", borderRadius: "100%" }} />
                        )}
                    </ProfileImage>
                    <Id>{comment.userID}</Id>
                  </CommentProfile>
                  <CommentContainer>
                    <CommentContents>
                      {comment.contents}
                    </CommentContents>
                    
                    {currentUser && comment.userID === currentUser && (
                      <Button onClick={() => deleteComment(comment.ccommentID)}>
                        삭제
                      </Button>
                    )}
                  </CommentContainer>
                  <CommentDate>
                    {comment.commentDate
                      ? new Intl.DateTimeFormat("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }).format(new Date(comment.commentDate))
                      : ""}
                  </CommentDate>
                </CommentContent>
              </Comment>
            ))}
          </CommentList>
        </CommentSection>
      </Page>
    );
  }
};

const Page = styled.div`
  margin-top: 100px;

  @media (max-width: 440px) {
    margin-top: 70px;
    padding-top: 10px;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 640px;
  position: fixed;
  top: 0;
  height: 90px;
  background-color: #fff;
  border-bottom: 1px solid #000;
  z-index: 1000;
  button {
    margin-left: 20px;
  }

  @media (max-width: 640px) {
    width: 100%;
    height: 70px; // 모바일 화면에서 높이 조정
  }

  @media (min-width: 601px) and (max-width: 1200px) {
    height: 80px; // 태블릿 화면에서 높이 조정
  }
`;

const StyledButton = styled.button`
  box-sizing: border-box;
  appearance: none;
  background-color: transparent;
  border: 2px solid #f97800;
  border-radius: 0.6em;
  color: #f97800;
  cursor: pointer;
  align-self: center;
  font-family: "Nanum Gothic", sans-serif;
  line-height: 1;
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

  button.back_btn {
    padding: 0.6em 1em;
  }

  @media (max-width: 600px) {
    font-size: 13px;
    padding: 0.4em 1em;
  }

  @media (min-width: 601px) and (max-width: 1200px) {
    font-size: 16px;
    padding: 0.6em 1.5em;
  }

  @media (min-width: 1201px) {
    font-size: 16px;
    padding: 0.6em 1.5em;
  }
`;

const ModalButton = styled.div`
box-sizing: border-box;
appearance: none;
background-color: transparent;
border-radius: 0.6em;
color: #f97800;
cursor: pointer;
align-self: center;
font-size: 16px;
font-family: "Nanum Gothic", sans-serif;
line-height: 1;
padding: 0.6em 2em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-bottom: 10px;

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
`;

const ModalBackground = styled.div`
  position: fixed; // fixed로 변경하여 전체 화면을 차지하도록 합니다.
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 20px;
  z-index: 2000; // ModalBox가 ModalBackground 위에 위치하도록 설정
  @media (min-width: 650px) {
    padding-right: calc(50% - 320px + 20px); // padding으로 오른쪽 위치 조정
  }
`;

const ModalBox = styled.div`
  width: 100px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 2000; // ModalBox가 ModalBackground 위에 위치하도록 설정
`;

const Title = styled.div`
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 28px;
`;

const ImageContainer = styled.div`
  margin: 15px 20px 15px 20px;
  text-align: center;

  img {
    display: block;
    width: 100%;
    margin-bottom: 20px;
    object-fit: cover;
    border-radius: 15px;

    @media (max-width: 600px) {
      width: 100%;
      height: 360px; // 모바일 화면에서의 세로 크기
      object-fit: cover;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
      width: 100%;
      height: 460px; // 태블릿 화면에서의 세로 크기
      object-fit: cover;
    }

    @media (min-width: 1201px) {
      width: 100%;
      height: 580px; // 데스크톱 화면에서의 세로 크기
      object-fit: cover;
    }
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  padding: 10px 20px 10px 30px;
  border-bottom: 2px solid #dadada;
  justify-content: space-between;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  width: 70%;
`;

const ProfileImage = styled.div`
  background-color: rgb(254, 237, 229);
  width: 30px;
  height: 30px;
  border-radius: 80%;
  display: flex;
  align-items: center;

  margin-bottom: 10px;
  cursor: pointer;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileData = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
  margin-top: 1px;
  margin-left: 10px;
  margin-bottom: 10px;
  font-weight: 700;
`;
const Id = styled.div`
  margin-top: 1px;
  font-size: 13px;
  margin-left: 10px;
  font-weight: 700;
`;

const UserInfo = styled.div`
  color: rgb(0, 206, 124);
`;

const JoinButton = styled.div`
  box-sizing: border-box;

  appearance: none;
  background-color: transparent;
  border: 2px solid #f97800;
  border-radius: 0.6em;
  color: #f97800;
  cursor: pointer;
  align-self: center;
  font-size: 16px;
  line-height: 1;

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


  @media (max-width: 600px) {
    font-size: 13px;
    padding: 0.3em 0.3em;
  }

  @media (min-width: 601px) and (max-width: 1200px) {
    font-size: 16px;
    padding: 0.5em 0.5em;
  }

  @media (min-width: 1201px) {
    font-size: 16px;
    padding: 0.5em 0.5em;
  }


}`;

const Info = styled.div`
  padding: 10px 30px 10px 30px;
  margin: 20px;
  display: flex;
  justify-content: space-between;
  text-align: center;
  border-bottom: 1px solid #dadada;

  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const FirstInfo = styled.div`
  font-size: 15px;
  font-weight: 700;
`;

const LocationInfo = styled.div`
  @media (max-width: 400px) {
    max-width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
`;

const SecondInfo = styled.div`
  font-size: 15px;
  font-weight: 700;
`;

const PeopleInfo = styled.div``;

const ThirdInfo = styled.div`
  font-size: 15px;
  font-weight: 700;
`;

const PeriodInfo = styled.div`
  .date-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FourthInfo = styled.div`
  padding: 0px 0px 10px 10px;
  margin: 20px;
  color: gray;
  font-size: 14px;
  font-weight: 700;
`;

const AgeInfo = styled.div``;

const GenderInfo = styled.div``;

const TagContainer = styled.div`
  margin-left: 30px;
`;

const TagList = styled.div`
  display: flex;
`;

const TagItem = styled.div`
  background-color: #dddddd;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  padding: 5px;
  margin-left: 5px;
  cursor: pointer;
`;

const Main = styled.div`
  margin: 20px;
  padding: 10px;
`;

const Content = styled.div`
  padding-bottom: 10px;
  font-size: 18px;
  font-weight: 800;
  line-height: 25px;
`;

const CommentSection = styled.div`
  border-top: 2px solid rgb(234, 235, 239);
  margin: 20px 0;
  padding-left: 10px;
`;

const CommentInput = styled.div`
  display: flex;
  justify-content: space-between;

  textarea {
    width: 90%;
    resize: none;
    border: none;
    border-bottom: 1px solid rgb(234, 235, 239);
    margin-left: 5px;
    padding-top: 15px;
  }
`;

const StyledButtonInput = styled.div`
  box-sizing: border-box;
  appearance: none;
  border: 1px solid #000;
  border-radius: 10px;
  color: gray;
  cursor: pointer;
  align-self: center;
  font-size: 14px;
  font-family: "Nanum Gothic", sans-serif;
  line-height: 1;
  padding: 0.5em 0.5em;
  text-decoration: none;
  letter-spacing: 2px;
  font-weight: 700;
  margin-left: 10px;
  margin-right: 10px;
`;

const CommentList = styled.div`
  margin-left: 10px;
`;

const Comment = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #dadada;
  margin-right: 10px;
`;

const CommentContent = styled.div`
  white-space: pre-wrap; // 띄어쓰기와 줄바꿈을 유지하면서 필요한 경우에만 줄바꿈
`;

const CommentProfile = styled.div`
display: flex;
`

const CommentContainer = styled. div`
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom:5px;
`

const CommentContents = styled.div`
  font-size: 15px;
  font-weight: 700;
`;

const Button = styled.div`
  margin-right: 6px;
  appearance: none;
  border: none;
  color: red;
  cursor: pointer;
  align-self: center;
  font-size: 13px;
  padding: 0.5em 0.5em;
  text-decoration: none;
  letter-spacing: 2px;
  font-weight: 700;
`;

const CommentDate = styled.div`
  font-size: 0.8em;
  color: gray;
  margin-bottom: 5px;
`;

export default Companion_Detail;
