import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Detail_Nav from "../components/Detail_Nav";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Community_Detail = () => {
  const navigate = useNavigate();
  const { postId } = useParams(); // postId 추출
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [data, setData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // shiftKey를 체크하여 shift + enter는 줄바꿈으로 작동하게 함.
      event.preventDefault(); // 기본적인 Enter 행동(줄바꿈)을 방지
      addComment();
    }
  };
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
  // console.log(typeof(data.post.postDate))
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");

    setCurrentUser(jwtToken);

    const fetchData = async () => {
      try {
        const responsePost = await axios.get(baseURL + `community/${postId}`); // postId를 API 호출에 사용하여 게시글 데이터 가져오기
        setData(responsePost.data);
        const responseComments = await axios.get(
          baseURL + `community/comments/${postId}`
        ); // postId를 API 호출에 사용하여 댓글 데이터 가져오기
        setComments(responseComments.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleNewCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const addComment = () => {
    const newCommentObject = {
      contents: newComment,
      commentDate: new Date().toISOString(),
    };

    const tpostID = window.location.pathname.split("/").pop();
    axios
      .post(
        `${baseURL}community/comments/${tpostID}`,
        newCommentObject,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      )
      .then(function (response) {
        setComments((prevComments) => [...prevComments, response.data]);
        setNewComment(""); // 댓글 작성 후 작성창을 비웁니다.
      })
      .catch(function (error) {
        console.log(error);
      });
  };




  const EditCommunity = () => {
    const postID = window.location.pathname.split("/").pop();
    navigate("/Community_Write", {
      state: { data: data, mode: "edit", postId: postID },
    });
  };

  const deleteCommunity = async () => {
    const postID = window.location.pathname.split("/").pop();
    try {
      await axios.delete(`${baseURL}community/${postID}`);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = (tcommentId) => {
    const tpostID = window.location.pathname.split("/").pop();
    axios
      .delete(`${baseURL}community/comments/${tpostID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // JWT 토큰을 Authorization 헤더에 포함시킵니다.
        },
        data: {
          tcommentId: tcommentId,
        },
      })
      .then(function (response) {
        console.log(response);
        // 서버에서 성공적으로 삭제되면 클라이언트에서도 삭제
        const newComments = comments.filter(
          (comment) => comment.tcommentId !== tcommentId
        );
        setComments(newComments);
      })
      .catch(function (error) {
        console.log(error);
        // 권한이 없는 경우 사용자에게 알림
        if (error.response && error.response.status === 403) {
          alert("댓글을 삭제할 권한이 없습니다.");
        }
      });
  };

  return (
    <Page>
      <Top>
        <StyledButton onClick={() => navigate(-1)}>{"<"}</StyledButton>
        {currentUser && data?.post.userID === currentUser && (
          <>
            <FontAwesomeIcon
              icon={faBars}
              size="2x"
              color={"#f97800"}
              onClick={openModal}
            />
            {isModalOpen && (
              <ModalBackground onClick={handleOutsideClick}>
                <ModalBox onClick={(e) => e.stopPropagation()}>
                  <ModalButton onClick={EditCommunity}>수정</ModalButton>
                  <ModalButton
                    onClick={() => {
                      deleteCommunity(data.post.tpostID);
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
      <PostDate>업로드 : {new Intl.DateTimeFormat("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }).format(new Date(data && data.post.postDate))}</PostDate>
      <Info>위치 : {data && data.post.location}</Info>

      <div>
        {data &&
          data.post.post_images.map((posts, index) => (
            <Main key={index}>
              <img
                src={`${imgURL}${posts.imageURL.replace(/\\/g, "/")}`}
                style={{ maxWidth: "600px", height: "auto" }}
              />
              <Content>{posts.content}</Content>
            </Main>
          ))}
      </div>

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
                {comment.userID}: {comment.contents}
                <CommentDate>
                  {new Intl.DateTimeFormat("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }).format(new Date(comment.commentDate))}
                </CommentDate>
              </CommentContent>

              {currentUser && comment.userID === currentUser && (
                <Button onClick={() => deleteComment(comment.tcommentId)}>
                  삭제
                </Button>
              )}
            </Comment>
          ))}
        </CommentList>
      </CommentSection>
      <Detail_Nav />
    </Page>
  );
};
const TagContainer = styled.div`
  margin-left: 15px;
`;

const TagList = styled.div`
  display: flex;
`;
const TagItem = styled.div`
  background-color: #dddddd;
  border-radius: 10px;
  font-size: 11px;
  padding: 5px;
  margin-left: 5px;
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

const CommentDate = styled.div`
  font-size: 0.8em;
  color: gray;
`;
const StyledButtonInput = styled.div`
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
padding: 0.5em 0.5em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-bottom: 10px;
margin-left:10px;
margin-right:10px;

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

const StyledButton = styled.button`
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
padding: 0.6em 1.5em;
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
button.back_btn {
padding: 0.6em 1em;
}
`;

const Page = styled.div`
  margin-top: 20px;
`;

const Top = styled.div`
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dadada;
  button {
    margin-right: 5px;
  }
`;

const Title = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  margin-top: 20px;
`;
const PostDate = styled.div`
  text-align: left;
  font-size: 13px;
  margin-left: 25px;
  margin-bottom: -10px;
`;
const Info = styled.div`
  border: 1px solid #f97800;
  border-radius: 15px;
  padding: 10px;
  margin: 20px;
`;

const Main = styled.div`
  margin: 0px 20px 20px 20px;
  text-align: center;
  img {
    margin-bottom: 20px;
  }
`;

const Content = styled.div`
  padding-bottom: 20px;
  border: 1px solid #dadada;
  border-radius: 10px;
  white-space: pre-line;
`;

const CommentSection = styled.div`
  border-top: 2px solid rgb(234, 235, 239);
  margin: 20px 0;
`;

const CommentInput = styled.div`
  display: flex;
  justify-content: space-between;

  textarea {
    width: 90%;
    height: 30px;
    resize: none;
    border-radius: 10px;
    margin-left: 5px;
  }
`;

const CommentList = styled.div`
  margin-left: 10px;
`;

const Comment = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #dadada;
  margin-right: 10px;
  display: flex;
  justify-content: space-between; // 삭제 버튼을 오른쪽 끝으로 밀어내기 위해 추가
`;

const CommentContent = styled.div`
  white-space: pre-wrap; // 띄어쓰기와 줄바꿈을 유지하면서 필요한 경우에만 줄바꿈
`;

const Button = styled.div`
margin-right:6px;
box-sizing: border-box;
appearance: none;
background-color: transparent;
border: 2px solid #dadada;
border-radius: 0.6em;
color: #dadada;
cursor: pointer;
align-self: center;
font-size: 10px;
font-family: "Nanum Gothic", sans-serif;
line-height: 1;
padding: 0.5em 0.5em;
text-decoration: none;
letter-spacing: 2px;
font-weight: 700;
margin-bottom: 10px;
margin-left:50px;


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
export default Community_Detail;