import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const baseURL = "http://localhost:3000/";
const imgURL = "https://journeymate.s3.ap-northeast-2.amazonaws.com/";
const Nearby = ({ marker, sortType }) => {
    const [data, setData] = useState({ posts: { rows: [] } });
    const [page, setPage] = useState(1); // 페이지 상태 추가
    const radius = 10; // 10으로 설정하면 10km반경으로 조회
    const navigate = useNavigate();

    const observer = useRef();

    const goDetail = (postId) => {
        navigate(`/Community_Detail/${postId}`);
    };

    const lastPostElementRef = useCallback((node) => {
        // 마지막 요소에 대한 참조 생성
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${baseURL}community/nearby`, {
                    params: {
                        x: marker.x,
                        y: marker.y,
                        radius: radius,
                        page: page, // 페이지 번호를 요청에 추가
                        sort: sortType, // 정렬 방식 추가
                    },
                });

                setData((prevData) => ({
                    ...prevData,
                    posts: {
                        ...prevData.posts,
                        rows: [
                            ...prevData.posts.rows,
                            ...response.data.posts.rows,
                        ],
                    },
                }));
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };
        fetchPosts();
    }, [marker, page]); // 페이지 번호가 변경될 때마다 요청 실행

    useEffect(() => {
        setPage(1);
        setData({ posts: { rows: [] } });
    }, [sortType]);

    return (
        <div>
            <CommunityList>
                {data &&
                    data.posts.rows.map((post, index) => (
                        <CommunityItem
                            key={index}
                            onClick={() => goDetail(post.tpostID)}
                            ref={
                                index === data.posts.rows.length - 1
                                    ? lastPostElementRef
                                    : null
                            } // 마지막 요소에 대한 참조 붙이기
                        >
                            <div>
                                <Picture>
                                    <div>
                                        <img
                                            src={`${imgURL}${
                                                post.post_images[0]
                                                    ? post.post_images[0].imageURL.replace(
                                                          /\\/g,
                                                          "/"
                                                      )
                                                    : ""
                                            }`}
                                        />
                                    </div>
                                </Picture>
                            </div>
                        </CommunityItem>
                    ))}
            </CommunityList>
        </div>
    );
};

export default Nearby;
const CommunityList = styled.div`
    display: flex;
    flex-wrap: wrap;

    max-height: 350px;
    overflow-y: auto; // 스크롤 가능하게 설정
`;
const CommunityItem = styled.div`
    cursor: pointer;
`;

const Picture = styled.div`
    display: flex;

    img {
        width: 100px;
        height: 100px;
        object-fit: cover;
    }
`;
