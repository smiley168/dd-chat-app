import React from 'react';
import axios from 'axios';
import faker from 'faker';
import './App.css';
import ChatBubble from './components/ChatBubble';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentRoom: "",
      currentUser: "",
      listOfRooms: [],
      selectedRoom: {
        name: "", 
        listOfUsers: [],
      },
      selectedUser: "",
      hoverUser: "",
      users: {
        "Ryan": "https://s3.amazonaws.com/uifaces/faces/twitter/cbracco/128.jpg",
        "Nick": "https://s3.amazonaws.com/uifaces/faces/twitter/nvkznemo/128.jpg",
        "Danielle": "https://s3.amazonaws.com/uifaces/faces/twitter/wintopia/128.jpg",
        "Jessye": "https://s3.amazonaws.com/uifaces/faces/twitter/angelceballos/128.jpg",
      },
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

  async handleClick(roomId) {
    console.log(roomId + " is clicked");
    const response = await axios.get(`http://localhost:8080/api/rooms/${roomId}`);

    this.setState({
      selectedRoom: {
        name: response.data.name,
        listOfUsers: response.data.users,
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

  
  render() {
    return (
      <div className="wrapper">
        <div className="box header">Chat App</div>
        <div className="box sidebar">
          {this.state.listOfRooms.map( room => (
                <>
                  <div className={this.state.selectedRoom.name === room.name ? "item active" : "item"} key={room.id} onClick={() => this.handleClick(room.id)}>
                    <span><i className="users icon"></i></span>
                    <span style={{paddingLeft: "10px"}}>{room.name}</span>
                  </div>
                  
                  <div className="ui middle aligned selection list" style={{paddingLeft: "15px"}}>
                    {room.users.map( user => (
                      <div 
                        className={this.state.selectedUser === user || this.state.hoverUser === user ? "item active" : "item"}  
                        onMouseEnter={() => this.setState({hoverUser: user})}
                        onMouseLeave={() => this.setState({hoverUser: ""})}
                        onClick={() => this.setState({selectedUser: user})}
                      >
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
          <ChatBubble />
        </div>
        <div className="box footer">
          <div className="ui fluid action input full">
            <input type="text" placeholder="Type here..." />
            <div className="ui button">Send</div>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
