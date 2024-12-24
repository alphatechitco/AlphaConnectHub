require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const devicesRoute = require('./routes/devicesRoute')
const userRoutes = require('./routes/userRoutes')
const subscriptionRoute = require('./routes/subscriptionRoute')


const app = express();


app.use(bodyParser.json())

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST',
}))



// User Related API Routing
app.use('/user', userRoutes)

// Device Related API Routing
app.use('/devices', devicesRoute)

// Subscription Related API Routing
app.use('/subscription', subscriptionRoute)


app.listen(3001, ()=>{
    console.log("Server Side Is Functional At Port 3001")
})