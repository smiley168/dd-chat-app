import React from 'react';
import axios from 'axios';
import './App.css';
import ChatBubble from './components/ChatBubble';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listOfRooms: [],
      selectedRoom: {
        name: "",
        id: null,
        messages: [],
      },
      selectedUser: "",
      users: {
        "Ryan": "https://s3.amazonaws.com/uifaces/faces/twitter/cbracco/128.jpg",
        "Nick": "https://s3.amazonaws.com/uifaces/faces/twitter/nvkznemo/128.jpg",
        "Danielle": "https://s3.amazonaws.com/uifaces/faces/twitter/wintopia/128.jpg",
        "Jessye": "https://s3.amazonaws.com/uifaces/faces/twitter/angelceballos/128.jpg",
        "Piggy": "https://s3.amazonaws.com/uifaces/faces/twitter/evandrix/128.jpg",
      },
      signedInUser: {
        name: "Piggy",
        avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/evandrix/128.jpg",
        input: null,
      }
    };

  }

  async componentDidMount() {

    try{
      const listOfRooms = await axios.get('http://localhost:8080/api/rooms');

      if(listOfRooms && listOfRooms.data && listOfRooms.data.length > 0) {
        console.log(listOfRooms.data);
        
        let enhancedRoomsData = [];
        const roomsData = listOfRooms.data;
        for(let i = 0; i < roomsData.length; i++) {
          const room = roomsData[i];
          const usersInRoom = await axios.get(`http://localhost:8080/api/rooms/${room.id}`);
          const messagesInRoom = await axios.get(`http://localhost:8080/api/rooms/${room.id}/messages`);
          console.log('messagesInRoom:');
          console.dir(messagesInRoom);
          let usersMessagesInRoom = {};
          if(usersInRoom && usersInRoom.data && usersInRoom.data.users) {
            usersMessagesInRoom.users = usersInRoom.data.users;
          }
          if(messagesInRoom && messagesInRoom.data && messagesInRoom.data) {
            usersMessagesInRoom.messages = messagesInRoom.data;
          }
          const aggregatedData = Object.assign(usersMessagesInRoom, roomsData[i]);
            enhancedRoomsData.push(aggregatedData);
          
        }

        console.log('enhancedRoomsData');
        console.dir(enhancedRoomsData);

        this.setState({
          listOfRooms: enhancedRoomsData,
        });

      }

  
    } catch(err) {
      console.log("Error while getting chat rooms info. Details: " + err);
    }
    


  }

  handleClick(roomId) {
    const selectedChatRoom = this.state.listOfRooms[roomId];
    if(selectedChatRoom) {
      const visibleMessages = selectedChatRoom.messages;
      const roomName = selectedChatRoom.name;
      this.setState({
        selectedRoom: {
          id: roomId,
          name: roomName,
          messages: visibleMessages,
        }
      });
    }
  }

  getUserAvatar = (userName) => {
    let cachedUserAvatar = this.state.users[userName] || null;
    if(cachedUserAvatar) {
      return this.state.users[userName];
    }
    return null;
  }

  handleSendMessage = () => {
    console.log('sending message...');
    console.dir(this.state.signedInUser);
    
    const newMessage = {
      name: this.state.signedInUser.name,
      message: this.state.signedInUser.input,
      id: this.state.signedInUser.id,
      reaction: null,
    };
    const roomId = this.state.selectedRoom.id;
    const currListsOfRooms = this.state.listOfRooms;
    console.dir(currListsOfRooms);
    const newListsOfRooms = [].concat(currListsOfRooms);
    const chatRoomCurrMessages = newListsOfRooms[roomId].messages;
    chatRoomCurrMessages.push(newMessage);

    console.log('new List of rooms');
    console.dir(newListsOfRooms);

    this.setState({
      listOfRooms: newListsOfRooms,
      selectedRoom: Object.assign(this.state.selectedRoom, {messages: chatRoomCurrMessages}),
      signedInUser: Object.assign(this.state.signedInUser, {input: ""}),
    });
  }

  
  render() {
    return (
      <div className="wrapper">
        <div className="box header">DD Chat App</div>
        <div className="box sidebar">
          {this.state.listOfRooms.map( room => (
                <>
                  <div className={this.state.selectedRoom.name === room.name ? "item selected-room" : "item"} key={room.id} onClick={() => this.handleClick(room.id)}>
                    <span><i className="users icon"></i></span>
                    <span style={{paddingLeft: "10px", lineHeight: "4vh"}}>{room.name}</span>
                  </div>
                  
                  <div className="ui middle aligned list" style={{paddingLeft: "15px"}}>
                    {room.users.map( user => (
                      <div className="item">
                        <img className="ui avatar image" src={this.getUserAvatar(user)} alt="avatar" />
                        <span className="content">
                          {user}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                </>
              ))}
        </div>
        <div className="box content">
          {this.state.selectedRoom.id === null && (
            <div>Select a room to begin your chat</div>
            
          )}
          {this.state.selectedRoom.id !== null && this.state.selectedRoom.messages && (
            <ChatBubble messages={this.state.selectedRoom.messages} avatars={this.state.users} signedInUser={this.state.signedInUser}/>
          )}
          
        </div>
        <div className="box footer">
          <div className="ui fluid action input full">
            <input 
              type="text" 
              placeholder="Type here..." 
              value={this.state.signedInUser.input}
              onChange={(e) => this.setState({ signedInUser: Object.assign(this.state.signedInUser, {input: e.target.value})})}
            />
            <div className="ui button" onClick={this.handleSendMessage}>Send</div>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
