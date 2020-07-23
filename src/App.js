import React from 'react';
import axios from 'axios';
import './App.css';
import ChatBubble from './components/ChatBubble';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoadingData: true,
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
        input: "",
      },
      apiError: "",
    };

  }

  async componentDidMount() {

    try{
      const listOfRooms = await axios.get('http://localhost:8080/api/rooms');

      if(listOfRooms && listOfRooms.data && listOfRooms.data.length > 0) {
        let enhancedRoomsData = [];
        const roomsData = listOfRooms.data;
        for(let i = 0; i < roomsData.length; i++) {
          const room = roomsData[i];
          const usersInRoom = await axios.get(`http://localhost:8080/api/rooms/${room.id}`);
          const messagesInRoom = await axios.get(`http://localhost:8080/api/rooms/${room.id}/messages`);

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

        this.setState({
          listOfRooms: enhancedRoomsData,
          apiError: "",
          isLoadingData: false,
        });
      }  
    } catch(err) {
      console.log("Error while getting chat rooms info. Details: " + err);
      this.setState({
        apiError: err.message,
        isLoadingData: false,
      });
    }

  }

  handleClick = (roomId) => {
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
    if(this.state.signedInUser.input.length === 0) return;

    const newMessage = {
      name: this.state.signedInUser.name,
      message: this.state.signedInUser.input,
      id: this.state.signedInUser.id,
      reaction: null,
    };
    const roomId = this.state.selectedRoom.id;
    const currListsOfRooms = this.state.listOfRooms;
    const newListsOfRooms = [].concat(currListsOfRooms);
    const chatRoomCurrMessages = newListsOfRooms[roomId].messages;
    chatRoomCurrMessages.push(newMessage);

    this.setState({
      listOfRooms: newListsOfRooms,
      selectedRoom: Object.assign(this.state.selectedRoom, {messages: chatRoomCurrMessages}),
      signedInUser: Object.assign(this.state.signedInUser, {input: ""}),
    });
  }

  onKeyDown = (e) => {
    if ( e.keyCode === 13 ) {
      this.handleSendMessage();
    }
  }

  
  render() {
    return (
      <div className="wrapper">
        <div className="box header">
          <div className="left-side">DD Chat App</div>
          <div className="right-side">
            <span style={{paddingRight: "5px"}}>Signed In As: </span>
            <img className="ui avatar image" alt="avatar" src={this.state.signedInUser.avatar} />
            {this.state.signedInUser.name}
          </div>
        </div>
        <div className="box sidebar">
          {this.state.listOfRooms.map( room => (
              <div key={Math.random()}>
                <div className={this.state.selectedRoom.name === room.name ? "room-name item selected-room" : "room-name item "} key={`${room.id}-${Math.random()}`} onClick={() => this.handleClick(room.id)}>
                  <span><i className="users icon"></i></span>
                  <span style={{paddingLeft: "10px", lineHeight: "4vh"}}>{room.name}</span>
                </div>
                
                <div className="ui middle aligned list" style={{paddingLeft: "15px"}} key={`${room.id}-${Math.random()}`} >
                  {room.users.map( user => (
                    <div className="item" key={`${user}-${Math.random()}`}>
                      <img className="ui avatar image" src={this.getUserAvatar(user)} alt="avatar" />
                      <span className="content">
                        {user}
                      </span>
                    </div>
                  ))}
                </div>
                
              </div>
              ))}
        </div>
        {this.state.isLoadingData && (
          <div className="ui segment">
            <div className="ui active inverted dimmer">
              <div className="ui large text loader">Loading data... Please wait...</div>
            </div>
          </div>
        )}
        {!this.state.isLoadingData && this.state.apiError.length > 0 ? (
          <div className="box content">
            {this.state.apiError}
          </div>
        ) : !this.state.isLoadingData && (
          <div className="box content">
            {this.state.selectedRoom.id === null && (
              <div className="empty">Select a room to begin your chat</div>
            )}
            {this.state.selectedRoom.id !== null && this.state.selectedRoom.messages && (
              <ChatBubble messages={this.state.selectedRoom.messages} avatars={this.state.users} signedInUser={this.state.signedInUser} />
            )}
          </div>
        )}

        <div className="box footer">
          <div className="ui fluid action input full">
            <input 
              type="text" 
              placeholder={this.state.selectedRoom.id === null ? "Select a room to begin your chat" : "Type here..." }
              value={this.state.signedInUser.input}
              onKeyDown={this.onKeyDown}
              onChange={(e) => this.setState({ signedInUser: Object.assign(this.state.signedInUser, {input: e.target.value})})}
            />
            <button 
              className={this.state.selectedRoom.id === null ? "ui button disabled" : "ui button"} 
              onClick={this.handleSendMessage}
              style={{color: "teal", fontSize: "medium", backgroundColor: "aqua"}}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
