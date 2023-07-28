import React, { useEffect, useState  } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


import axios from "axios";

const baseURL = "http://localhost:3000/";

const ProfileDetail = () => {

    const [userData, setUserData] = useState(null);

    const getCommunity = async () => {
        try {
          const resUser = await axios.get(baseURL + `mypage/profile`);
          console.log(resUser)
          setUserData(resUser.data);
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
          getCommunity();
      }, []); 



  return (
    <Container>
      <InfoContainer>
        <TitleBar>
          <Title>내 정보</Title>
        </TitleBar>
        <Info>
          <NameBar>
            <Name>이름</Name>
            <NameData ></NameData>
          </NameBar>
          <EmailBar>
            <Email>이메일</Email>
            <EmailData></EmailData>
          </EmailBar>
          <RegionBar>
            <Region>지역</Region> 
            <RegionData></RegionData>
          </RegionBar>
          <TagBar>
            <Tag>관심사</Tag> 
              <TagDataBar>
                {userData && userData.userTag.map((tag)=>(
                <TagData>{tag.tagName},</TagData>
                  ))}
              </TagDataBar>
          </TagBar>
        </Info>
      </InfoContainer> 
  </Container>
);
};
const Container = styled.div`

`


const InfoContainer = styled.div`
margin-top: 50px;
margin-left: 50px;
`;

const TitleBar = styled.div`
display: flex;
align-items: center
`
const Title = styled.div`
font-size : 30px;
font-weight: bold
`

const Info = styled.div`
margin-top : 20px;
margin-left : 10px;
`
const NameBar = styled.div`
display : flex;
`
const Name = styled.div`
font-weight: bold
`
const NameData = styled.input`
margin-left: 50px;
`


const EmailBar = styled.div`
display : flex;
margin-top : 15px;
`
const Email = styled.div`
font-weight: bold
`
const EmailData = styled.input`
margin-left: 36px;
`


const RegionBar = styled.div`
display : flex;
margin-top : 15px;
`
const Region = styled.div`
font-weight: bold
`
const RegionData = styled.input`
margin-left: 50px;
`

const TagBar = styled.div`
display : flex;
margin-top : 15px;
`
const Tag = styled.div`
font-weight: bold
`
const TagDataBar = styled.div`
margin-left: 35px;
display: flex;
`
const TagData = styled.div`
margin-right: 5px;
`



export default ProfileDetail;