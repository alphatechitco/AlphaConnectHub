const express = require('express')
const router = express.Router();
const Devices = require('../modules/Devices/Devices');

// API Endpoint To Fetch The Devices(Info & Details)
router.get('/get-devices', async (req, res)=>{  

    try{
        console.log("Api Triggered")
        console.log("Req Dev ", req.query)
        const {profile_id} = req.query;
        console.log("Prof", profile_id)
        const devices = new Devices();
        const device_id = null;

        const result = await devices.getDevices(device_id,profile_id);

        if(!result.fetch) {
            res.status(404).json({fetch:false,result:[]})
        } else {
            console.log("Router Data ", result)
            res.status(200).json({result})
        }
    } catch (error) {
        console.error("Internal Server Error!", error)
        res.status(500).json({message:"Internal Server Error!"})
    }
})

router.delete('/delete-device/:device_id', async (req, res) => {
    try {
        console.log("API")
        const device_id = req.params.device_id;

        const devices = new Devices();
        const result = await devices.deleteDevice(device_id);

        if(result.success) {
            res.status(200).json({delete:true})
        } else if(!result.success) {
            res.status(403).json({delete:false})
        }
    } catch (error) {
        res.status(500).json({delete:false, message:"Could Not Delete Device"})
    }
})

router.post('/reg-device', async (req, res)=>{
    console.log("API Called ")
    try {
        const { user_id, profile_id, device_name, device_type, description, mqtt_topic } = req.body;
        console.log(user_id, profile_id, device_name, device_type, description, mqtt_topic)
        const devices = new Devices();

        const result = await devices.regDevice(user_id,profile_id,device_name,device_type,description,mqtt_topic);

        if(result.reg) {
            res.status(200).json({result})
        } else if(!result.reg) {
            res.status(400).json({result})
        }

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