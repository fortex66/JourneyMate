import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import Navigationbar from "../components/Navigationbar";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faComment as faCommentSolid } from "@fortawesome/free-solid-svg-icons";
import {
    faPen,
    faChevronUp,
    faAngleLeft,
    faAngleRight,
    faUsers,
    faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Slick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Cmodal from "../components/Cmodal";
import Pmodal from "../components/Pmodal";

const baseURL = "http://localhost:3000/";
const imgURL = "https://journeymate.s3.ap-northeast-2.amazonaws.com/";

const Community = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({ posts: { rows: [] } });
    const [page, setPage] = useState(1);
    const [totalpage, setTotalpage] = useState();
    const [sort, setSort] = useState("latest");
    const [write, setWrite] = useState(false);
    const [change, setChange] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [buttonPosition, setButtonPosition] = useState("20px");
    const [userData, setUserData] = useState(null);
    const [image, setImage] = useState(null);
    const observer = useRef();

    const location = useLocation();
    const searchTriggered = location.state?.searchTriggered || false;
    const locationTriggered = location.state?.locationTriggered || false;
    const tagTriggered = location.state?.tagTriggered || false;
    const tagList = location.state ? location.state.tagList : [];
    const selectedLocation = location.state ? location.state.location : "";
    const title = location.state ? location.state.title : "";

    useEffect(() => {
        const updateButtonPosition = () => {
            const windowWidth = window.innerWidth;
            const breakpoint = 600;
            if (windowWidth > breakpoint) {
                setButtonPosition(`${(windowWidth - breakpoint) / 2}px`);
            } else {
                setButtonPosition("0px");
            }
        };

        // Set initial position
        updateButtonPosition();

        // Update position on window resize
        window.addEventListener("resize", updateButtonPosition);

        // Clean up
        return () => {
            window.removeEventListener("resize", updateButtonPosition);
        };
    }, []);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // optional
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const lastPostElementRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    if (page < totalpage) {
                        setPage((prevPage) => prevPage + 1);
                    }
                }
            });
            if (node) observer.current.observe(node);
        },
        [page, totalpage]
    );

    const handleSearchClick = () => {
        navigate("/Search");
    };

    const goDetail = (postId) => {
        navigate(`/Community_Detail/${postId}`); // detailData에 user프로필 사진과 userID를 넣어서 넘김
    };

    const goUserDetail = (userId) => {
        navigate(`/UserDetail/${userId}`);
    };

    useEffect(() => {
        if (searchTriggered + locationTriggered + tagTriggered != 0) return; // 검색이 실행되면 아무 것도 하지 않습니다.
        const fetchMoreData = async () => {
            try {
                if (page >= data.total_pages) {
                    // 마지막 페이지 확인
                    return;
                }
                const response = await axios.get(
                    `${baseURL}community/?page=${page}&sort=${sort}`
                );
                setData((prevData) => ({
                    ...prevData,
                    posts: {
                        ...prevData.posts,
                        rows: [
                            ...prevData.posts.rows,
                            ...response.data.posts.rows,
                        ],
                    },
                    total_pages: response.data.total_pages,
                }));
                setTotalpage(response.data.total_pages);
            } catch (error) {
                console.log(error);
            }
        };
        if (page > 1 || !searchTriggered) {
            // 페이지가 1보다 크거나, 검색이 실행되지 않은 경우에 추가 결과를 불러옵니다.
            fetchMoreData();
        }
    }, [page, searchTriggered, sort]); // 의존성 배열에 page를 추가합니다.

    useEffect(() => {
        if (searchTriggered + locationTriggered + tagTriggered === 0) return;

        const fetchData = async () => {
            try {
                if (searchTriggered) {
                    if (selectedLocation || tagList || title) {
                        const response = await axios.get(
                            `${baseURL}community/search`,
                            {
                                params: {
                                    page,
                                    tags: tagList.join(","),
                                    location: selectedLocation
                                        ? selectedLocation
                                        : null,
                                    title: title,
                                    sort,
                                },
                            }
                        );
                        if (page > 1) {
                            // 페이지가 1보다 크면 기존 데이터에 추가
                            setData((prevData) => ({
                                ...prevData,
                                posts: {
                                    ...prevData.posts,
                                    rows: [
                                        ...prevData.posts.rows,
                                        ...response.data.posts.rows,
                                    ],
                                },
                                total_pages: response.data.total_pages,
                            }));
                        } else {
                            // 페이지가 1이면 새로운 데이터로 설정
                            setData(response.data);
                            setTotalpage(response.data.total_pages);
                        }
                    }
                } else if (locationTriggered) {
                    if (selectedLocation) {
                        const response = await axios.get(
                            `${baseURL}community/search`,
                            {
                                params: {
                                    page,
                                    location: selectedLocation
                                        ? selectedLocation
                                        : null,
                                    sort,
                                },
                            }
                        );
                        if (page > 1) {
                            // 페이지가 1보다 크면 기존 데이터에 추가
                            setData((prevData) => ({
                                ...prevData,
                                posts: {
                                    ...prevData.posts,
                                    rows: [
                                        ...prevData.posts.rows,
                                        ...response.data.posts.rows,
                                    ],
                                },
                                total_pages: response.data.total_pages,
                            }));

                            setTotalpage(response.data.total_pages);
                        } else {
                            // 페이지가 1이면 새로운 데이터로 설정
                            setData(response.data);
                            setTotalpage(response.data.total_pages);
                        }
                    }
                } else if (tagTriggered) {
                    if (tagList) {
                        const response = await axios.get(
                            `${baseURL}community/search`,
                            {
                                params: {
                                    page,
                                    tags: tagList,
                                    sort,
                                },
                            }
                        );
                        if (page > 1) {
                            // 페이지가 1보다 크면 기존 데이터에 추가
                            setData((prevData) => ({
                                ...prevData,
                                posts: {
                                    ...prevData.posts,
                                    rows: [
                                        ...prevData.posts.rows,
                                        ...response.data.posts.rows,
                                    ],
                                },
                                total_pages: response.data.total_pages,
                            }));

                            setTotalpage(response.data.total_pages);
                        } else {
                            // 페이지가 1이면 새로운 데이터로 설정
                            setData(response.data);
                            setTotalpage(response.data.total_pages);
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [
        selectedLocation,
        tagList,
        searchTriggered,
        locationTriggered,
        tagTriggered,
        page,
        sort,
    ]);

    if (!data || !data.posts || !data.posts.rows) return null;

    //
    function PostItem({
        post,
        goDetail,
        goUserDetail,
        imgURL,
        lastPostElementRef,
    }) {
        const slickRef = useRef();

        const previous = () => {
            slickRef.current.slickPrev();
        };

        const next = () => {
            slickRef.current.slickNext();
        };

        const settings = {
            dots: true,
            dotsClass: "slick-dots slick-thumb",
            arrows: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
        };

        return (
            <CommunityItem
                ref={lastPostElementRef}
                onClick={() => goDetail(post.tpostID)}
            >
                <div>
                    <DetailInfo>
                        <ProfileImage
                            onClick={(e) => {
                                e.stopPropagation(); // 부모로의 클릭 이벤트 전파를 중단합니다.
                                goUserDetail(post.userID);
                            }}
                        >
                            {post.User.profileImage === null ? (
                                <img
                                    alt="chosen"
                                    style={{
                                        width: "100%",
                                        borderRadius: "100%",
                                    }}
                                />
                            ) : (
                                <img
                                    src={`${imgURL}${post.User.profileImage.replace(
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
                        <Id>{post.userID}</Id>
                    </DetailInfo>
                    <Picture>
                        <Slick ref={slickRef} {...settings}>
                            {post.post_images.map((image, index) => (
                                <div key={index}>
                                    <img
                                        src={`${imgURL}${image.imageURL.replace(
                                            /\\/g,
                                            "/"
                                        )}`}
                                        alt={`Slide ${index}`}
                                    />
                                </div>
                            ))}
                        </Slick>
                        {post.post_images.length > 1 && (
                            <>
                                <button
                                    style={{
                                        position: "absolute",
                                        top: "calc(50% - 50px)",
                                        left: 0,
                                        padding: 0,
                                        width: 30,
                                        height: 30,
                                        borderRadius: "50%",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        previous();
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faAngleLeft}
                                        color={"#fff"}
                                        size="2x"
                                    />
                                </button>
                                <button
                                    style={{
                                        position: "absolute",
                                        top: "calc(50% - 50px)",
                                        right: 0,
                                        padding: 0,
                                        width: 30,
                                        height: 30,
                                        borderRadius: "50%",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        next();
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faAngleRight}
                                        color={"#fff"}
                                        size="2x"
                                    />
                                </button>
                            </>
                        )}
                    </Picture>
                    <Title>
                        <Title1> {post.title}</Title1>
                        <Titlebar>
                            <Heart>
                                <FontAwesomeIcon
                                    icon={faHeartSolid}
                                    color="red"
                                />
                                {post.likeCount}
                                &nbsp;&nbsp;
                                <FontAwesomeIcon
                                    icon={faCommentSolid}
                                    color="F97800"
                                />
                                {post.commentCount}
                            </Heart>
                        </Titlebar>
                    </Title>
                </div>
            </CommunityItem>
        );
    }

    return (
        <Container>
            <Header>
                <InputWrapper>
                    <SearchIcon icon={faMagnifyingGlass} />
                    <TotalInput
                        placeholder="검색"
                        onClick={handleSearchClick}
                    />
                </InputWrapper>
                <IconContainer onClick={() => setWrite(!write)}>
                    {write && (
                        <Cmodal closeModal={() => setWrite(!write)}></Cmodal>
                    )}
                    <FontAwesomeIcon icon={faPen} size="2x" color={"#f97800"} />
                </IconContainer>
                <IconContainer>
                    <FontAwesomeIcon
                        onClick={() => navigate("/Companion")}
                        icon={faUsers}
                        size="2x"
                        color={"#f97800"}
                    />
                </IconContainer>
            </Header>
            <Content>
                <Sort>
                    <button
                        onClick={() => {
                            if (sort === "latest") return;
                            setSort("latest");
                            setPage(1);
                            setData({ posts: { rows: [] } });
                        }}
                    >
                        최신순
                    </button>
                    <button
                        onClick={() => {
                            if (sort === "popular") return;
                            setSort("popular");
                            setPage(1);
                            setData({ posts: { rows: [] } });
                        }}
                    >
                        인기순
                    </button>
                    <button
                        onClick={() => {
                            if (sort === "comments") return;
                            setSort("comments");
                            setPage(1);
                            setData({ posts: { rows: [] } });
                        }}
                    >
                        댓글순
                    </button>
                </Sort>
                <CommunityList>
                    {data &&
                        data.posts.rows.map((post, index) => (
                            <PostItem
                                key={index}
                                post={post}
                                goDetail={goDetail}
                                goUserDetail={goUserDetail}
                                imgURL={imgURL}
                                lastPostElementRef={
                                    index === data.posts.rows.length - 1
                                        ? lastPostElementRef
                                        : null
                                }
                            />
                        ))}
                </CommunityList>
            </Content>

            <ScrollToTopButton
                onClick={scrollToTop}
                style={{
                    display: isVisible ? "block" : "none",
                    right: buttonPosition,
                }}
            >
                <FontAwesomeIcon icon={faChevronUp} size="3x" color="#f97800" />
            </ScrollToTopButton>
            <Navigationbar />
        </Container>
    );
};

// Your styled components remain unchanged...
export default Community;

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
    font-size: 15px;
    margin-left: 10px;
    font-weight: 700;
`;

const DetailInfo = styled.div`
    display: flex;
    padding: 10px 0px 5px 10px;
`;
const Container = styled.div`
    position: relative;
    width: 100%;
`;
const Title1 = styled.div`
    margin-bottom: 10px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 640px;
    position: fixed;
    top: 0;
    height: 90px;
    background-color: #fff;
    border-bottom: 1px solid;
    z-index: 1000;

    @media (max-width: 640px) {
        width: 100%;
        height: 70px; // 모바일 화면에서 높이 조정
    }

    @media (min-width: 601px) and (max-width: 1200px) {
        height: 80px; // 태블릿 화면에서 높이 조정
    }
`;
const InputWrapper = styled.div`
    position: relative;
    width: 70%; /* 여기서 width를 조정했습니다. */
    margin-left: 20px;
    margin-right: 20px;
`;

const TotalInput = styled.input`
    height: 40px;
    width: 88%;
    border-radius: 15px;
    border: 1px solid gray;
    padding: 0 30px;
    &:focus {
        outline: none;
    }
    margin-top: 10px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
    position: absolute;
    top: 30px;
    left: 10px;
    transform: translateY(-50%);
`;

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-right: 10px;
    cursor: pointer;

    svg {
        font-size: 32px; // 기본 아이콘 크기 설정
    }

    @media (max-width: 480px) {
        margin-top: 10px;
        margin-left: 5px;
        margin-right: 5px;

        svg {
            font-size: 20px; // 모바일 화면에서 아이콘 크기 조정
        }
    }
`;

const Sort = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0px 50px 20px 50px;
    button {
        box-sizing: border-box;
        appearance: none;
        background-color: #f97800;
        border: 1px solid #f97800;
        border-radius: 0.6em;
        color: #fff;
        cursor: pointer;
        align-self: center;
        font-size: 12px;
        font-family: "Nanum Gothic", sans-serif;
        line-height: 1;
        margin: 10px;
        padding: 0.6em 2em;
        text-decoration: none;
        letter-spacing: 2px;
        font-weight: bold;

        @media (max-width: 400px) {
            font-size: 11px;
            margin: 8px;
            padding: 0.5em 1.5em;
        }
    }

    @media (max-width: 440px) {
        margin: 5px 0px 5px 0px;
    }
`;

const Content = styled.div`
    margin-right: 20px;
    margin-left: 20px;
    margin-top: 100px;

    @media (max-width: 440px) {
        margin-right: 20px;
        margin-left: 20px;
        margin-top: 70px;
        padding-top: 10px;
    }
`;

const CommunityList = styled.div``;

const CommunityItem = styled.div`
    cursor: pointer;
    break-inside: avoid-column;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dadde0;
`;

const Title = styled.div`
    font-size: 20px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    align-items: center;
`;

const Titlebar = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    padding-bottom: 10px;
`;

const Heart = styled.div`
    font-size: 15px;
    display: flex;
    justify-content: flex-end; // 아이콘을 우측으로 정렬
    gap: 3px; // 아이콘 사이의 간격 조정
    margin-top: 5px;
`;

const Picture = styled.div`
    position: relative;
    padding-bottom: 20px;
    overflow: hidden;
    text-align: center;
    .slick-slide {
        display: inline-block;
    }
    .slick-dots.slick-thumb {
        position: absolute;
        bottom: 0;
        left: 50%;
        padding: 0;
        color: #fff;
        margin: 0;
        list-style: none;
        transform: translate(-50%);
        li {
            margin: 0;
        }

        li button {
            width: 2px; // 원하는 크기로 조정
            height: 2px; // 원하는 크기로 조정
            background-color: white; // 원하는 배경 색상 지정
            border-radius: 50%; // 버튼을 원형으로 만들기
        }

        li.slick-active button {
            background-color: black; // 현재 선택된 dot의 배경 색상 지정
        }

        li button:before {
            content: ""; // 기존 content 제거
        }
    }
    img {
        display: block;
        width: 100%;
        height: 600px;
        border-radius: 15px;
        margin: 0 auto;
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

const ScrollToTopButton = styled.button`
    border-radius: 50%;
    border: none;
    background-color: #fff;
    position: fixed;
    bottom: 120px;
`;
