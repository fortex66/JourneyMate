import React from 'react';

import onlineIcon from '../../icon/closeIcon.png';

import './TextContainer.css';

//채팅방 사람들 목록
function TextContainer({ users }) {
  return (
    <div className='textContainer'>
      
      {users ? (
        <div>
          <h1>현재 채팅중인 사람들 : </h1>
          <div className='activeContainer'>
            <h2>
              {users.map(({ name }) => (
                <div key={name} className='activeItem'>
                  {name}
                  <img alt='Online Icon' src={onlineIcon} />
                </div>
              ))}
            </h2>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TextContainer;