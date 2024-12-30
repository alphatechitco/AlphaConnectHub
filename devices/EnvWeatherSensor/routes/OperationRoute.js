const express = require('express')
const router = express.Router();

const DeviceOperation = require('../DeviceOperation')

router.post('/changeState', async (req, res) => {
    

    try {
        const {opState} = req.body;
        console.log("Router",opState)

        if (!opState) {
            DeviceOperation.stopDeviceDataTrans();
            res.status(200).json({message:"Operation Stopped"})
        } else {
            DeviceOperation.startDataTransmission();
            res.status(200).json({message:"Operation Started"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error")
    }
})

module.exports = router;