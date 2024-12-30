require('dotenv').config()
const express = require('express')
const cors = require('cors')
const {exec} = require('child_process'); 
const bodyParser = require('body-parser')
const devicesRoute = require('./routes/devicesRoute')
const userRoutes = require('./routes/userRoutes')
const subscriptionRoute = require('./routes/subscriptionRoute')
const realTimeUpdate = require('./routes/realTimeUpdate');
const { stdout, stderr } = require('process');

const app = express();


app.use(bodyParser.json())

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST',
}))

exec('mosquitto -v', (error, stdout,stderr) => {
    if(error){
        console.error(`Error Starting starting Mosquito: ${error.message}`)
        return;
    }
    console.log(`Mosquuito Started: ${stdout}`)
    if(stderr) {
        console.error(`Mosquitto stderr: ${stderr}`)
    }
})

// User Related API Routing
app.use('/user', userRoutes)

// Device Related API Routing
app.use('/devices', devicesRoute)

app.use('/devices/realtime', realTimeUpdate)

// Subscription Related API Routing
app.use('/subscription', subscriptionRoute)


app.listen(3001, ()=>{
    console.log("Server Side Is Functional At Port 3001")
})