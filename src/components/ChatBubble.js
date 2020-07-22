import React from 'react';
import faker from 'faker';
import '../App.css';

const ChatBubble = (props) => {
  return (
    <div className="callout-wrapper">
      <img className="ui avatar image imageavatar" alt="avatar" src={faker.image.avatar()} />
      <div className="callout right bubble"> 5 Your Favourite HTML,CSS,JS Playground! 5 Your Favourite HTML,CSS,JS Playground! 5 Your Favourite HTML,CSS,JS Playground! 5 Your Favourite HTML,CSS,JS Playground!</div>
    </div>
  );
};

export default ChatBubble;