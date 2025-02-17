require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const devicesRoute = require('./routes/devicesRoute');
const userRoutes = require('./routes/userRoutes');
const profileRoute = require('./routes/profileRoute');
const subscriptionRoute = require('./routes/subscriptionRoute');
const mqttRoute = require('./routes/mqttRoute');
const protectedRoute = require('./routes/protectedRoute');
const { stdout, stderr } = require('process');
const {initSocket,sendToFrontend} = require('./socketService')

const app = express();
const server = http.createServer(app);
initSocket(server);


app.use(bodyParser.json())
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials:true,
}));




// User Related API Routing
app.use('/user', userRoutes);

// Device Related API Routing
app.use('/devices', devicesRoute);


// Subscription Related API Routing
app.use('/subscription', subscriptionRoute);

app.use('/mqtt', mqttRoute);

app.use('/profile', profileRoute);

app.use('/protected', protectedRoute);





module.exports = {
sendToFrontend
}

server.listen(3001, () => {
    console.log(`Server running on http://localhost:3001`);
});


