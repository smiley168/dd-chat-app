import React from 'react';
import faker from 'faker';
import '../App.css';

const ChatBubble = (props) => {
  return (
    <div className="callout-wrapper">
      <div className="imageavatar">
        <img className="ui avatar image" alt="avatar" src={faker.image.avatar()} />
        <p>Lucy</p>
      </div>
      
      <div className="callout right bubble"> 5 Your Favourite HTML,CSS,JS Playground! 5 Your Favourite HTML,CSS,JS Playground! 5 Your Favourite HTML,CSS,JS Playground! 5 Your Favourite HTML,CSS,JS Playground!</div>
    </div>
  );
};

export default ChatBubble;