import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Detail_Nav from "../components/Detail_Nav";
import axios from "axios";

const Community_Detail = () => {
  const navigate = useNavigate();
  const { postId } = useParams();  // postId 추출
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [data, setData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const baseURL = "http://localhost:3000/";

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");

    setCurrentUser(jwtToken);
    const fetchData = async () => {
      try {
        const responsePost = await axios.get(baseURL + `community/${postId}`); // postId를 API 호출에 사용하여 게시글 데이터 가져오기
        setData(responsePost.data);
        console.log(responsePost.data)
        const responseComments = await axios.get(baseURL + `community/comments/${postId}`); // postId를 API 호출에 사용하여 댓글 데이터 가져오기
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
      `http://localhost:3000/community/comments/${tpostID}`, 
      newCommentObject,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
      }
    )
    .then(function (response) {
      setComments(prevComments => [...prevComments, response.data]);
      setNewComment("");  // 댓글 작성 후 작성창을 비웁니다.
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  const deleteCommunity = async () => {
    const postID = window.location.pathname.split("/").pop();
    try {
      await axios.delete(`http://localhost:3000/community/${postID}`);
      navigate(-1);
      
    } catch (error) {
      console.log(error);
    }
  };
  

  const deleteComment = (tcommentId) => {
    const tpostID = window.location.pathname.split("/").pop();
    axios
      .delete(`http://localhost:3000/community/comments/${tpostID}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // JWT 토큰을 Authorization 헤더에 포함시킵니다.
        },
        data: {
          tcommentId: tcommentId,
        },
      })
      .then(function (response) {
        console.log(response);
        // 서버에서 성공적으로 삭제되면 클라이언트에서도 삭제
        const newComments = comments.filter(comment => comment.tcommentId !== tcommentId);
        setComments(newComments);
      })
      .catch(function (error) {
        console.log(error);
        // 권한이 없는 경우 사용자에게 알림
        if (error.response && error.response.status === 403) {
          alert('댓글을 삭제할 권한이 없습니다.');
        }
      });
  };
  
  return (
    <Page>
      <Top>
        <StyledButton onClick={() => navigate(-1)}>{"<"}</StyledButton>
        <Button>
          {currentUser && data?.post.userID === currentUser && ( 
            <button onClick={() => deleteCommunity(data.post.tpostID)}>
              삭제
            </button>
          )}
        </Button>
      </Top>
      <Title>{data && data.post.title}</Title>
      <Info>
        위치 : {data && data.post.location}
        <br />
        태그 : {data && data.post.tags.map(tag => tag.content).join(', ')}
      </Info>
      <div>
        {data && data.post.post_images.map((posts,index)=>(
          <Main key={index}>
          <img src={`${baseURL}${posts.imageURL.replace(/\\/g, '/')}`} style={{ maxWidth: "600px", height: "auto" }} />
          <Content>{posts.content}</Content>
        </Main>
        ))}
        
      </div>
      <CommentSection>
      <h3>댓글</h3>
      <CommentInput>
        <textarea
          value={newComment}
          onChange={handleNewCommentChange}
          placeholder="댓글을 입력하세요"
        />
        <StyledButton onClick={addComment}>입력</StyledButton>
      </CommentInput>
      <CommentList>
          {comments.map((comment, index) => (
            <Comment key={index}>
              <CommentContent>
                {comment.userID}: {comment.contents}
                <CommentDate>
                  {new Intl.DateTimeFormat('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }).format(new Date(comment.commentDate))}
                </CommentDate>
              </CommentContent>
              <Button>
                {currentUser && comment.userID === currentUser && (
                  <button onClick={() => deleteComment(comment.tcommentId)}>
                    삭제
                  </button>
                )}
              </Button>
            </Comment>
          ))}
      </CommentList>
    </CommentSection>
      <Detail_Nav />
    </Page>
  );
  
};

const CommentDate = styled.div`
  font-size: 0.8em;
  color: gray;
`;

const Page = styled.div`
  margin-top: 40px;
`;

const Top = styled.div`
  margin-left: 20px;
  margin-right: 20px;
`;

const Title = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 20px;
`;

const Info = styled.div`
  margin-left: 20px;
  margin-right: 20px;
`;

const Main = styled.div`
  background-color: rgb(240, 240, 240);
  margin: 0px 20px 20px 20px;
  text-align: center;
  img {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const Content = styled.div`
  padding-bottom: 20px;
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
  }
`;

const CommentList = styled.div`
  margin-top: 20px;
`;

const Comment = styled.div`
  padding: 10px;
  background-color: #f0f0f0;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between; // 삭제 버튼을 오른쪽 끝으로 밀어내기 위해 추가
`;

const CommentContent = styled.div`
  white-space: pre-wrap; // 띄어쓰기와 줄바꿈을 유지하면서 필요한 경우에만 줄바꿈
`;

const Button = styled.div`
  display: flex;
  align-items: center;
`;

const StyledButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
  }
`;

export default Community_Detail;
