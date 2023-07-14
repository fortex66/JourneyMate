import Navigationbar from "../components/Navigationbar";
import Companion_List from "../components/Companion_List";
import styled from "styled-components";

const Companion = () => {
  return (
    <div>
      <CompanionBox>
        <h1>Companion</h1>
      </CompanionBox>
      <Content>
        <Companion_List />
      </Content>
      <Navigationbar />
    </div>
  );
};
const CompanionBox = styled.div`
  margin-right: 20px;
  margin-left: 20px;
`;

const Content = styled.div`
  margin-right: 20px;
  margin-left: 20px;
`;
export default Companion;