// import { useLocation, useNavigate } from "react-router-dom";
// import "../pages/listForm.css";
// import styled from "styled-components";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { faUserPlus, faUserPen } from "@fortawesome/free-solid-svg-icons";

// const Detail_Nav = () => {
//     const navigate = useNavigate();
//     const Companion_Write = () => {
//         navigate("/Companion_Write");
//     };
//     const Companion = () => {
//         navigate("/Companion", {
//             state: {
//                 posts: null,
//                 location: null,
//                 searchTriggered,
//                 tagList: [],
//                 gender: null,
//                 age: null,
//                 title: festivalData.title,
//                 startDate: null,
//                 endDate: null,
//             },
//         });
//     };
//     return (
//         <Navigation>
//             <Bottomview>
//                 <BottomBox>
//                     <NavBox>
//                         <FontAwesomeIcon
//                             icon={faUserPlus}
//                             size="2x"
//                             color={"#f97800"}
//                             onClick={Companion}
//                         />
//                         동행인 찾기
//                     </NavBox>

//                     <NavBox>
//                         <FontAwesomeIcon
//                             icon={faUserPen}
//                             size="2x"
//                             color={"#f97800"}
//                             onClick={Companion_Write}
//                         />
//                         동행인 모집하기
//                     </NavBox>
//                 </BottomBox>
//             </Bottomview>
//         </Navigation>
//     );
// };

// const Navigation = styled.div`
//     position: relative;
//     min-height: 100vh;
//     box-sizing: border-box;
//     height: auto;
//     overflow-y: auto;
//     padding-bottom: 100px;

//     @media (max-width: 600px) {
//         padding-bottom: 80px;
//     }

//     @media (min-width: 601px) and (max-width: 1200px) {
//         padding-bottom: 90px;
//     }
// `;

// const Bottomview = styled.div`
//     cursor: pointer;
//     width: 100%; /* 모든 화면 크기에 대해 100%를 설정하여 가로 길이를 유동적으로 조정합니다. */
//     max-width: 640px; /* 그러나 최대 너비를 640px로 제한하여 큰 화면에서도 적절한 크기를 유지합니다. */
//     position: fixed;
//     bottom: 0;
//     height: 90px;
//     background-color: white;

//     @media (max-width: 600px) {
//         height: 60px; /* 모바일 화면에 대해 높이를 조정합니다. */
//         width: 100%;
//     }

//     @media (min-width: 601px) and (max-width: 1200px) {
//         height: 70px; /* 태블릿 화면에 대해 높이를 조정합니다. */
//     }
// `;

// const BottomBox = styled.div`
//     height: 100%;
//     display: flex;
//     align-items: center;
//     flex-shrink: 0;
// `;

// const NavBox = styled.div`
//     flex: 1; /* flex-grow, flex-shrink, flex-basis 값을 한 번에 지정할 수 있는 속성을 사용하여 요소 간 공간 분배를 조정합니다. */
//     font-weight: bold;
//     height: 100%;
//     border-top: 1px solid #dddddd;
//     border-right: 1px solid #dddddd;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     background-color: white;

//     &:last-child {
//         border-right: none; /* 마지막 요소의 오른쪽 테두리를 제거합니다. */
//     }

//     svg {
//         font-size: 32px; // 기본 아이콘 크기 설정
//     }

//     @media (max-width: 480px) {
//         svg {
//             font-size: 20px; // 모바일 화면에서 아이콘 크기 조정
//         }
//     }
// `;

// export default Detail_Nav;
