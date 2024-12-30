const express = require('express')
const router = express.Router();
const Devices = require('../modules/Devices/Devices');

// API Endpoint To Fetch The Devices(Info & Details)
router.get('/get-devices', async (req, res)=>{  

    try{
        console.log("Api Triggered")
    
        const devices = new Devices();

        const result = await devices.getDevices();

        if(result) {
            console.log("Router Data ", result)
            res.status(200).json({result})
        } else {
            res.status(404).json({})
        }
    } catch (error) {
        console.error("Internal Server Error!")
        res.status(500).json({message:"Internal Server Error!"})
    }
})

router.post('reg-device', async (req, res)=>{
    
    try {

    } catch (error) {
        console.error("Internal Server Error!")
        res.status(500).json({message:"Internal Server Error!"})
    }
})

router.get('/data', async (req, res)=>{

    try {
        const {data} = req.body;

    } catch (error) {
        console.error("Error While Getting Device Data")
        res.status(500).json({message:"Internal Server Error"})
    }
})
module.exports = router