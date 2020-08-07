import React from 'react';
// import faker from 'faker';
import '../App.css';

const ChatBubble = (props) => {
  const { messages, signedInUser } = props;
  console.log(messages);
  console.log(signedInUser);

  return messages.length > 0 && messages.map( ({name, message, id, reaction}) => {
    if(name === signedInUser.name) {
      return (
        <div className="callout-wrapper left" key={Math.random()}>
          <div className="callout left bubble">{message}</div>
        </div>
      );
    } else {
      return (
        <div className="callout-wrapper" key={Math.random()}>
          <div className="callout right bubble">{message}</div>
          <div className="imageavatar">{name}</div>
        </div>
      );
    }
  }); 
};

export default ChatBubble;
