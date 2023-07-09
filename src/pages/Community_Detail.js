import { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CommunityStateContext } from "../App";
import MyButton from "../components/MyButton";
import styled from "styled-components";
import Detail_Nav from "../components/Detail_Nav";

const Community_Detail = () => {
  const { id } = useParams();
  const community_list = useContext(CommunityStateContext);
  const navigate = useNavigate();
  const [data, setData] = useState();

  useEffect(() => {
    if (community_list.length >= 1) {
      const targetCommunity = community_list.find(
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
  }, [id, community_list]);

  // 데이터가 없을때
  if (!data) {
    return <div className="DiaryPage">로딩중입니다...</div>;
  } else {
    return (
      <Page>
        <Top>
          <MyButton text={"<"} onClick={() => navigate(-1)} />
        </Top>
        <Title>{data.title}</Title>
        <Info>
          위치 : {data.location}
          <br />
          테그 : {data.tag}
        </Info>
        <div>
          {data.photos &&
            data.photos.map((photoUrl, index) => (
              <Main key={index}>
                <img
                  src={photoUrl}
                  style={{ maxWidth: "600px", height: "auto" }}
                  alt="community"
                />
                <Content>{data.content[index]}</Content>
              </Main>
            ))}
        </div>
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

export default Community_Detail;
