import React from 'react';
import ChatBubble from './ChatBubble';
import '../App.css';

const messages = [
  {
    "name": "Ryan",
    "message": "ayyyyy",
    "id": "gg35545",
    "reaction": null
  },
  {
    "name": "Nick",
    "message": "lmao",
    "id": "yy35578",
    "reaction": null
  },
  {
    "name": "Danielle",
    "message": "leggooooo",
    "id": "hh9843",
    "reaction": null
  }
];

const signedInUser = {
  input: "Hello there",
  name: "Ryan Gonzalez",
};

export default {
  component: ChatBubble,
  title: "Chat Bubble Default",
}

export const Default = () => <ChatBubble messages={messages} signedInUser={signedInUser} />
