## DD Chat App

![Demo](demo/DoorDash%20Frontend%20Take%20home%20exercise%20screencast_%20Jul%2022%2C%202020%208_25%20PM_v2.gif)

### Prerequisites

If you haven't already done so, please start the database server provided in the `Frontend-Interview-Project-master` zip file and make sure the following mock API endpoints listed in the `Frontend-Interview-Project-master\spec\api-endpoints.md` are returning data correctly before going to the next step.


### Getting Started

1. run `npm install` 

2. run `npm start`

3. go to `http://localhost:3000` in your browser to start playing with this `DD Chat App`

### Assumptions

* Because I cannot modify the server.js file in the `Frontend-Interview-Project-master`, I have made the following assumptions:

  - I assume there is already a current user signed in to the chat app because there isn't any user authentication API endpoint provided. The sample currently signed in user is named "Piggy".

  - I assume that the current user can ONLY message in the available chat rooms (i.e. 'Tea Chats' and 'Coffee Chats') and not privately with each of the listed users in the chat rooms.

### Chat Features

* The goal of the app is to take in a username to allow someone to "login", and then see a set of chat rooms with available messages. When you click into a room, you can view past messages, as well as add new messages.

* The first screen you should see is the "login" screen. A user can type a username they'll use, and if they provide some string and hit "Join the DoorDash Chat!" button, we'll save their username for when they add new messages.

* When you've submitted a username, we'll load up the chat interface.

* On the left, we have:
    * user info
      * username
      * time that user has been online
    * list of rooms available

On the right, we have the selected chat room. There, we show:

* room information
  * room name,
  * list of usernames of users in the room
* messages
  * message text
  * username of the user that posted it
  * newest messages on the bottom, older on the top
  * scroll the view to see older messages
The left panel should be a fixed width, and the right panel should stretch to accommodate

### Handling state tranisitions and errors

* After the initial app component is mounted, the app will make API requests to `http://localhost:8080/api` to get previously existing chatroom data. During this time, the 'Loading Data... Please wait...' messaging appears.

* In case the database server is down, the chat app will display the error message.


### Possible future features

* Build in multi-user real time chat feature if there are API endpoints supporting it.

* If I have more time, I would write more integration tests to cover all the possible use cases.

### Testing

* Test cases considered during development:

  - On app start, the hardcoded user "Piggy" is signed in and shown on the app header top right hand 

  - When a chat room is selected, all the past messages would appear in the chat room content.

  - If nothing is typed into the input box, no new messages will be posted even when hitting the 'Send' button.

* I am building a separate Storybook repository to test the components and the app page layout. If I get to present this project in a phone interview, I will have it ready to show to the interviewer.


### Project design

* This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

* It uses CSS grid layout and also https://semantic-ui.com/ library to make the UI appearances.

