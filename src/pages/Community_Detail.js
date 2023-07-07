import { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CommunityStateContext } from "../App";
import MyButton from "../components/MyButton";

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
      <div>
        <div>
          <h1>커뮤니티 상세페이지</h1>
          <MyButton text={"<"} onClick={() => navigate(-1)} />
        </div>
        <div>{data.title}</div>
        <div>
          {data.location}
          <br />
          {data.tag}
        </div>
        <div>
          {data.photos &&
            data.photos.map((photoUrl, index) => (
              <div key={index}>
                <img src={photoUrl} alt="community" />
              </div>
            ))}
        </div>
        <div>{data.content}</div>
      </div>
    );
  }
};

export default Community_Detail;
