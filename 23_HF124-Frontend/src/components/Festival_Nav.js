import React, { useState, useEffect } from "react";
import "../pages/listForm.css";
import styled from "styled-components";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faComment as faCommentRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { faShareSquare as faShareSquareRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faComment as faCommentSolid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";

const baseURL = "http://localhost:3000/";

const Detail_Nav = () => {
    const [activeHeart, setActiveHeart] = useState(false);
    const [activeComment, setActiveComment] = useState(false);
    const [activeBookmark, setActiveBookmark] = useState(false);
    const [likeCount, setLikeCount] = useState();
    const [commentCount, setCommentCount] = useState(); // 댓글 수를 저장할 상태를 추가
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const getCommentCount = async () => {
        const tpostID = window.location.pathname.split("/").slice(-1)[0];

        try {
            const response = await axios.get(
                baseURL + `community/commentCount/${tpostID}`,
                {
                    params: {
                        tpostID: tpostID,
                    }, // URL 수정
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "jwtToken"
                        )}`,
                    },
                }
            );
            setCommentCount(response.data.commentCount);
        } catch (error) {
            console.error(error);
        }
    };

    const checkLikeStatus = async () => {
        const tpostID = window.location.pathname.split("/").pop();
        console.log("하트 스테이터스:", tpostID);
        try {
            const response = await axios.get(baseURL + `like/status`, {
                params: {
                    tpostID: tpostID,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });

            setActiveHeart(response.data.isLiked);
            console.log("하트 스테이터스 2차:", response);
        } catch (error) {
            console.error(error);
        }
    };

    const getLikeCount = async () => {
        const tpostID = window.location.pathname.split("/").pop();

        try {
            const response = await axios.get(baseURL + `like/likeCount`, {
                params: {
                    tpostID: tpostID,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });

            setLikeCount(response.data.likeCount);
        } catch (error) {
            console.error(error);
        }
    };

    const handleHeartClick = async () => {
        const tpostID = window.location.pathname.split("/").pop();

        try {
            const response = await axios.post(
                baseURL + `like`,
                {
                    tpostID: tpostID,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "jwtToken"
                        )}`,
                    },
                }
            );

            console.log(response.data);
            setActiveHeart(!activeHeart);
            getLikeCount(); // 좋아요 수를 업데이트합니다.
        } catch (error) {
            console.error(error);
        }
    };

    const handleBookmarkClick = async () => {
        setModalMessage("스크랩 되었습니다");
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
        }, 2000);
        const tpostID = window.location.pathname.split("/").pop();

        try {
            const response = await axios.post(
                baseURL + `community/scrap`,
                {
                    tpostID: tpostID,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "jwtToken"
                        )}`,
                    },
                }
            );

            console.log(response.data);
            setActiveBookmark(!activeBookmark);
        } catch (error) {
            console.error(error);
        }
    };

    const checkScrapStatus = async () => {
        const tpostID = window.location.pathname.split("/").pop();
        console.log("스테이터스:", tpostID);
        try {
            const response = await axios.get(baseURL + `community/status`, {
                params: {
                    tpostID: tpostID,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });

            setActiveBookmark(response.data.isScrap);
            console.log("스테이터스 2차:", response);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCommentClick = () => {
        setActiveComment(!activeComment);
        getCommentCount(); // 댓글 수를 업데이트합니다.
    };

    const copyLinkToClipboard = async () => {
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        alert("링크가 복사되었습니다!");
    };

    useEffect(() => {
        checkScrapStatus(); // 스크랩 상태 체크
        checkLikeStatus(); // 좋아요 상태 체크
        getLikeCount(); // 좋아요 수
        getCommentCount(); // 댓글 수
    }, []);

    return (
        <Navigation>
            <Bottomview>
                <BottomBox>
                    <NavBox>
                        <FontAwesomeIcon
                            icon={activeHeart ? faHeartSolid : faHeartRegular}
                            size="2x"
                            onClick={handleHeartClick}
                            color={activeHeart ? "red" : ""}
                        />
                        <span>{likeCount}</span>
                    </NavBox>
                    <NavBox>
                        <FontAwesomeIcon
                            icon={
                                activeComment
                                    ? faCommentSolid
                                    : faCommentRegular
                            }
                            size="2x"
                            onClick={handleCommentClick}
                            color={activeComment ? "#F97800" : ""}
                        />
                        <span>{commentCount}</span>
                    </NavBox>

                    <NavBox>
                        <FontAwesomeIcon
                            icon={
                                activeBookmark
                                    ? faBookmarkSolid
                                    : faBookmarkRegular
                            }
                            size="2x"
                            onClick={handleBookmarkClick}
                            color={activeBookmark ? "#FFE600" : ""}
                        />
                    </NavBox>

                    <NavBox>
                        <FontAwesomeIcon
                            icon={faShareSquareRegular}
                            size="2x"
                            onClick={copyLinkToClipboard}
                        />
                    </NavBox>
                </BottomBox>
            </Bottomview>
            {showModal && <Modal>{modalMessage}</Modal>}
        </Navigation>
    );
};

const Navigation = styled.div`
    position: relative;
    min-height: 100vh;
    box-sizing: border-box;
    height: auto;
    overflow-y: auto;
    padding-bottom: 100px;

    @media (max-width: 600px) {
        padding-bottom: 80px;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        padding-bottom: 90px;
    }
`;

const Bottomview = styled.div`
    cursor: pointer;
    width: 100%; /* 모든 화면 크기에 대해 100%를 설정하여 가로 길이를 유동적으로 조정합니다. */
    max-width: 640px; /* 그러나 최대 너비를 640px로 제한하여 큰 화면에서도 적절한 크기를 유지합니다. */
    position: fixed;
    bottom: 0;
    height: 90px;
    background-color: white;

    @media (max-width: 600px) {
        height: 60px; /* 모바일 화면에 대해 높이를 조정합니다. */
        width: 100%;
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        height: 70px; /* 태블릿 화면에 대해 높이를 조정합니다. */
    }
`;

const BottomBox = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

const NavBox = styled.div`
    flex: 1; /* flex-grow, flex-shrink, flex-basis 값을 한 번에 지정할 수 있는 속성을 사용하여 요소 간 공간 분배를 조정합니다. */
    height: 100%;
    border-top: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;

    &:last-child {
        border-right: none; /* 마지막 요소의 오른쪽 테두리를 제거합니다. */
    }

    svg {
        font-size: 32px; // 기본 아이콘 크기 설정
    }

    @media (max-width: 480px) {
        svg {
            font-size: 20px; // 모바일 화면에서 아이콘 크기 조정
        }
    }
`;

const Modal = styled.div`
    position: fixed;
    left: 50%;
    top: 80%;
    transform: translate(-50%, -50%);
    background-color: #333333;
    color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export default Detail_Nav;
