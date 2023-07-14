import { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CompanionStateContext } from "../App";
import styled from "styled-components";
import Detail_Nav from "../components/Detail_Nav";

const Companion_Detail = () => {
  const { id } = useParams();
  const companion_list = useContext(CompanionStateContext);
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (companion_list.length >= 1) {
      const targetCommunity = companion_list.find(
        (it) => parseInt(it.id) === parseInt(id)
      );

      if (targetCommunity) {
        //일기가 존재할 때
        setData(targetCommunity);
      } else {
        //일기가 없을 때
        alert("없는 글입니다.");
        navigate("/Community", { replace: true });
      }
    }
  }, [id, companion_list]);

  const handleNewCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const addComment = () => {
    setComments([...comments, newComment]);
    setNewComment("");
  };

  // 데이터가 없을때
  if (!data) {
    return <div className="DiaryPage">로딩중입니다...</div>;
  } else {
    return (
      <Page>
        <Top>
          <StyledButton onClick={() => navigate(-1)}>{"<"}</StyledButton>
        </Top>
        <Title>{data.title}</Title>
        <Info>
          위치 : {data.location}
          <br />
          태그 : {data.tag}
          <br />
          성별 : {data.gender}
          <br />
          나이 : {data.age}
          <br />
          여행시작날짜 : {data.start_date}
          <br />
          여행종료날짜 : {data.finish_date}
          <br />
          여행인원 : {data.personnel}
        </Info>
        <div>
          {data.photo && (
            <div>
              <Main>
                <img
                  src={URL.createObjectURL(data.photo)}
                  width="250"
                  height="250"
                  alt="post"
                />
              </Main>
              <Content>{data.content}</Content>
            </div>
          )}
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
              <Comment key={index}>{comment}</Comment>
            ))}
          </CommentList>
        </CommentSection>
        <Detail_Nav />
      </Page>
    );
  }
};

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

export default Companion_Detail;
