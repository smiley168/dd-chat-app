import React from 'react';
import chatserver from './apis/chatserver';
import './App.css';
import ChatBubble from './components/ChatBubble';
import StatusBox from './components/StatusBox';
import ChatRoomList from './components/ChatRoomList';
import LoadingContent from './components/LoadingContent';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.contentRef = React.createRef();

    this.state = {
      isLoggedIn: false,
      onlineMinutes: null,
      isLoadingData: true,
      listOfRooms: [],
      selectedRoom: {
        name: "",
        id: null,
        users: [],
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
        name: "",
        avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/evandrix/128.jpg",
        input: "",
      },
      apiError: "",
      newestMessageId: Math.floor(Math.random() * 3),
    };

  }

  onAppLoad = async () => {
    try{
      const listOfRooms = await chatserver.get('http://localhost:8080/api/rooms');

      if(listOfRooms && listOfRooms.data && listOfRooms.data.length > 0) {
        let enhancedRoomsData = [];
        const roomsData = listOfRooms.data;
        for(let i = 0; i < roomsData.length; i++) {
          const room = roomsData[i];
          const usersInRoom = await chatserver.get(`http://localhost:8080/api/rooms/${room.id}`);
          const messagesInRoom = await chatserver.get(`http://localhost:8080/api/rooms/${room.id}/messages`);

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
          onlineMinutes: 0,
        });

        const selectedChatRoom = this.state.listOfRooms[0]; // initialize to first room by default
        if(selectedChatRoom) {
          const visibleMessages = selectedChatRoom.messages;
          const roomName = selectedChatRoom.name;
          const users = selectedChatRoom.users;
          this.setState({
            selectedRoom: {
              id: 0,
              name: roomName,
              messages: visibleMessages,
              users: users,
            }
          });
        }

        setInterval( () => {
          this.setState({
            onlineMinutes: this.state.onlineMinutes + 1,
          });
        }, 60000);
      }  
    } catch(err) {
      console.log("Error while getting chat rooms info. Details: " + err);
      this.setState({
        apiError: err.message,
        isLoadingData: false,
      });
    }
  };

  componentDidMount() {
    this.onAppLoad();
  }

  handleClick = async (roomId) => {
    const roomInfo = await chatserver.get(`http://localhost:8080/api/rooms/${roomId}`);
    const messagesInRoom = await chatserver.get(`http://localhost:8080/api/rooms/${roomId}/messages`);
    this.setState({
      selectedRoom: {
        id: roomId,
        name: roomInfo.data.name,
        messages: messagesInRoom.data,
        users: roomInfo.data.users,
      }
    });
  }

  getUserAvatar = (userName) => {
    let cachedUserAvatar = this.state.users[userName] || null;
    if(cachedUserAvatar) {
      return this.state.users[userName];
    }
    return null;
  }

  handleSendMessage = async () => {   
    if(this.state.signedInUser.input.length === 0) return;

    const newMessage = {
      name: this.state.signedInUser.name,
      message: this.state.signedInUser.input,
      id: this.state.newestMessageId + 1,
      reaction: null,
    };

    const response = await chatserver.post(`http://localhost:8080/api/rooms/${this.state.selectedRoom.id}/messages`, newMessage);

    console.log('after post');
    console.log(response);

    const roomId = this.state.selectedRoom.id;
    const currListsOfRooms = this.state.listOfRooms;
    const newListsOfRooms = [].concat(currListsOfRooms);
    const chatRoomCurrMessages = newListsOfRooms[roomId].messages;
    chatRoomCurrMessages.push(newMessage);

    this.setState({
      listOfRooms: newListsOfRooms,
      selectedRoom: Object.assign(this.state.selectedRoom, {messages: chatRoomCurrMessages}),
      signedInUser: Object.assign(this.state.signedInUser, {input: ""}),
      newestMessageId: newMessage.id,
    });

    this.contentRef.current.scrollIntoView({ behavior: "smooth" });
  }

  onKeyDown = (e) => {
    if ( e.keyCode === 13 ) {
      if(this.state.isLoggedIn){
        this.handleSendMessage();
      }else if(this.state.signedInUser.name.length > 0){
        this.setState({ isLoggedIn: true });
      }
    }
  };

  onClickChatRoom = (roomId) => this.handleClick(roomId);

  
  renderChat() {
    // remove current signed in user from being displayed twice under the chat room name
    const currChatRoomUsers = this.state.selectedRoom.users.slice();
    const indexOfCurrentUser = currChatRoomUsers.indexOf(this.state.signedInUser.name);
    if(indexOfCurrentUser !== -1) {
      currChatRoomUsers.splice(indexOfCurrentUser, 1);
    }
    
    return (
      <div className="wrapper">
        <div className="box header">
          <h3>{this.state.selectedRoom.name}</h3>
          <p><span className="signedInUser">{this.state.signedInUser.name}</span>{currChatRoomUsers.map( (username, index) => (
              ', ' + username
            ))}</p>
        </div>
        <div className="box sidebar">
          <StatusBox signedInUser={this.state.signedInUser} onlineMinutes={this.state.onlineMinutes} />
          <ChatRoomList listOfRooms={this.state.listOfRooms} selectedRoom={this.state.selectedRoom} handleClick={this.onClickChatRoom} />

        </div>
        {this.state.isLoadingData && (
          <LoadingContent />
        )}
        {!this.state.isLoadingData && this.state.apiError.length > 0 ? (
          <div className="box content">
            {this.state.apiError}
          </div>
        ) : !this.state.isLoadingData && (
          <div className="box content" ref={this.contentRef}>
            {this.state.selectedRoom.id !== null && this.state.selectedRoom.messages && (
              <ChatBubble messages={this.state.selectedRoom.messages} signedInUser={this.state.signedInUser} newestMessageId={this.state.newestMessageId} />
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
              style={{color: "blue", fontSize: "medium", backgroundColor: "white"}}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderLogin() {
    return (
      <div className="ui form" style={{padding: "40%"}}>
        <div className="field">
          <input
            maxLength="20"
            type="text" 
            placeholder="Type your username..."
            value={this.state.signedInUser.name}
            onKeyDown={this.onKeyDown}
            onChange={ (e) => this.setState({ signedInUser: Object.assign(this.state.signedInUser, {name: e.target.value})}) }
          />
        </div>
        
        <div 
          className="ui submit button" 
          style={{width: "100%", backgroundColor: "#ff3008", color: "#fff"}}
          onClick={ () => this.setState({ isLoggedIn: true}) }
        >
          Join the DoorDash Chat!
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.isLoggedIn === false ? this.renderLogin() : this.renderChat()}
      </div>
    );
  }

}

export default App;
