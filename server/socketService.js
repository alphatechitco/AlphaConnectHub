const socketIo = require('socket.io');
const cors = require('cors');
let io;

function initSocket (server) {
    io = socketIo(server,  {
        cors: {
            origin: "http://localhost:3000", // Adjust according to your frontend
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.emit('message', 'Welcome to the server!');
        
        socket.on('disconnect', () => {
          console.log('a user disconnected');
        });
      });
}

function sendToFrontend (heading,data) {
    if(io) {
        io.emit(heading, data);
    } else {
        console.error('socket.io is not initialized!')
    }
}

module.exports = {initSocket, sendToFrontend};