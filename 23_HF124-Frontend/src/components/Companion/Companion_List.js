import Companion_Item from "./Companion_Item";
import styled from "styled-components";

const Companion_List = () => {
 
  return (
    <div className="Companion_List">
      <List>
        
      </List>
    </div>
  );
};

Companion_List.defaultProps = {
  companion_List: [],
};

const List = styled.div`
  display: flex; /* Flexbox 사용 */
  flex-wrap: wrap; /* 창 크기에 따라 자동으로 다음 행으로 넘어가게 설정 */
  justify-content: space-between; /* 각 아이템 사이에 공간 배분 */
`;
export default Companion_List;