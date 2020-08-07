import React from 'react';
// import faker from 'faker';
import '../App.css';

const LeftBubble = ({message, id}) => {
  return (
    <div className="callout-wrapper left" key={id}>
      <div className="callout left bubble">{message}</div>
    </div>
  );
};

const RightBubble = ({message, id, name}) => {
  return (
    <div className="callout-wrapper" key={id}>
      <div className="callout right bubble">{message}</div>
      <div className="imageavatar">{name}</div>
    </div>
  );
};

const ChatBubble = (props) => {
  const { messages, signedInUser } = props;
  // console.log(messages);
  // console.log(signedInUser);

  return messages.length > 0 && messages.map( ({name, message, id, reaction}) => {
    if(name === signedInUser.name) {
      return <LeftBubble message={message} id={id} key={id}/>;
    } else {
      return <RightBubble message={message} id={id} name={name} key={id} />;
    }
  }); 
};

export default ChatBubble;
