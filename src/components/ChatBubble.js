import React from 'react';
// import faker from 'faker';
import '../App.css';

const ChatBubble = (props) => {
  const { messages, avatars } = props;
  console.dir(messages);
  console.dir(avatars);

  return messages.length > 0 && messages.map( ({name, message, id, reaction}) => {
    return (
      <div className="callout-wrapper">
        <div className="imageavatar">
          <img className="ui avatar image" alt="avatar" src={avatars[name]} />
          <p>{name}</p>
        </div>
        
    <div className="callout right bubble">{message}</div>
      </div>
    );
  }) 
};

export default ChatBubble;