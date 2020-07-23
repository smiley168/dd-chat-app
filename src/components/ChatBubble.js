import React from 'react';
// import faker from 'faker';
import '../App.css';

const ChatBubble = (props) => {
  const { messages, avatars, signedInUser } = props;

  return messages.length > 0 && messages.map( ({name, message, id, reaction}) => {
    if(name === signedInUser.name) {
      return (
        <div className="callout-wrapper left" key={Math.random()}>
          <div className="callout left bubble">{message}</div>
          <div className="imageavatar">
            <img className="ui avatar image" alt="avatar" src={avatars[name]} />
            <p>{name}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="callout-wrapper" key={Math.random()}>
          <div className="imageavatar">
            <img className="ui avatar image" alt="avatar" src={avatars[name]} />
            <p>{name}</p>
          </div>
          
          <div className="callout right bubble">{message}</div>
        </div>
      );
    }
  }) 
};

export default ChatBubble;