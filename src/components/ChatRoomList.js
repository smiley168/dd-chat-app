import React from 'react';
import './ChatRoomList.css';

const ChatRoomList = ({listOfRooms, selectedRoom, handleClick}) => {
  const renderedList = listOfRooms.map( room => (
    <div key={room.id}>
      <div className={selectedRoom.name === room.name ? "room-name item selected-room" : "room-name item "} key={`${room.id}-${Math.random()}`} onClick={() => handleClick(room.id)}>
        {room.name}
      </div>
    </div>
    ));

  return renderedList;

};

export default ChatRoomList;
