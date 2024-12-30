const express = require('express')
const router = express.Router();

const DeviceOperation = require('../DeviceOperation')

router.post('/changeState', async (req, res) => {
    console.log("API")
    try {
        const {state, opState} = req.body;
        console.log(state)
        console.log(opState)

        if (state == "ON") {
            DeviceOperation.startDeviceON();
        
        res.json({ message: "Device turned ON" });
        } else if (state === "OFF" ) {
            DeviceOperation.stopDeviceON();
            res.json({ message: "Device turned OFF" });

        }

    } catch (error) {
        console.log(error);
    }
})

module.exports = router;