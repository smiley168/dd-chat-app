import React from 'react';
import axios from 'axios';
import faker from 'faker';
// import './App.css';

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
      
      
    };
  }

  async componentDidMount() {
    const response = await axios.get('http://localhost:8080/api/rooms');

    console.log(response.data);
    this.setState({
      listOfRooms: response.data,
    });
  }

  // async onSearchSubmit(term) {
  //   const response = await axios.get('http://localhost:8080/api/rooms', {
  //     params:{ query: term},
  //     headers: {
  //       Authorization: 'Client-ID Cl_pJ9j5bfKMgswuINJ8fmPKfwJhd2AUDKAazxAmULo'
  //     }
  //   });

  //   console.log(response.data.results);
  // }

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

  renderZZ() {
    return (
      <div className="ui sidebar inverted vertical menu visible">
        {this.state.listOfRooms.map( room => (
          <>
          <div className={this.state.selectedRoom.name === room.name ? "item active" : "item"} key={room.id} onClick={() => this.handleClick(room.id)}>
            <span><i className="users icon"></i></span>
            <span style={{paddingLeft: "10px"}}>{room.name}</span>
          </div>
          {this.state.selectedRoom.name === room.name && (
            <div className="ui link list">
            { this.state.selectedRoom.listOfUsers.map( user => (
              <div className="item" key={user} style={{paddingLeft: "30px"}}>
                <span style={{marginRight: '15px', }}><img width="20px" height="20px" alt="avatar" src={faker.image.avatar()} /></span>
                <span>{user}</span>
              </div>
            ))}
            </div>
          )}
          </>
        )) }
      </div>
    );
  }

  render() {
    return (
      <>
      <div className="ui two column grid">
        <div className="column">
          <div className="ui left sidebar inverted vertical menu visible" style={{padding: "15px", backgroundColor: "#000", color: "#fff"}}>
            {this.state.listOfRooms.map( room => (
              <>
                <div className={this.state.selectedRoom.name === room.name ? "item active" : "item"} key={room.id} onClick={() => this.handleClick(room.id)}>
                  <span><i className="users icon"></i></span>
                  <span style={{paddingLeft: "10px"}}>{room.name}</span>
                </div>
                {this.state.selectedRoom.name === room.name && (
                  <div className="ui middle aligned selection list">
                    {this.state.selectedRoom.listOfUsers.map( user => (
                      <div className="item">
                        
                        <img className="ui avatar image" src={faker.image.avatar()} />
                        
                        <span className="content">
                          {user}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ))}
           
          </div>
        </div>
        <div className="three wide column" style={{border: "1px solid red"}}>
          Main Content
        </div>
      </div>
      </>
    );
  }

}

export default App;
