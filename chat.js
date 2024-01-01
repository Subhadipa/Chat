// Server side
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
let user=[]
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Listen for a custom event
//   socket.on('chatMessage', (msg) => {
//     console.log('Message:', msg);
//     // Broadcast the message to all connected clients
//     socket.broadcast.emit('chatMessage', msg);
//   });

// //   // Disconnect event
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });
io.on('connection', (socket) => {
    console.log('A user connected',socket);
  
    // Listen for user login with their unique user ID
    socket.on('login', ({userId}) => {
      // Join a room based on the user ID
      socket.join(userId);
      console.log(`User ${userId} joined the room`);
  
      // Broadcast a welcome message to the user in their private room
      io.to(userId).emit('chatMessage', `User ${userId} Welcome to the private room!`);
    });
  
    // Listen for private chat messages
    socket.on('privateMessage', ({targetUserId, message }) => {
      // Send the private message to the target user in their private room
      console.log("targetUserId=>",targetUserId)
      io.to(targetUserId).emit('chatMessage', `Private message from User ${socket.id}: ${message}`);
      console.log(`Private message from User ${socket.id}: ${message}`)
    });
  
    // Listen for user disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
  

server.listen(3000, () => {
  console.log('Server listening on port 3000 for socket');
});

// {
   // "userId":1
//    "targetUserId":2,
//    "message": "Hello I'm user-1"
// }