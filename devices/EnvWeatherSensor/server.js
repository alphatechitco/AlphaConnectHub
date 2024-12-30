const express = require('express');
const PowerRoute = require('./routes/PowerRoute');
const OperationRoute = require('./routes/OperationRoute');
const deviceStatusRoute = require ('./routes/deviceStatusRoute')
const path = require('path');
const app = express();
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST',
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle '/power' API endpoints
app.use('/power', PowerRoute);
app.use('/operation', OperationRoute)
app.use('/devices', deviceStatusRoute)



// Route to serve the main index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server on a dynamic port or default to 3002
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
