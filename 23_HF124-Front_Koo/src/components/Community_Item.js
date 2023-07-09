import styled from "styled-components";

const Community_Item = ({ title, location, tag, photo, content, id }) => {
  return (
    <CommunityItem>
      <Title>
        <div>{title}</div>
      </Title>
      <Info>
        <span>
          <br />
          위치 : {location} | 테그 : {tag}
        </span>
      </Info>
      {/* <div className="photo">{photo}</div> */}
      <div className="content">{content}</div>
    </CommunityItem>
  );
};

export default Community_Item;

const CommunityItem = styled.div`
  background-color: rgb(240, 240, 240);
  margin-bottom: 10px;
  padding: 20px;
`;
const Title = styled.div`
  font-weight: bold;
`;
const Info = styled.div`
  border-bottom: 1px solid gray;
  padding-bottom: 10px;
  margin-bottm: 10px;
`;
