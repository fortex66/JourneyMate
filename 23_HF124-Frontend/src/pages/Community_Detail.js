import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Detail_Nav from "../components/Detail_Nav";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faLocationDot } from "@fortawesome/free-solid-svg-icons";

const Community_Detail = () => {
  const navigate = useNavigate();
  const { postId } = useParams(); // postId 추출
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [data, setData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagTriggered, setTagTriggered] = useState(true); //Community에 searchTriggered값을 true로
  const [posts, setPosts] = useState([]);
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // shiftKey를 체크하여 shift + enter는 줄바꿈으로 작동하게 함!
      event.preventDefault(); // 기본적인 Enter 행동(줄바꿈)을 방지!
      addComment();
    }
  };
  console.log(data)
  const baseURL = "http://localhost:3000/";
  const imgURL = "https://journeymate.s3.ap-northeast-2.amazonaws.com/";
  function openModal() {
    setIsModalOpen(true);
  }

    const goUserDetail = (userId) => {
        navigate(`/UserDetail/${userId}`);
    };

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
                const responsePost = await axios.get(
                    baseURL + `community/${postId}`
                ); // postId를 API 호출에 사용하여 게시글 데이터 가져오기

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
            .post(`${baseURL}community/comments/${tpostID}`, newCommentObject, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            })
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
                <StyledButton className="back_btn" onClick={() => navigate(-1)}>
                    {"<"}
                </StyledButton>
                {currentUser && data?.post?.userID === currentUser && (
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
                                    <ModalButton onClick={EditCommunity}>
                                        수정
                                    </ModalButton>
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
            <TitleContainer>
                <Title> {data && data.post.title} </Title>
                <DetailInfo>
                    <Profile>
                        <ProfileImage
                            onClick={(e) => {
                                e.stopPropagation();
                                goUserDetail(data && data?.post.userID);
                            }}
                        >
                            {data && data?.post.User.profileImage === null ? (
                                <img
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            ) : (
                                <img
                                    src={`${imgURL}${data?.post.User.profileImage.replace(
                                        /\\/g,
                                        "/"
                                    )}`}
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            )}
                        </ProfileImage>
                        <Id>{data && data?.post.userID}</Id>
                    </Profile>
                    <PostDate>
                        {new Intl.DateTimeFormat("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        }).format(new Date(data && data.post.postDate))}
                    </PostDate>
                </DetailInfo>
            </TitleContainer>

            <Location>
                <FontAwesomeIcon
                    icon={faLocationDot}
                    color="#f97800"
                    style={{ marginRight: "8px" }}
                />
                {data && data.post.location}
            </Location>

            <MainContainer>
                {data &&
                    data.post.post_images.map((posts, index) => (
                        <Main key={index}>
                            <img
                                src={`${imgURL}${posts.imageURL.replace(
                                    /\\/g,
                                    "/"
                                )}`}
                                style={{ maxWidth: "600px", height: "auto" }}
                            />
                            <Content>{posts.content}</Content>
                        </Main>
                    ))}
            </MainContainer>

            <TagContainer>
                <TagList>
                    {data &&
                        data.post.tags &&
                        data.post.tags.map((tag, index) => (
                            <TagItem
                                key={index}
                                onClick={async () => {
                                    navigate("/Community", {
                                        state: {
                                            posts,
                                            tagList: tag.content,
                                            tagTriggered,
                                        },
                                    });
                                }}
                            >
                                #{tag.content}
                            </TagItem>
                        ))}
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
                    <StyledButtonInput onClick={addComment}>
                        등록
                    </StyledButtonInput>
                </CommentInput>
                <CommentList>
                    {comments.map((comment, index) => (
                        <Comment key={index}>
                            <CommentContent>
                                <Profile>
                                    <ProfileImage
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            goUserDetail(
                                                data && data?.post.userID
                                            );
                                        }}
                                    >
                                        {comment.User.profileImage === null ? (
                                            <img
                                                alt="chosen"
                                                style={{
                                                    width: "100%",
                                                    borderRadius: "100%",
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={`${imgURL}${comment.User.profileImage.replace(
                                                    /\\/g,
                                                    "/"
                                                )}`}
                                                style={{
                                                    width: "100%",
                                                    borderRadius: "100%",
                                                }}
                                            />
                                        )}
                                    </ProfileImage>
                                    <Id>{comment.userID}</Id>
                                </Profile>
                                <CommentContainer>
                                    <CommentContents>
                                        {comment.contents}
                                    </CommentContents>

                                    {currentUser &&
                                        comment.userID === currentUser && (
                                            <Button
                                                onClick={() =>
                                                    deleteComment(
                                                        comment.tcommentId
                                                    )
                                                }
                                            >
                                                삭제
                                            </Button>
                                        )}
                                </CommentContainer>

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
    font-size: 13px;
    font-weight: 700;
    padding: 5px;
    margin-left: 5px;
    cursor: pointer;
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

const TitleContainer = styled.div`
    margin: 20px 20px 10px 20px;
    padding-bottom: 5px;
    border-bottom: 1px solid #dadada;
`;

const Title = styled.div`
    text-align: center;
    font-weight: bold;
    font-size: 28px;
    margin-bottom: 10px;
`;

const DetailInfo = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 10px 0px 10px;
`;

const Profile = styled.div`
    display: flex;
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

const Id = styled.div`
    margin-top: 1px;
    font-size: 13px;
    margin-left: 10px;
    font-weight: 700;
`;

const PostDate = styled.div`
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: gray;
`;

const Location = styled.div`
    font-weight: 700;
    font-size: 15px;
    color: gray;
    margin: 20px 0px 20px 25px;
`;

const MainContainer = styled.div``;

const Main = styled.div`
    margin: 5px 20px 15px 20px;
    text-align: center;
    img {
        display: block;
        width: 100%;
        height: 600px;
        margin-bottom: 20px;
        object-fit: cover;

        @media (max-width: 600px) {
            width: 100%;
            height: 360px; // 모바일 화면에서의 세로 크기
        }

        @media (min-width: 601px) and (max-width: 1200px) {
            width: 100%;
            height: 460px; // 태블릿 화면에서의 세로 크기
        }

        @media (min-width: 1201px) {
            width: 100%;
            height: 580px; // 데스크톱 화면에서의 세로 크기
        }
    }
`;

const Content = styled.div`
    padding-bottom: 20px;
    white-space: pre-line;
    text-align: left;
    font-weight: 700;
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

const CommentContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
`;

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

export default Community_Detail;
