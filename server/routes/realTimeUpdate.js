const express = require('express')
const router = express.Router();
const Authenticate = require('../modules/Devices/Authenticate')
const AuthenticateSignature = require('../modules/Authenticate/signature')

let deviceDataStorage = {}

router.post('/operation', async (req, res) => {

    console.log("API Triggered")

    try {
       
    const device_id = req.headers['device-id'];
    console.log(device_id)
    const serial_number = req.headers['serial-number'];
    console.log(serial_number)
    const api_key = req.headers['api-key'];
    console.log(api_key)

    const auth = new Authenticate()
    const result = await auth.AuthenticateDevice(device_id,serial_number,api_key)

    if(!result.auth) {
        return res.status(301).json({send:false, messsage:"UnAuthorized"})
    }

    const {sensorData} = req.body;
    console.log("Dev Rec",sensorData)

    deviceDataStorage[device_id] = {sensorData}

} catch (error) {
    console.log(error)
    res.status(500).json("Internal Server Error")
}
 
})

router.post('/webhook', async (req, res) => {

    console.log("API Triggered")

    try {

        const receievedSignature = req.headers['x-signature']

        const payload  = JSON.stringify(req.body)

        if(AuthenticateSignature.verifySignature(payload, receievedSignature)) {
            //deviceDataStorage[device_id] = {}
            console.log("Authenticated")
            
            res.status(200).send('Request authenticated');
        } else {
            console.log('Invalid signature');
            return res.status(403).json({send:false, messsage:"Invalid"})
    }
        

} catch (error) {
    console.log(error)
    res.status(500).json("Internal Server Error")
}
 

})


router.get('/userReqOp', async (req, res) => {
    try {

    const device_id = req.query.d_id;

    const device_operation = deviceDataStorage[device_id];

    if(!device_operation) {
        return res.status(404).json({success:false,messsage:"NO Data Found, Check Device"})
    }

    res.status(200).json({success:true,device_operation})

} catch (error) {
    console.log(error)
    res.status(500).json("Internal Server Error")
    
}
})


module.exports = router