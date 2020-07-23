## DD Chat App

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

* This chat app lists the available chat rooms along with all the users belonging to each of the chat rooms.

* When the app starts, it requires the currently signed in user (aka "Piggy" here) to select which chat room to message in. The "Send" button of the Input box is disabled until the user selects a chat room to message in.

* 

### Possible future features

* Build in multi-user real time chat feature if there are API endpoints supporting it.

### Testing

* Test cases considered during development:

  - On app start, the hardcoded user "Piggy" is signed in and shown on the app header top right hand 

  - When a chat room is selected, all the past messages would appear in the chat room content

* I am building a separate Storybook repository to test the components and the app page layout. If I get to present this project in a phone interview, I will have it ready to show you.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

